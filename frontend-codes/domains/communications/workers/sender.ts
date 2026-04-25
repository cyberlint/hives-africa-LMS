import { prisma } from "@/lib/db";
import { Resend } from "resend";
import { templates } from "../templates";
import { getUserContext } from "../utils/getUserContext";

const resend = new Resend(process.env.RESEND_API_KEY);

const MAX_RETRIES = 5;
const BATCH_SIZE = 10; // Lowered to safely fit inside Vercel's 10-second window

// Rate limit helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Executes a batch processing job to send queued communications.
 * Supports multiple channels: email, in_app, push.
 */
export async function processPendingEmails() {
  console.log("[Worker] 🚀 Starting batch...");

  const jobs = await prisma.emailJob.findMany({
    where: {
      status: "pending",
      scheduledAt: { lte: new Date() },
    },
    take: BATCH_SIZE,
    orderBy: { scheduledAt: "asc" },
  });

  if (jobs.length === 0) {
    console.log("[Worker] No jobs found.");
    return;
  }

  console.log(`[Worker] 📦 Processing ${jobs.length} jobs sequentially`);

  for (const job of jobs) {
    try {
      // 🔒 STEP 1: Lock job (prevent duplicate execution in concurrent workers)
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
        continue; // already picked up by another worker instance
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

      if (!templateFn || typeof templateFn !== "function") {
        throw new Error(`Template not found or invalid: ${job.templateKey}`);
      }

      const userContext = await getUserContext(job.userId);
      
      const { subject, html } = templateFn(job.payload, userContext);

      // 📤 STEP 4: Channel routing (email / in_app / push)
      switch (job.channel) {
        case "email": {
          const { error } = await resend.emails.send({
            from: `NextHive <${process.env.EMAIL_FROM}>`,
            to: [user.email],
            subject,
            html,
          });

          if (error) throw new Error(error.message);
          break;
        }

        case "in_app": {
          // future: store notification in DB for in-app feed
          await prisma.notification.create({
            data: {
              userId: job.userId,
              title: subject,
              body: html,
              type: "in_app",
            },
          });
          break;
        }

        case "push": {
          // future: FCM / Expo / OneSignal integration
          console.log("[Worker] Push channel not implemented yet");
          break;
        }

        default:
          throw new Error(`Unknown channel: ${job.channel}`);
      }

      // ✅ STEP 5: Mark success
      await prisma.emailJob.update({
        where: { id: job.id },
        data: {
          status: "sent",
          sentAt: new Date(),
        },
      });

      console.log(`[Worker] ✅ Sent → ${user.email}`);
    } catch (error: any) {
      console.error(`[Worker] ❌ Failed job ${job.id}`, error);

      const attempts = job.attempts + 1;

      await prisma.emailJob.update({
        where: { id: job.id },
        data: {
          attempts,
          lastError: error.message,
          status: attempts >= MAX_RETRIES ? "failed" : "pending",
          scheduledAt: new Date(Date.now() + attempts * 60 * 1000),
        },
      });
    }

    // RATE LIMIT PROTECTION
    await delay(250);
  }

  console.log("[Worker] Batch complete.");
}