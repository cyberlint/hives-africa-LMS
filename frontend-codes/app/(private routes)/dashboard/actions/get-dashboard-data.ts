"use server";

import { prisma } from "@/lib/db";

export interface DashboardActionItem {
  id: string;
  type: "urgent" | "new" | "revision";
  icon: string;
  title: string;
  time: string;
  action: string;
  link: string;
}

export async function getDashboardData(userId: string) {
  try {
    // 1. Fetch Approved Submissions to calculate Reputation & KSBs
    const approvedSubmissions = await prisma.submission.findMany({
      where: { 
        userId: userId, 
        status: "Approved" // Matches SubmissionStatus enum
      },
      include: {
        activity: {
          include: {
            ksbs: {
              include: { ksb: true } 
            }
          }
        }
      }
    });

    let kScore = 10; 
    let sScore = 10;
    let bScore = 10;
    let reputationPoints = 0;
    const uniqueKSBs = new Set();

    approvedSubmissions.forEach((sub) => {
      reputationPoints += sub.activity.points || 0;

      sub.activity.ksbs.forEach((mapping) => {
        uniqueKSBs.add(mapping.ksbId);
        const weight = mapping.weight || 1.0;
        
        // Matches KSBType enum
        if (mapping.ksb.type === "Knowledge") kScore += (weight * 5);
        if (mapping.ksb.type === "Skill") sScore += (weight * 5);
        if (mapping.ksb.type === "Behavior") bScore += (weight * 5);
      });
    });

    const ksbData = [
      { dimension: 'Knowledge', score: Math.min(kScore, 100), fullMark: 100 },
      { dimension: 'Skill', score: Math.min(sScore, 100), fullMark: 100 },
      { dimension: 'Behavior', score: Math.min(bScore, 100), fullMark: 100 },
    ];

    // Initialize with strict typing
    const nextMoves: DashboardActionItem[] = [];
    
    // 2. Fetch Pending Peer Reviews
    const pendingAssignments = await prisma.reviewAssignment.findMany({
      where: { 
        reviewerId: userId, 
        status: "Pending"
      },
      include: { 
        submission: { 
          include: { activity: true } 
        } 
      },
      take: 3,
    });

    pendingAssignments.forEach((assignment) => {
      nextMoves.push({
        id: `review-${assignment.id}`,
        type: "urgent",
        icon: "GitPullRequest", 
        title: `Review Peer: ${assignment.submission.activity.title}`,
        time: "Action required to unlock next module",
        action: "Start Review",
        link: `/dashboard/reviews/${assignment.id}`
      });
    });

    // 3. Check for Available Challenges
    const availableActivities = await prisma.activity.findMany({
      where: {
        status: "Published", // Matches ActivityStatus enum
        submissions: { none: { userId: userId } } 
      },
      take: 3,
      orderBy: { createdAt: 'desc' }
    });

    availableActivities.forEach((activity) => {
      nextMoves.push({
        id: `act-${activity.id}`,
        type: "new",
        icon: "Zap",
        title: `New Challenge: ${activity.title}`,
        time: `Reward: +${activity.points} pts`,
        action: "Accept Challenge",
        link: `/dashboard/activities/${activity.id}`
      });
    });

    // Determine Tier
    let userTier = "Bronze Builder";
    if (reputationPoints > 500) userTier = "Silver Builder";
    if (reputationPoints > 1500) userTier = "Gold Builder";
    if (reputationPoints > 3000) userTier = "Elite Builder";

    return {
      status: "success",
      data: {
        reputationPoints,
        verifiedKSBs: uniqueKSBs.size,
        tier: userTier,
        streak: 1, 
        ksbData,
        nextMoves,
        microWins: [
          { id: 1, text: "Welcome to NextHive! Your workspace is ready.", time: "Just now" }
        ] 
      }
    };

  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return { status: "error", message: "Failed to load dashboard data" };
  }
}