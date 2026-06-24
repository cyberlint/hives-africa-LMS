"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateActivityStatus(activityId: string, status: "Draft" | "Published" | "Archived") {
  try {
    await prisma.activity.update({
      where: { id: activityId },
      data: { status },
    });

    // Refresh both the editor and the main list
    revalidatePath(`/admin/activities/${activityId}`);
    revalidatePath(`/admin/activities`);
    
    return { status: "success", message: `Activity marked as ${status.toLowerCase()}.` };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { status: "error", message: "Failed to update status." };
  }
}