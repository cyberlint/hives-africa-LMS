// This file manages the batching of communication events. It collects events for each user and event type, and once a certain threshold is reached, it triggers the processing of the batch. This helps to optimize the sending of communications by reducing the number of individual messages sent to users in a short period of time.

import { EventType, EVENT_TYPES } from "../events/event-types";

type BatchItem = {
  userId: string;
  type: EventType;
  payload: any;
  createdAt: number;
};

const batchStore: Record<string, BatchItem[]> = {};
const processingLocks: Record<string, boolean> = {};

const THRESHOLD = 5; // Adjust as needed based on real-world usage and testing.

export function addToBatch(event: BatchItem) {
  const key = `${event.userId}:${event.type}`;

  if (!batchStore[key]) {
    batchStore[key] = [];
  }

  batchStore[key].push(event);

  if (batchStore[key].length >= THRESHOLD) {
    void triggerBatchFlush(event.userId, event.type); // intentional
  }
}

async function triggerBatchFlush(userId: string, type: EventType) {
  const key = `${userId}:${type}`;

  if (processingLocks[key]) return;

  processingLocks[key] = true;

  try {
    if (type === EVENT_TYPES.SPARK_RECEIVED) {
      const { processSparkBatch } = await import("./processSparkBatch");
      await processSparkBatch(userId);
    }
  } finally {
    processingLocks[key] = false;
  }
}

export function getBatch(userId: string, type: EventType) {
  return batchStore[`${userId}:${type}`] || [];
}

export function clearBatch(userId: string, type: EventType) {
  delete batchStore[`${userId}:${type}`];
}