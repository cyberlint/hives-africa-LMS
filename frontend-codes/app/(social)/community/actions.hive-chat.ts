"use server"

import { requireAuth } from "@/domains/auth/require-auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function sendHiveMessage(hiveId: string, content: string) {
  const session = await requireAuth()
  
  if (!content.trim()) return { error: "Message cannot be empty." }

  // Verify membership before allowing a post
  const isMember = await prisma.hiveMember.findUnique({
    where: { hiveId_userId: { hiveId, userId: session.id } }
  })

  if (!isMember) return { error: "Unauthorized." }

  try {
    await prisma.hiveMessage.create({
      data: {
        hiveId,
        userId: session.id,
        content: content.trim()
      }
    })

    revalidatePath(`/community/hives/[slug]/workspace`, 'page')
    return { success: true }
  } catch (error) {
    return { error: "Failed to send message." }
  }
}