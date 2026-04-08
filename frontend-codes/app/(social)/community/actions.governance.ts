"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { ProposalType, VoteChoice, ProposalStatus, HiveRole } from "@prisma/client"
import { eventBus } from "@/domains/communications/events/publisher"
import { EVENT_TYPES, EventType } from "@/domains/communications/events/event-types"

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
    // (This handles the logic if 100% of members have voted and buffer cleared)
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
// Note: You should also call this via a Cron Job every 5-10 minutes 
// to catch proposals that expire or pass their 15-min buffer naturally.
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

  // --- TIMING LOGIC (The 15-Minute Tactical Delay) ---
  if (hasExpired) {
    isReadyToExecute = true; 
  } else if (allVoted) {
    const latestVoteTime = Math.max(
      ...proposal.votes.map(v => new Date((v as any).updatedAt || v.createdAt).getTime())
    );
    
    const FIFTEEN_MINUTES = 15 * 60 * 1000;
    if (now >= latestVoteTime + FIFTEEN_MINUTES) {
      isReadyToExecute = true; 
    }
  }

  if (!isReadyToExecute) return { executed: false, reason: "Awaiting time buffer or votes." };

  // --- TALLY THE EQUITY ---
  let equityFor = 0;
  let equityAgainst = 0;

  proposal.votes.forEach(vote => {
    if (vote.choice === "FOR") equityFor += vote.voteWeight;
    if (vote.choice === "AGAINST") equityAgainst += vote.voteWeight;
  });

  const finalStatus = equityFor > equityAgainst ? ProposalStatus.PASSED : ProposalStatus.FAILED;

  // --- AUTOMATED CONSEQUENCES (The DAO Engine) ---
  try {
    await prisma.$transaction(async (tx) => {
      
      const executionStatus = (finalStatus === ProposalStatus.PASSED && proposal.targetUserId) 
        ? ProposalStatus.EXECUTED 
        : finalStatus;

      await tx.proposal.update({
        where: { id: proposalId },
        data: { status: executionStatus }
      });

      if (finalStatus === ProposalStatus.PASSED && proposal.targetUserId) {
        
        // ACTION: EXPEL MEMBER
        if (proposal.type === "MEMBER_EXPULSION") {
          await tx.hiveMember.delete({
            where: {
              hiveId_userId: { hiveId: proposal.hiveId, userId: proposal.targetUserId }
            }
          });
        } 
        
        // ACTION: IMPEACH LEADER
        else if (proposal.type === "IMPEACHMENT") {
          await tx.hiveMember.update({
            where: {
              hiveId_userId: { hiveId: proposal.hiveId, userId: proposal.targetUserId }
            },
            data: { role: HiveRole.MEMBER }
          });
          
          // NOTE: We no longer create a HiveMessage here to protect the creator's identity.
        } 
        
        // ACTION: PROMOTE TO LEADER
        else if (proposal.type === "LEADERSHIP_VOTE") {
          await tx.hiveMember.updateMany({
            where: { hiveId: proposal.hiveId, role: HiveRole.LEAD },
            data: { role: HiveRole.MEMBER }
          });

          await tx.hiveMember.update({
            where: {
              hiveId_userId: { hiveId: proposal.hiveId, userId: proposal.targetUserId }
            },
            data: { role: HiveRole.LEAD }
          });
        }
      }
    });

    // --- SECURE NOTIFICATIONS ---
    try {
      // 1. If there is a target (e.g. someone was expelled/impeached), notify THEM directly
      if (proposal.targetUserId && finalStatus === ProposalStatus.PASSED) {
        let targetEventType: EventType | null = null;
        
        if (proposal.type === "MEMBER_EXPULSION") targetEventType = EVENT_TYPES.PROPOSAL_TARGET_EXPELLED;
        if (proposal.type === "IMPEACHMENT") targetEventType = EVENT_TYPES.PROPOSAL_TARGET_IMPEACHED;
        if (proposal.type === "LEADERSHIP_VOTE") targetEventType = EVENT_TYPES.PROPOSAL_TARGET_PROMOTED;

        if (targetEventType) {
          await eventBus.publish({
            type: targetEventType, 
            userId: proposal.targetUserId, 
            payload: { hiveId: proposal.hiveId, proposalId: proposal.id, type: proposal.type }
          });
        }
      }

      // 2. Notify the creator (Only if it's NOT an anonymous proposal)
      if (!proposal.isAnonymous) {
        let creatorEventType: EventType;
        
        if (finalStatus === ProposalStatus.PASSED) {
          creatorEventType = EVENT_TYPES.PROPOSAL_PASSED;
        } else if (finalStatus === ProposalStatus.FAILED) {
          creatorEventType = EVENT_TYPES.PROPOSAL_FAILED;
        } else {
          creatorEventType = EVENT_TYPES.PROPOSAL_EXECUTED;
        }

        await eventBus.publish({
          type: creatorEventType,
          userId: proposal.creatorId, 
          payload: { hiveId: proposal.hiveId, proposalId: proposal.id, type: proposal.type }
        });
      }
      
    } catch (eventError) {
      console.error("Event bus failure during proposal execution:", eventError);
    }

    revalidatePath(`/community/hives/${proposal.hiveId}`);
    return { executed: true, status: finalStatus };

  } catch (error) {
    console.error("Critical Failure executing Hive Smart Contract:", error);
    return { executed: false, error: "Database execution failed." };
  }
}