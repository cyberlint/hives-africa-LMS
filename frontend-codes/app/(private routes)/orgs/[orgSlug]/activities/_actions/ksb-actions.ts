"use server"

import { prisma } from "@/lib/db" // Adjust your import path if needed
import { revalidatePath } from "next/cache"

export async function createGlobalKSB(data: { title: string, type: "Knowledge" | "Skill" | "Behavior", description?: string }) {
  try {
    const newKsb = await prisma.kSB.create({
      data: {
        title: data.title,
        type: data.type,
        description: data.description
      }
    })
    
    // Refresh the page so the new KSB immediately appears in the dropdowns
    revalidatePath("/admin/activities/[id]/edit", "page") 
    
    return { success: true, ksb: newKsb }
  } catch (error) {
    console.error("Failed to create KSB:", error)
    return { success: false, error: "Failed to create KSB in database." }
  }
}