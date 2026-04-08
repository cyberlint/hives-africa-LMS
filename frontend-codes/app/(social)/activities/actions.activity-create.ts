"use server"

import { requireAuth } from "@/domains/auth/require-auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import slugify from "slugify"
import { ActivityType, RequirementType } from "@prisma/client"

export async function createActivity(formData: any) {
  const session = await requireAuth()
  
  // 1. Authorization Check
  if (session.role !== 'admin') {
    return { error: "Unauthorized. Only admins can launch Arena challenges." }
  }

  // 2. Generate the Unique Slug
  const baseSlug = slugify(formData.title, { lower: true, strict: true })
  const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`

  try {
    const activity = await prisma.$transaction(async (tx) => {
      
      // 3. Create the base Activity
      const newActivity = await tx.activity.create({
        data: {
          title: formData.title,
          slug: uniqueSlug,
          description: formData.description,
          points: parseInt(formData.points),
          type: formData.type,
          difficulty: formData.difficulty,
          deadline: formData.deadline ? new Date(formData.deadline) : null,
          allowSolo: formData.allowSolo,
          allowHive: formData.allowHive,
          minHiveSize: formData.allowHive ? parseInt(formData.minHiveSize) : null,
          maxHiveSize: formData.allowHive ? parseInt(formData.maxHiveSize) : null,
          creatorId: session.id,
          status: "Published",
          visibility: "Public",
        }
      })

      // 4. Map the KSBs (The Arsenal)
      if (formData.ksbIds?.length > 0) {
        await tx.activityKSB.createMany({
          data: formData.ksbIds.map((id: string) => ({
            activityId: newActivity.id,
            ksbId: id,
            weight: 1.0
          }))
        })
      }

      // 5. Create Requirements (The Assessment Checklist)
      if (formData.requirements?.length > 0) {
        await tx.activityRequirement.createMany({
          data: formData.requirements.map((reqText: string) => ({
            activityId: newActivity.id,
            
            // Delete the string "TEXT" and type RequirementType. 
            // Your IDE will immediately pop up the correct spelling!
            type: RequirementType.Text_Report,
            
            config: { content: reqText } 
          }))
        })
      }

      return newActivity
    })

    // 6. Cache Busting
    revalidatePath("/activities")
    
    // Return the slug so the client-side router can go to /activities/[slug]
    return { success: true, slug: activity.slug }
    
  } catch (error) {
    console.error("Activity Creation Error:", error)
    return { error: "Failed to create activity. Check if the title is unique." }
  }
}