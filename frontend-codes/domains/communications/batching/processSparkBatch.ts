import { getBatch, clearBatch } from "./store";
import { prisma } from "@/lib/db";

export async function processSparkBatch(userId: string) {
  const batch = getBatch(userId, "Spark_Received");

  if (!batch.length) return;

  const total = batch.length;

  // Create a job instead of sending directly
  await prisma.emailJob.create({
    data: {
      userId,
      templateKey: "spark_batch",
      payload: {
        total,
        actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/community/`,
      },
      scheduledAt: new Date(),
      status: "pending",
    },
  });

  clearBatch(userId, "Spark_Received");
}