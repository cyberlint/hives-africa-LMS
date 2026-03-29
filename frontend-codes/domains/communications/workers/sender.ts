import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import { templates } from "../templates";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

const MAX_RETRIES = 3;
const BATCH_SIZE = 20;

/**
 * Executes a batch processing job to send queued emails.
 */
export async function processPendingEmails() {
  console.log("[Email Worker] 🚀 Starting batch...");

  const jobs = await prisma.emailJob.findMany({
    where: {
      status: "pending",
      scheduledAt: { lte: new Date() },
    },
    take: BATCH_SIZE,
    orderBy: { scheduledAt: "asc" },
  });

  if (jobs.length === 0) {
    console.log("[Email Worker] 💤 No jobs found.");
    return;
  }

  console.log(`[Email Worker] 📦 Processing ${jobs.length} jobs`);

  await Promise.all(
    jobs.map(async (job) => {
      try {
        // 🔒 STEP 1: Lock job (prevent duplicate execution)
        const locked = await prisma.emailJob.updateMany({
          where: {
            id: job.id,
            status: "pending",
          },
          data: {
            status: "processing",
          },
        });

        if (locked.count === 0) {
          return; // already picked by another worker
        }

        // 👤 STEP 2: Get user
        const user = await prisma.user.findUnique({
          where: { id: job.userId },
          select: { email: true, name: true },
        });

        if (!user?.email) {
          throw new Error("Invalid user/email");
        }

        // 🧠 STEP 3: Resolve template
        const templateFn = templates[job.templateKey];

        if (!templateFn) {
          throw new Error(`Template not found: ${job.templateKey}`);
        }

        const { subject, html } = templateFn(job.payload, user.name || "");

        // 📤 STEP 4: Send email
        const { error } = await resend.emails.send({
          from: `NextHive <${process.env.EMAIL_FROM}>`,
          to: [user.email],
          subject,
          html,
        });

        if (error) {
          throw new Error(error.message);
        }

        // ✅ STEP 5: Mark success
        await prisma.emailJob.update({
          where: { id: job.id },
          data: {
            status: "sent",
            sentAt: new Date(),
          },
        });

        console.log(`[Email Worker] ✅ Sent → ${user.email}`);
      } catch (error: any) {
        console.error(`[Email Worker] ❌ Failed job ${job.id}`, error);

        const attempts = job.attempts + 1;

        await prisma.emailJob.update({
          where: { id: job.id },
          data: {
            attempts,
            lastError: error.message,
            status: attempts >= MAX_RETRIES ? "failed" : "pending",
            scheduledAt: new Date(Date.now() + attempts * 60 * 1000), // retry delay
          },
        });
      }
    })
  );

  console.log("[Email Worker] 🏁 Batch complete.");
}