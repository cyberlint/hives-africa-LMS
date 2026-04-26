"use server"

import { prisma } from "@/lib/db"
import { requireAuth } from "@/domains/auth/require-auth"
import { revalidatePath } from "next/cache"
import { SplitStatus } from "@prisma/client"

export async function createActivitySubmission(
  activityId: string, 
  content: Record<string, any>, 
  pathname: string,
  hiveId?: string | null,
  rosterSplits?: Record<string, number> // e.g., { "user_id": 40, "user_id_2": 60 }
) {
  try {
    const user = await requireAuth()

    // 1. Double-check for existing submission
    const existing = await prisma.submission.findFirst({
      where: { activityId, userId: user.id }
    })

    if (existing) {
      return { success: false, error: "You have already submitted this activity." }
    }

    // 2. Use a Transaction to create Submission + Roster entries
    const result = await prisma.$transaction(async (tx) => {
      const submission = await tx.submission.create({
        data: {
          activityId,
          userId: user.id,
          hiveId: hiveId || null,
          content,
          status: "Submitted",
          submittedAt: new Date()
        }
      })

      // 3. If this is a Hive submission, create the Roster Splits
      if (hiveId && rosterSplits) {
        const rosterEntries = Object.entries(rosterSplits).map(([memberId, share]) => ({
          submissionId: submission.id,
          userId: memberId,
          claimedShare: share / 100, // Convert percentage to decimal
          // The submitter auto-approves their own proposal, others remain PENDING
          approvalStatus: memberId === user.id ? SplitStatus.APPROVED : SplitStatus.PENDING
        }))

        await tx.submissionRoster.createMany({
          data: rosterEntries
        })
      }

      return submission
    })

    revalidatePath(pathname)
    return { success: true }
  } catch (error) {
    console.error("Submission Error:", error)
    return { success: false, error: "Failed to transmit proof of work." }
  }
}