"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { ProposalType, VoteChoice, ProposalStatus, HiveRole } from "@prisma/client"
import { eventBus } from "@/domains/communications/events/publisher"
import { EVENT_TYPES } from "@/domains/communications/events/event-types"

// ==========================================
// 1. CREATE PROPOSAL
// ==========================================
export async function raiseProposal({
  hiveId,
  creatorId,
  title,
  description,
  type,
  targetUserId,
  isAnonymous,
  daysToMap = 3, // Default 3 days to vote
}: {
  hiveId: string;
  creatorId: string;
  title: string;
  description: string;
  type: ProposalType;
  targetUserId?: string;
  isAnonymous: boolean;
  daysToMap?: number;
}) {
  try {
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + daysToMap);

    const proposal = await prisma.proposal.create({
      data: {
        hiveId,
        creatorId,
        title,
        description,
        type,
        targetUserId,
        isAnonymous,
        expiresAt,
        status: ProposalStatus.ACTIVE,
      }
    });

    // Fetch the slug for the Hive to include in the event payload
    const hiveSlug = await prisma.hive.findUnique({
      where: { id: hiveId },
      select: { slug: true }
    });

    // Fetch the Hive members to broadcast the event to them
    const members = await prisma.hiveMember.findMany({
      where: { hiveId },
      select: { userId: true },
    });

    // Publish the event to each member's event bus (except the creator)
    const recipients = members
      .map((m) => m.userId)
      .filter((id) => id !== creatorId);

    // The event payload contains all the necessary information about the proposal
    const eventPayload = {
      hiveId,
      hiveSlug,
      creatorId,
      title,
      description,
      type,
      targetUserId,
      isAnonymous,
      expiresAt,
    };

    // Publish the event to each member's event bus (except the creator)
    await Promise.all(
      recipients.map((userId) =>
        eventBus.publish({
          type: EVENT_TYPES.PROPOSAL_RAISED,
          userId,
          payload: eventPayload,
        })
      )
    );

    revalidatePath(`/community/hives/${hiveId}`);
    return { success: true, proposalId: proposal.id };
  } catch (error: any) {
    console.error("Error raising proposal:", error);
    return { success: false, error: "Failed to raise proposal." };
  }
}

