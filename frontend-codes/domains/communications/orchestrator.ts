import { EVENT_TYPES, EventType } from "./events/event-types";
import { addToBatch } from "./batching/store";
import { handleImmediateEvent } from "./handlers"; // Import the dispatcher instead of individual handlers

interface EventPayload {
  type: EventType;
  userId: string;
  payload: any;
}

export async function handleEvent(event: EventPayload) {
  switch (event.type) {
    
    // 1. ROUTE TO BATCHING
    case EVENT_TYPES.SPARK_RECEIVED: {
      console.log(`[COMMUNICATION] Adding event to batch for user ${event.userId}`);
      addToBatch({
        userId: event.userId,
        type: event.type,
        payload: event.payload,
        createdAt: Date.now(),
      });
      return;
    }

    // Add more batched events here later
    // case EVENT_TYPES.ACTIVITY_MILESTONE_REACHED:
    //   addToBatch({...})
    //   return;

    // 2. ROUTE EVERYTHING ELSE TO IMMEDIATE DISPATCH
    default:
      console.log(`[COMMUNICATION] Routing ${event.type} to immediate dispatcher...`);
      return handleImmediateEvent(event);
  }
}