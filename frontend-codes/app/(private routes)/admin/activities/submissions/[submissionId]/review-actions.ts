"use server"

import { revalidatePath } from "next/cache"
import { SubmissionStatus } from "@prisma/client"
import { prisma } from "@/lib/db" 
import { eventBus } from "@/domains/communications/events/publisher"

export async function submitInstructorReview({
  submissionId,
  reviewerId,
  status,
  feedback,
  rubricScores,
  score,
}: {
  submissionId: string
  reviewerId: string
  status: SubmissionStatus
  feedback: string
  rubricScores: Record<string, number> 
  score: number
}) {
  try {
    console.log("1. Starting review submission...")

    const submission = await prisma.$transaction(async (tx) => {
      console.log("2. Inside transaction: Creating Review...")
      await tx.review.create({
        data: {
          submissionId,
          reviewerId,
          type: "Instructor",
          score,
          feedback,
          rubricScores,
        },
      })

      console.log("3. Inside transaction: Updating Submission Status...")
      const updatedSub = await tx.submission.update({
        where: { id: submissionId },
        data: { status },
        include: { user: true, activity: true }
      })

      console.log("4. Inside transaction: Awarding KSBs...")
      if (status === "Approved" && updatedSub.userId) {
        const awardedKsbIds = Object.keys(rubricScores)
        
        // Prisma will crash if you pass an empty array to createMany
        if (awardedKsbIds.length > 0) {
          const userKsbRecords = awardedKsbIds.map(ksbId => ({
            userId: updatedSub.userId!,
            ksbId: ksbId,
          }))

          await tx.userKSB.createMany({
            data: userKsbRecords,
            skipDuplicates: true, 
          })
        }

        console.log("4.5 Inside transaction: Awarding Reputation...")
        // Only award points if the activity actually has a point value assigned
        if (updatedSub.activity.points > 0) {
          await tx.reputationTransaction.create({
            data: {
              userId: updatedSub.userId,
              points: updatedSub.activity.points, // Pulls the base points from the Activity model
              reason: `Project Approved: ${updatedSub.activity.title}`,
              activityId: updatedSub.activityId
            }
          })
        }
        console.log("4.6 Inside transaction: Generating Social Portfolio Item...")
        await tx.portfolioItem.create({
          data: {
            userId: updatedSub.userId,
            submissionId,
            title: updatedSub.activity.title,
            description: `Verified completion of ${updatedSub.activity.title}`,
          }
        })
      }

      return updatedSub
    })

    console.log("5. Transaction complete. Firing Event Bus for Communications...")

    // Wrap the Event Bus in a try/catch so a notification failure doesn't freeze the app!
    try {
      const eventPayload = {
        activityId: submission.activityId,
        activityTitle: submission.activity.title,
        feedback,
      }

      if (status === "Approved") {
        await eventBus.publish({
          type: "Submission_Approved",
          userId: submission.userId!,
          payload: eventPayload,
        })
      } else if (status === "Revision_Required") {
        await eventBus.publish({
          type: "Submission_Revision_Required",
          userId: submission.userId!,
          payload: eventPayload,
        })
      } else if (status === "Rejected") {
        await eventBus.publish({
          type: "Submission_Rejected",
          userId: submission.userId!,
          payload: eventPayload,
        })
      }
      console.log("6. Event Bus fired successfully.")
    } catch (eventError) {
      // We log this but DO NOT throw it, because the DB update was already successful
      console.error("⚠️ Event Bus failed, but grading succeeded:", eventError)
    }

    console.log("7. Purging cache and returning success...")
    
    // Purge the current page and the dashboard
    revalidatePath("/admin/activities/submissions")
    revalidatePath(`/admin/activities/submissions/${submissionId}`)
    
    return { success: true }

  } catch (error: any) {
    console.error("🚨 CRITICAL ERROR in submitInstructorReview:", error)
    return { success: false, error: error.message || "Failed to save review" }
  }
}