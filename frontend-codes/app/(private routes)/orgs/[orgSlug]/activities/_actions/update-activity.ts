"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateActivityOverview(activityId: string, data: any, orgSlug: string) {
  try {
    await prisma.activity.update({
      where: { id: activityId },
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        difficulty: data.difficulty,
        points: data.points,
        // Convert undefined back to null for the database
        programId: data.programId || null,
        courseId: data.courseId || null,
      },
    });

    revalidatePath(`/orgs/${orgSlug}/activities/${activityId}`);
    return { status: "success", message: "Activity overview saved successfully." };
  } catch (error) {
    console.error("Failed to update activity:", error);
    return { status: "error", message: "Failed to save changes." };
  }
}