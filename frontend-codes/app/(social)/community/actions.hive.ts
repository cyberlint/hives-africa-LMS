"use server"

import { requireAuth } from "@/domains/auth/require-auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { CreateHiveSchema } from "@/lib/zodSchemas"
import slugify from "slugify"



// Helper to make URL-safe strings
const createSlug = (name: string) =>
  slugify(name, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });

export async function createHive(rawPayload: z.infer<typeof CreateHiveSchema>) {
  const session = await requireAuth()
  const userId = session.id

  const validated = CreateHiveSchema.safeParse(rawPayload)
  if (!validated.success) return { error: "Invalid data provided." }

  try {
    const newHive = await prisma.$transaction(async (tx) => {
      
      // 1. Generate the base slug
      let slug = createSlug(validated.data.name)
      
      // 2. Collision Check: If the slug exists, append a random string
      const existing = await tx.hive.findUnique({ where: { slug } })
      if (existing) {
        slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`
      }

      // 3. Create the Hive using the new slug
      const hive = await tx.hive.create({
        data: {
          name: validated.data.name,
          slug: slug,
          description: validated.data.description,
          isPrivate: validated.data.isPrivate,
          creatorId: userId,
        }
      })

      // 4. Automatically make the creator an ADMIN member
      await tx.hiveMember.create({
        data: {
          userId: userId,
          hiveId: hive.id,
          role: "ADMIN", 
        }
      })

      return hive
    })

    revalidatePath("/community/hives")
    return { success: true, slug: newHive.slug }

  } catch (error: any) {
    console.error("Failed to create Hive:", error)
    if (error.code === 'P2002') return { error: "A Hive with this name already exists." }
    return { error: "Something went wrong." }
  }
}

// This action is for joining public Hives. Private Hives require an invite, so they won't use this endpoint.
export async function joinPublicHive(hiveId: string) {
  const session = await requireAuth()

  // 1. Fetch the Hive
  const hive = await prisma.hive.findUnique({
    where: { id: hiveId },
  })

  if (!hive) return { error: "Hive not found." }
  
  // 2. Security Check: Is it public and recruiting?
  if (hive.isPrivate) return { error: "This Hive is private. You must be invited." }
  if (!hive.isRecruiting) return { error: "This Hive is not currently recruiting." }

  // 3. Check if they are already a member
  const existingMember = await prisma.hiveMember.findUnique({
    where: { hiveId_userId: { hiveId, userId: session.id } }
  })

  if (existingMember) return { error: "You are already a member." }

  try {
    // 4. Add them to the Cap Table!
    await prisma.hiveMember.create({
      data: {
        hiveId,
        userId: session.id,
        role: "MEMBER",
        // equityShare defaults to 0.01 automatically based on your schema
      }
    })

    // Revalidate the page so the UI updates instantly
    revalidatePath(`/community/hives/${hive.slug}`)
    return { success: true }
  } catch (error) {
    return { error: "Failed to join Hive." }
  }
}