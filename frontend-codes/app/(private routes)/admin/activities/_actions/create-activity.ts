"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { ActivityVisibilityEnum } from "@/lib/zodSchemas"; 

export async function createActivityDraft(creatorId: string) {
  try {
    // 1. Create a blank draft in the database
    const activity = await prisma.activity.create({
      data: {
        title: "Untitled Activity",
        description: "",
        type: "Project", // Default starting type from our Enum
        status: "Draft",
        visibility: ActivityVisibilityEnum.parse("Private"), // Default to private until published
        difficulty: "Intermediate",
        creatorId: creatorId,
      },
    });

    // 2. Return the new ID so we can redirect to the editor
    return { status: "success", activityId: activity.id };
  } catch (error) {
    console.error("Failed to create activity draft:", error);
    return { status: "error", message: "Failed to create draft" };
  }
}