"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteActivity(activityId: string, orgSlug: string) {
  try {
    await prisma.activity.delete({
      where: { id: activityId },
    });
  } catch (error) {
    console.error("Failed to delete activity:", error);
    return { status: "error", message: "Failed to delete activity." };
  }

  // We revalidate and redirect outside the try-catch because redirect() throws a special error in Next.js
  revalidatePath(`/orgs/${orgSlug}/activities`);
  redirect(`/orgs/${orgSlug}/activities`);
}