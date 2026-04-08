"use server"

import { requireAuth } from "@/domains/auth/require-auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

interface SubmissionData {
  activityId: string
  hiveId: string | null
  verificationUrl: string
  rosterSplits: { userId: string; share: number }[]
}

export async function submitActivityWork(data: SubmissionData) {
  const session = await requireAuth()

  // 1. Validation: Equity must equal exactly 100% for teams
  if (data.hiveId && data.rosterSplits.length > 0) {
    const totalShare = data.rosterSplits.reduce((acc, curr) => acc + curr.share, 0)
    if (Math.abs(totalShare - 100) > 0.1) {
      return { error: "Equity split must equal exactly 100%." }
    }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 2. Create the base Submission record
      const submission = await tx.submission.create({
        data: {
          activityId: data.activityId,
          hiveId: data.hiveId,
          userId: session.id,
          verificationUrl: data.verificationUrl,
          content: {}, 
          status: "Under_Review",
          submittedAt: new Date()
        }
      })

      // 3. Create the Reputation Roster (Smart Split)
      if (data.hiveId && data.rosterSplits.length > 0) {
        await tx.submissionRoster.createMany({
          data: data.rosterSplits.map(split => ({
            submissionId: submission.id,
            userId: split.userId,
            claimedShare: split.share / 100, // Store as a decimal (e.g., 0.25)
            // The person submitting auto-approves their own claim; others must accept via the dashboard
            approvalStatus: split.userId === session.id ? 'APPROVED' : 'PENDING' 
          }))
        })
      } else {
        // Solo Contender gets 100% automatically
        await tx.submissionRoster.create({
          data: {
            submissionId: submission.id,
            userId: session.id,
            claimedShare: 1.0,
            approvalStatus: 'APPROVED'
          }
        })
      }

      // 4. Update the active participation progress to 100%
      await tx.participation.updateMany({
        where: {
          activityId: data.activityId,
          userId: session.id
        },
        data: { progress: 100 }
      })

      return submission
    })

    // Cache Busting
    revalidatePath(`/activities/${data.activityId}`)
    if (data.hiveId) {
      revalidatePath(`/community/hives/${data.hiveId}/workspace`) // To show the "Under Review" badge
    }

    return { success: true, submissionId: result.id }

  } catch (error) {
    console.error("Submission Error:", error)
    return { error: "Failed to submit work. Please try again." }
  }
}