// ==========================================
// 2. CAST EQUITY-WEIGHTED VOTE
// ==========================================
export async function castVote({
  proposalId,
  userId,
  choice,
}: {
  proposalId: string;
  userId: string;
  choice: VoteChoice;
}) {
  try {
    // 1. Fetch the Proposal and the User's Hive Membership
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { hive: { include: { members: true } } }
    });

    if (!proposal || proposal.status !== "ACTIVE") {
      return { success: false, error: "Proposal is no longer active." };
    }

    const member = proposal.hive.members.find(m => m.userId === userId);
    if (!member) {
      return { success: false, error: "You are not a member of this Hive." };
    }

    // 2. Capture their exact equity at the moment of voting
    const voteWeight = member.equityShare;

    // 3. Record or Update the vote
    await prisma.vote.upsert({
      where: {
        proposalId_userId: { proposalId, userId }
      },
      update: { choice, voteWeight },
      create: { proposalId, userId, choice, voteWeight }
    });

    // 4. Check if we should execute the proposal immediately 
    await processProposalIfReady(proposalId);

    revalidatePath(`/community/hives/${proposal.hiveId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error casting vote:", error);
    return { success: false, error: "Failed to cast vote." };
  }
}

// ==========================================
// 3. THE SMART CONTRACT (Execution Protocol)
// ==========================================
export async function processProposalIfReady(proposalId: string) {
  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId },
    include: {
      votes: true,
      hive: {
        include: { members: true }
      }
    }
  });

  if (!proposal || proposal.status !== "ACTIVE") return { executed: false };

  const totalMembers = proposal.hive.members.length;
  const votesCast = proposal.votes.length;
  const now = new Date().getTime();
  const expiresAt = new Date(proposal.expiresAt).getTime();

  const hasExpired = now >= expiresAt;
  const allVoted = votesCast === totalMembers;

  let isReadyToExecute = false;

  // --- TIMING LOGIC FIX ---
  // If time is up, or if 100% of the hive has voted, consensus is finalized.
  if (hasExpired || allVoted) {
    isReadyToExecute = true; 
  }

  if (!isReadyToExecute) return { executed: false, reason: "Awaiting votes or expiration." };

  // --- TALLY THE EQUITY ---
  let equityFor = 0;
  let equityAgainst = 0;

  proposal.votes.forEach(vote => {
    if (vote.choice === "FOR") equityFor += vote.voteWeight;
    if (vote.choice === "AGAINST") equityAgainst += vote.voteWeight;
  });

  const finalStatus = equityFor > equityAgainst ? ProposalStatus.PASSED : ProposalStatus.FAILED;
  
  // Explicitly type it so TS allows us to assign ProposalStatus.EXECUTED later
  let executionOutcome: ProposalStatus = finalStatus;

  // --- AUTOMATED CONSEQUENCES (The DAO Engine) ---
  try {
    await prisma.$transaction(async (tx) => {
      executionOutcome = (finalStatus === ProposalStatus.PASSED && proposal.targetUserId)
        ? ProposalStatus.EXECUTED
        : finalStatus;

      // Mark the proposal as passed, failed, or executed
      await tx.proposal.update({
        where: { id: proposalId },
        data: { status: executionOutcome }
      });

      // If it passed and targets a user, execute the smart contract actions
      if (finalStatus === ProposalStatus.PASSED && proposal.targetUserId) {
        
        // ACTION: EXPEL MEMBER
        if (proposal.type === "MEMBER_EXPULSION") {
          await tx.hiveMember.deleteMany({
            where: {
              hiveId: proposal.hiveId, 
              userId: proposal.targetUserId 
            }
          });
        }

        // ACTION: IMPEACH LEADER
        else if (proposal.type === "IMPEACHMENT") {
          await tx.hiveMember.updateMany({
            where: {
              hiveId: proposal.hiveId, 
              userId: proposal.targetUserId 
            },
            data: { role: HiveRole.MEMBER }
          });
        }

        // ACTION: PROMOTE TO LEADER
        else if (proposal.type === "LEADERSHIP_VOTE") {
          // Demote existing leads
          await tx.hiveMember.updateMany({
            where: { hiveId: proposal.hiveId, role: HiveRole.LEAD },
            data: { role: HiveRole.MEMBER }
          });

          // Promote the target
          await tx.hiveMember.updateMany({
            where: {
              hiveId: proposal.hiveId, 
              userId: proposal.targetUserId 
            },
            data: { role: HiveRole.LEAD }
          });
        }
      }
    });

    // --- SECURE, DEDUPLICATED NOTIFICATIONS ---
    try {
      // 1. Establish the base payload containing the outcome
      const basePayload = {
        proposalId: proposal.id,
        proposalTitle: proposal.title,
        hiveId: proposal.hiveId,
        type: proposal.type,
        isAnonymous: proposal.isAnonymous,
        creatorId: proposal.creatorId,
        targetUserId: proposal.targetUserId,
        outcome: executionOutcome, // "PASSED", "FAILED", or "EXECUTED"
      };

      // 2. Fetch current members (Note: Expelled members won't be in this list anymore)
      const currentMembers = await prisma.hiveMember.findMany({
        where: { hiveId: proposal.hiveId },
        select: { userId: true },
      });

      // 3. Use a Set to strictly deduplicate user IDs
      const uniqueRecipients = new Set<string>();
      
      currentMembers.forEach(m => uniqueRecipients.add(m.userId));
      
      // Explicitly add target and creator to ensure they are notified 
      // even if they were just expelled or removed from the members list
      if (proposal.targetUserId) uniqueRecipients.add(proposal.targetUserId);
      if (!proposal.isAnonymous) uniqueRecipients.add(proposal.creatorId);

      // 4. Fire the unified outcome event to the deduplicated list
      await Promise.all(
        Array.from(uniqueRecipients).map((userId) =>
          eventBus.publish({
            type: EVENT_TYPES.PROPOSAL_OUTCOME,
            userId: userId,
            payload: basePayload
          })
        )
      );

    } catch (eventError) {
      console.error("Event bus failure during proposal execution:", eventError);
    }

    revalidatePath(`/community/hives/${proposal.hiveId}`);
    return { executed: true, status: executionOutcome };

  } catch (error) {
    console.error("Critical Failure executing Hive Smart Contract:", error);
    return { executed: false, error: "Database execution failed." };
  }
}