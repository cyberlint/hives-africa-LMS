import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

/**
 * Log an event for a user.
 * @param userId - ID of the user
 * @param type - Event type (e.g., Submission_Approved)
 * @param payload - Optional additional info (JSON)
 */
export async function logUserEvent(
  userId: string,
  type: string,
  payload?: Prisma.InputJsonValue // Use Prisma's exact JSON type here
) {
  try {
    return await prisma.eventLog.create({
      data: { 
        userId, 
        type, 
        // If payload is undefined, tell Prisma to store an explicitly null JSON value
        payload: payload ?? Prisma.JsonNull 
      },
    });
  } catch (error) {
    console.error("Failed to log user event:", error);
  }
}