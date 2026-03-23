"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateActivitySettings(activityId: string, data: any) {
  try {
    await prisma.activity.update({
      where: { id: activityId },
      data: {
        visibility: data.visibility,
        isMandatory: data.isMandatory,
        // Ensure empty strings are cast to null for the database
        startDate: data.startDate ? new Date(data.startDate) : null,
        deadline: data.deadline ? new Date(data.deadline) : null,
      },
    });

    revalidatePath(`/admin/activities/${activityId}`);
    return { status: "success", message: "Activity settings saved successfully." };
  } catch (error) {
    console.error("Failed to update settings:", error);
    return { status: "error", message: "Failed to save settings." };
  }
}