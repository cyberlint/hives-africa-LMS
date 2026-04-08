import { evaluateRulesForEvent } from "../engine/rule-evaluator";
import { EventType } from "./event-types";
import { prisma } from "@/lib/db";

// 1. Strict dictionary of everything that can happen in NextHive
export type SystemEvent = {
  type: EventType;
  userId: string;
  payload: Record<string, any>;
};

// 2. The Mail Chute
export const eventBus = {
  publish: async (event: SystemEvent) => {
    console.log(`[Event Bus] 📢 Heard event: ${event.type}`);

    // persist event
    await prisma.eventLog.create({
      data: {
        type: event.type,
        userId: event.userId,
        payload: event.payload,
      },
    });
    // In the future (Phase 2), this line changes to send the event to a Redis Queue.
    // For now (Phase 1), we pass it directly to our local engine in the background.
    // Notice we DO NOT 'await' this. We let it run in the background so the user isn't kept waiting!
    evaluateRulesForEvent(event).catch((err) => {
      console.error(`[Event Bus] ❌ Error processing event behind the scenes:`, err);
    });
  }
};