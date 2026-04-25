"use server"

import { prisma } from "@/lib/db" // Adjust path to your Prisma client
import { requireAuth } from "@/domains/auth/require-auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { CreateSignalSchema, CreateThreadSchema } from "@/lib/zodSchemas"
import { EVENT_TYPES } from "@/domains/communications/events/event-types"
import { eventBus } from "@/domains/communications/events/publisher"

// Infer the exact TypeScript shape directly from your Zod schema
export type CreateSignalPayload = z.infer<typeof CreateSignalSchema>

/**
 * Creates a new Signal and calculates its Trust Score based on verifiable proof.
 */
export async function createSignal(rawPayload: CreateSignalPayload) {
  const session = await requireAuth()
  const userId = session.id

  // 0. ZOD VALIDATION (The Gatekeeper)
  const validatedFields = CreateSignalSchema.safeParse(rawPayload)

  if (!validatedFields.success) {
    // Return early with the formatted Zod errors so the UI can display them
    return {
      error: "Invalid input data",
      details: validatedFields.error.flatten().fieldErrors
    }
  }

  // Use the safe, parsed data for the rest of the function
  const payload = validatedFields.data

  try {
    // 1. CALCULATE THE TRUST SCORE (The Algorithm)
    let calculatedTrustScore = 1.0 // Base score for a standard text post

    // The Carrot: Reward users heavily for attaching real work
    if (payload.portfolioItemId) {
      calculatedTrustScore += 4.0 // Showcasing an actual built project is the highest signal
    }
    if (payload.activityId) {
      calculatedTrustScore += 3.0 // Tying a thought to an official platform activity
    }
    if (payload.ksbId) {
      calculatedTrustScore += 2.0 // Tying a thought to a specific verified skill
    }

    // Type Multipliers
    if (payload.type === "SHOWCASE" && payload.portfolioItemId) {
      calculatedTrustScore += 1.0 // Bonus for correctly categorizing a portfolio drop
    } else if (payload.type === "FIELD_NOTES") {
      calculatedTrustScore += 0.5 // We want to encourage technical sharing
    }

    // 2. HANDLE BOUNTY ESCROW (If HELP_NEEDED)
    if (payload.type === "HELP_NEEDED" && payload.bountyStake && payload.bountyStake > 0) {

      // Ensure they actually have enough Reputation to stake
      const userRep = await prisma.reputationTransaction.aggregate({
        where: { userId },
        _sum: { points: true }
      })

      const totalRep = userRep._sum.points || 0

      if (totalRep < payload.bountyStake) {
        return { error: "Insufficient Reputation points to post this bounty." }
      }

      // Execute as a Prisma Transaction so we don't accidentally take points without creating the post
      await prisma.$transaction(async (tx) => {
        const newSignal = await tx.signal.create({
          data: {
            authorId: userId,
            content: payload.content,
            type: payload.type,
            activityId: payload.activityId,
            ksbId: payload.ksbId,
            portfolioItemId: payload.portfolioItemId,
            trustScore: calculatedTrustScore,
            mediaKey: payload.mediaKey,
          }
        })

        // Deduct points from ledger
        await tx.reputationTransaction.create({
          data: {
            userId,
            points: -payload.bountyStake!, // Negative because it's leaving their wallet
            reason: "Bounty Escrow",
          }
        })

        // Create the Bounty lock
        await tx.bounty.create({
          data: {
            creatorId: userId,
            signalId: newSignal.id,
            title: "Help Needed",
            description: payload.content,
            stake: payload.bountyStake!,
          }
        })
      })

    } else {
      // 3. STANDARD CREATION (No Bounty involved)
      await prisma.signal.create({
        data: {
          authorId: userId,
          content: payload.content,
          type: payload.type,
          activityId: payload.activityId,
          ksbId: payload.ksbId,
          portfolioItemId: payload.portfolioItemId,
          trustScore: calculatedTrustScore,
          mediaKey: payload.mediaKey,
        }
      })
    }

    // Refresh the feed
    revalidatePath("/community")
    return { success: true }

  } catch (error) {
    console.error("Failed to create V-Signal:", error)
    return { error: "Failed to publish your signal. Please try again." }
  }
}

/**
 * Handles toggling a "Spark" (Like/Endorsement) on a Signal
 */
export async function toggleSpark(signalId: string) {
  const session = await requireAuth()
  const userId = session.id

  // Basic validation (since we didn't make a complex Zod schema for this)
  if (!signalId || typeof signalId !== "string") {
    return { error: "Invalid Signal ID" }
  }

  try {
    const existingSpark = await prisma.spark.findUnique({
      where: {
        signalId_userId: { signalId, userId }
      }
    })

    if (existingSpark) {
      await prisma.spark.delete({ where: { id: existingSpark.id } })
    } else {
      await prisma.spark.create({
        data: { signalId, userId }
      })
      // Slightly boost Trust Score when sparked by peers
      await prisma.signal.update({
        where: { id: signalId },
        data: { trustScore: { increment: 0.1 } }
      })

      // Publish an event to notify the signal author of the new spark
      const signal = await prisma.signal.findUnique({
        where: { id: signalId },
        select: {
          authorId: true, // owner of the content
          content: true,
        }
      })

      if (signal?.authorId && signal.authorId !== userId) {
    await eventBus.publish({
      type: EVENT_TYPES.SPARK_RECEIVED,
      userId: signal.authorId, // receiver, not the sender
      payload: {
        signalId,
        signalContent: signal.content,
        fromUserId: userId,
      },
    })
  }
    }

    revalidatePath("/community")
    return { success: true }
  } catch (error) {
    console.error("Failed to toggle spark:", error)
    return { error: "Failed to process reaction." }
  }
}


/**
 * Creates a new Thread (comment) on a Signal
 */
export async function createThread(rawPayload: z.infer<typeof CreateThreadSchema>) {
  const session = await requireAuth()
  const userId = session.id

  // 1. Validate against your single-source-of-truth schema
  const validated = CreateThreadSchema.safeParse(rawPayload)
  if (!validated.success) {
    return { error: "Invalid comment." }
  }

  try {
    // 2. Create the comment in the database
    await prisma.thread.create({
      data: {
        signalId: validated.data.signalId,
        authorId: userId,
        content: validated.data.content,
      }
    })

    // 3. Refresh the feed so the comment appears instantly
    revalidatePath("/community")
    return { success: true }
  } catch (error) {
    console.error("Failed to post thread:", error)
    return { error: "Failed to post comment." }
  }
}