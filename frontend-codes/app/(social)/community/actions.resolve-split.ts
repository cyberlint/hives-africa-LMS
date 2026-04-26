"use server"

import { prisma } from "@/lib/db"
import { requireAuth } from "@/domains/auth/require-auth"
import { revalidatePath } from "next/cache"
import { SplitStatus } from "@prisma/client"

export async function handleSplitDecision({
  rosterId,
  decision,
  rationale,
  counterSplits,
  pathname
}: {
  rosterId: string;
  decision: 'ACCEPT' | 'DISPUTE' | 'ADMIN_OVERRIDE';
  rationale?: string;
  counterSplits?: Record<string, number>;
  pathname: string;
}) {
  try {
    const user = await requireAuth()

    return await prisma.$transaction(async (tx) => {
      const rosterEntry = await tx.submissionRoster.findUnique({
        where: { id: rosterId },
        include: { submission: true }
      })

      if (!rosterEntry) throw new Error("Entry not found")

      if (decision === 'ACCEPT') {
        await tx.submissionRoster.update({
          where: { id: rosterId },
          data: { approvalStatus: SplitStatus.APPROVED }
        })
      }

      if (decision === 'DISPUTE') {
        // Mark THIS user's entry as DISPUTED and store the logic
        await tx.submissionRoster.update({
          where: { id: rosterId },
          data: { 
            approvalStatus: SplitStatus.DISPUTED,
            metadata: { rationale, counterSplits } 
          }
        })
        
        // Reset all other APPROVED statuses to PENDING so the team must re-evaluate
        await tx.submissionRoster.updateMany({
          where: { 
            submissionId: rosterEntry.submissionId,
            NOT: { id: rosterId } 
          },
          data: { approvalStatus: SplitStatus.PENDING }
        })
      }

      if (decision === 'ADMIN_OVERRIDE') {
        await tx.submissionRoster.updateMany({
          where: { submissionId: rosterEntry.submissionId },
          data: { approvalStatus: SplitStatus.APPROVED }
        })
      }

      revalidatePath(pathname)
      return { success: true }
    })
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}