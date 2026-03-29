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

// ===============================
// 🧠 HELPERS (NEW)
// ===============================

function formatTimeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function generateMicroWins(events: any[]) {
  if (!events || events.length === 0) {
    return [
      {
        id: 1,
        text: "Welcome to NextHive! Your workspace is ready.",
        time: "Just now",
      },
    ];
  }

  return events.slice(0, 5).map((event, index) => {
    switch (event.type) {
      case "Submission_Approved":
        return {
          id: index,
          text: `Your submission "${event.payload?.activityTitle || "your work"}" was approved`,
          time: formatTimeAgo(event.createdAt),
        };

      default:
        return {
          id: index,
          text: "You made progress!",
          time: formatTimeAgo(event.createdAt),
        };
    }
  });
}

function generateEventDrivenNextMoves(events: any[]): DashboardActionItem[] {
  const hasSubmission = events.some(
    (e) => e.type === "Submission_Approved"
  );

  if (hasSubmission) {
    return [
      {
        id: "event-1",
        type: "new",
        icon: "Target",
        title: "Submit another project",
        time: "Keep your momentum going",
        action: "Explore Activities",
        link: "/dashboard/activities",
      },
    ];
  }

  return [
    {
      id: "event-1",
      type: "new",
      icon: "Zap",
      title: "Start your first project",
      time: "Build your first proof of work",
      action: "Browse Activities",
      link: "/dashboard/activities",
    },
  ];
}

// ===============================
// 🚀 MAIN FUNCTION
// ===============================

export async function getDashboardData(userId: string) {
  try {
    // 🆕 STEP 1: Fetch Events
    const recentEvents = await prisma.eventLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // EXISTING LOGIC (UNCHANGED)
    const approvedSubmissions = await prisma.submission.findMany({
      where: {
        userId: userId,
        status: "Approved",
      },
      include: {
        activity: {
          include: {
            ksbs: {
              include: { ksb: true },
            },
          },
        },
      },
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

        if (mapping.ksb.type === "Knowledge") kScore += weight * 5;
        if (mapping.ksb.type === "Skill") sScore += weight * 5;
        if (mapping.ksb.type === "Behavior") bScore += weight * 5;
      });
    });

    const ksbData = [
      { dimension: "Knowledge", score: Math.min(kScore, 100), fullMark: 100 },
      { dimension: "Skill", score: Math.min(sScore, 100), fullMark: 100 },
      { dimension: "Behavior", score: Math.min(bScore, 100), fullMark: 100 },
    ];

    const nextMoves: DashboardActionItem[] = [];

    // EXISTING: Pending Reviews
    const pendingAssignments = await prisma.reviewAssignment.findMany({
      where: {
        reviewerId: userId,
        status: "Pending",
      },
      include: {
        submission: {
          include: { activity: true },
        },
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
        link: `/dashboard/reviews/${assignment.id}`,
      });
    });

    // EXISTING: Available Activities
    const availableActivities = await prisma.activity.findMany({
      where: {
        status: "Published",
        submissions: { none: { userId: userId } },
      },
      take: 3,
      orderBy: { createdAt: "desc" },
    });

    availableActivities.forEach((activity) => {
      nextMoves.push({
        id: `act-${activity.id}`,
        type: "new",
        icon: "Zap",
        title: `New Challenge: ${activity.title}`,
        time: `Reward: +${activity.points} pts`,
        action: "Accept Challenge",
        link: `/dashboard/activities/${activity.id}`,
      });
    });

    // 🆕 STEP 2: Inject Event Intelligence
    const eventMoves = generateEventDrivenNextMoves(recentEvents);
    nextMoves.unshift(...eventMoves); // put at top

    const microWins = generateMicroWins(recentEvents);

    // Tier Logic
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
        streak: 1, // next step 😉
        ksbData,
        nextMoves,
        microWins,
      },
    };
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return { status: "error", message: "Failed to load dashboard data" };
  }
}