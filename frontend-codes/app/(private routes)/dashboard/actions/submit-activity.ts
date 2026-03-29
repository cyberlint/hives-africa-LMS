"use server"

import { prisma } from "@/lib/db"
import { requireAuth } from "@/domains/auth/require-auth"
import { revalidatePath } from "next/cache"

export async function createActivitySubmission(activityId: string, content: Record<string, string>, pathname: string) {
  try {
    const user = await requireAuth()

    // 1. Double-check they haven't already submitted (Server-side security)
    const existing = await prisma.submission.findFirst({
      where: { activityId, userId: user.id }
    })

    if (existing) {
      return { success: false, error: "You have already submitted this activity." }
    }

    // 2. Create the Submission record
    await prisma.submission.create({
      data: {
        activityId: activityId,
        userId: user.id,
        content: content, // We store the dynamic form data directly into the JSON column
        status: "Submitted",
        submittedAt: new Date()
      }
    })

    // 3. Force Next.js to refresh the page cache so the UI updates instantly
    revalidatePath(pathname)

    return { success: true }
  } catch (error) {
    console.error("Submission Error:", error)
    return { success: false, error: "Failed to submit proof of work. Please try again." }
  }
}