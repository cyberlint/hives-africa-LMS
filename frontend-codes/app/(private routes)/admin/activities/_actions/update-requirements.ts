"use server";

import { prisma } from "@/lib/db"; // Matched your import!
import { revalidatePath } from "next/cache";

export async function updateActivityRequirements(activityId: string, requirements: any[]) {
  try {
    // Run as a transaction to ensure we don't end up with partial data
    await prisma.$transaction([
      // 1. Delete existing requirements for this activity
      prisma.activityRequirement.deleteMany({
        where: { activityId },
      }),
      // 2. Create the new ones
      prisma.activityRequirement.createMany({
        data: requirements.map((req) => ({
          activityId,
          type: req.type,
          config: req.config,
        })),
      }),
    ]);

    revalidatePath(`/admin/activities/${activityId}`);
    return { status: "success", message: "Requirements saved successfully." };
  } catch (error) {
    console.error("Failed to update requirements:", error);
    return { status: "error", message: "Failed to save requirements." };
  }
}