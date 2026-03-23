"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateActivityKSBs(
    activityId: string, 
    ksbs: { 
        ksbId: string; 
        weight: number
    }[]) {
  try {
    // Run as a transaction to prevent orphaned relations
    await prisma.$transaction([
      // 1. Clear out the old mappings
      prisma.activityKSB.deleteMany({
        where: { activityId },
      }),
      // 2. Insert the updated list
      prisma.activityKSB.createMany({
        data: ksbs.map((ksb) => ({
          activityId,
          ksbId: ksb.ksbId,
          weight: ksb.weight,
        })),
      }),
    ]);

    revalidatePath(`/admin/activities/${activityId}`);
    return { status: "success", message: "KSB mappings saved successfully." };
  } catch (error) {
    console.error("Failed to update KSB mappings:", error);
    return { status: "error", message: "Failed to save KSBs." };
  }
}