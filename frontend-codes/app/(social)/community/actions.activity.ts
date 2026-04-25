"use server"

import { courses } from './../../../data/courses';


import { requireAuth } from "@/domains/auth/require-auth"
import { EVENT_TYPES } from "@/domains/communications/events/event-types"
import { eventBus } from "@/domains/communications/events/publisher"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

// 1. JOIN ACTIVITY (Solo or via Hive Roster)
export async function joinActivity(activitySlug: string, hiveSlug?: string) {
  const session = await requireAuth()
  const userId = session.id
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://hives.africa";

  // Find the activity using the SLUG since that is what the UI sends
  const activity = await prisma.activity.findUnique({
    where: { slug: activitySlug }
  })

  if (!activity) return { error: "Activity not found." }

  if (!hiveSlug && !activity.allowSolo) {
    return { error: "This challenge requires you to participate as part of a Squad." }
  }

  // Resolve Hive ID if a slug was provided
  let hiveId: string | null = null
  if (hiveSlug) {
    const hive = await prisma.hive.findUnique({ where: { slug: hiveSlug } })
    if (!hive) return { error: "Hive not found." }
    hiveId = hive.id
  }

  try {
    await prisma.participation.create({
      data: {
        userId: userId,
        activityId: activity.id,
        hiveId: hiveId,
        role: "Participant"
      }
    })

    // Publish this to event bus so that any relevant communications can be triggered (e.g. welcome email, onboarding sequence, etc.)
    const eventPayload = {
      activityType: activity.type || "Activity",
      activityTitle: activity.title,
      description: activity.description || null,
      startDate: activity.startDate || null,
      deadline: activity.deadline || null,
      points: activity.points || 0,
      isMandatory: activity.isMandatory || false,
      actionUrl: `${baseUrl}/dashboard/activities/${activity.id}`,
    }
    await eventBus.publish({
      type: EVENT_TYPES.ACTIVITY_JOINED,
      userId,
      payload: eventPayload,
    });

    revalidatePath(`/activities/${activitySlug}`)
    return { success: true, message: "Welcome to the Arena!" }
  } catch (error: any) {
    if (error.code === 'P2002') return { error: "You are already participating." }
    return { error: "Failed to join activity." }
  }
}

// 2. COMMIT HIVE TO ACTIVITY (For Leaders)
export async function commitHiveToActivity(activityId: string, hiveSlug: string) {
  const session = await requireAuth()

  // Resolve Hive first since we use slugs for Hives
  const hive = await prisma.hive.findUnique({
    where: { slug: hiveSlug },
    include: { _count: { select: { members: true } } }
  })

  if (!hive) return { error: "Hive not found." }

  const activity = await prisma.activity.findUnique({ where: { id: activityId } })
  if (!activity) return { error: "Activity not found." }

  // Verify Leadership using the resolved hive.id
  const member = await prisma.hiveMember.findUnique({
    where: { hiveId_userId: { hiveId: hive.id, userId: session.id } },
  })

  if (!member || !['FOUNDER', 'ADMIN', 'LEAD'].includes(member.role)) {
    return { error: "Only leadership can commit the Hive." }
  }

  // Size Checks
  const hiveSize = hive._count.members
  if (activity.minHiveSize && hiveSize < activity.minHiveSize) {
    return { error: `Squad too small (Min: ${activity.minHiveSize}).` }
  }
  if (activity.maxHiveSize && hiveSize > activity.maxHiveSize) {
    return { error: `Squad too large (Max: ${activity.maxHiveSize}).` }
  }

  try {
    await prisma.hiveActivity.create({
      data: {
        activityId: activity.id,
        hiveId: hive.id
      }
    })

    revalidatePath(`/activities/${activity.slug}`)
    return { success: true, message: "Squad registered!" }
  } catch (error: any) {
    if (error.code === 'P2002') return { error: "Hive is already registered." }
    return { error: "Registration failed." }
  }
}