"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateActivityStatus(activityId: string, status: "Draft" | "Published" | "Archived", orgSlug: string) {
  try {
    await prisma.activity.update({
      where: { id: activityId },
      data: { status },
    });

    // Refresh both the editor and the main list
    revalidatePath(`/orgs/${orgSlug}/activities/${activityId}`);
    revalidatePath(`/orgs/${orgSlug}/activities`);
    
    return { status: "success", message: `Activity marked as ${status.toLowerCase()}.` };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { status: "error", message: "Failed to update status." };
  }
}