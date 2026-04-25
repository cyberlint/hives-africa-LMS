import { prisma } from "@/lib/db";
import { SystemEvent } from "../events/publisher";

export async function evaluateRulesForEvent(event: SystemEvent) {
  console.log(`[Rule Engine] ⚙️ Evaluating rules for: ${event.type}`);
  
  // 1. Check if there are any active rules for this specific event type
  const rules = await prisma.emailRule.findMany({
    where: {
      eventType: event.type,
      isActive: true,
    },
  });

  if (rules.length === 0) {
    console.log(`[Rule Engine] ⏸️ No active rules found for ${event.type}. Doing nothing.`);
    return;
  }

  // 2. If rules exist, create the pending Jobs!
  for (const rule of rules) {
    const scheduledAt = new Date(Date.now() + rule.delay * 60 * 1000);

    await prisma.emailJob.create({
      data: {
        userId: event.userId,
        templateKey: rule.templateKey,
        payload: event.payload,
        scheduledAt,
        status: "pending", // The worker will pick this up later
        channel: rule.channel, // email, in_app, push
      },
    });

    console.log(`[Rule Engine] 📥 Queued Email Job: '${rule.templateKey}' for User '${event.userId}'`);
  }
}