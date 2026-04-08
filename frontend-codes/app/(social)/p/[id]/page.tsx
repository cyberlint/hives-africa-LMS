import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { PublicProfileClient } from "../_components/public-profile-client";

/* ================= HELPERS ================= */

function safeParse(content: unknown): Record<string, any> {
  try {
    return typeof content === "string" ? JSON.parse(content) : content || {};
  } catch {
    return {};
  }
}

function extractContent(parsed: Record<string, any>) {
  const values = Object.values(parsed);

  return {
    text: values.filter(
      (v) => typeof v === "string" && !v.startsWith("http")
    ) as string[],
    urls: values.filter(
      (v) => typeof v === "string" && v.startsWith("http")
    ) as string[],
    files: values
      .filter((v) => Array.isArray(v))
      .flat() as string[],
  };
}

function getTier(points: number) {
  if (points > 3000) return "Elite Builder";
  if (points > 1500) return "Gold Builder";
  if (points > 500) return "Silver Builder";
  return "Bronze Builder";
}

/* ================= PAGE ================= */

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  /* ================= FETCH THE TRUE GRAPH ================= */

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      // 1. The Immutable Ledger
      reputationLedger: true,
      
      // 2. The Actual Unlocked Competencies
      earnedKSBs: {
        include: { ksb: true }
      },

      // 3. Strictly Public Portfolio Items
      portfolio: {
        where: { visibility: "Public" },
        orderBy: { createdAt: "desc" },
        include: {
          submission: {
            include: {
              activity: {
                include: { ksbs: { include: { ksb: true } } },
              },
              reviews: {
                include: {
                  reviewer: {
                    select: { id: true, name: true, image: true, jobTitle: true },
                  },
                },
              },
              // Pull the Squad to show equity splits on team projects
              roster: {
                include: {
                  user: { select: { id: true, name: true, image: true } }
                }
              }
            },
          },
        },
      },
    },
  });

  if (!user) return notFound();

  /* ================= SECURE AGGREGATION ================= */

  // TRUE REPUTATION MATH
  const totalPoints = user.reputationLedger.reduce((acc, tx) => acc + tx.points, 0);

  // TRUE COMPETENCY MATH (Based on actual earned KSBs, not derived)
  let kScore = 0;
  let sScore = 0;
  let bScore = 0;

  user.earnedKSBs.forEach((earned) => {
    if (earned.ksb.type === "Knowledge") kScore += 5; // Adjust weights as needed
    if (earned.ksb.type === "Skill") sScore += 5;
    if (earned.ksb.type === "Behavior") bScore += 5;
  });

  const uniqueReviewers = new Set<string>();

  const portfolio = user.portfolio
    .map((item) => {
      const sub = item.submission;
      if (!sub || !sub.activity) return null;

      /* ---- Content Parsing ---- */
      const parsed = safeParse(sub.content);
      const { text, urls, files } = extractContent(parsed);

      if (sub.verificationUrl) urls.push(sub.verificationUrl);

      /* ---- Peer/Mentor Reviews ---- */
      const reviewers = sub.reviews.map((r) => {
        if (r.reviewerId) uniqueReviewers.add(r.reviewerId);

        return {
          name: r.reviewer?.name || "Verified Reviewer",
          image: r.reviewer?.image || "/ai.png",
          role: r.reviewer?.jobTitle || "Reviewer",
          comment: r.feedback || "Requirement fulfilled.",
          score: r.score ?? null,
        };
      });

      /* ---- The Squad (Who built this?) ---- */
      const squad = sub.roster.map(member => ({
        id: member.user.id,
        name: member.user.name,
        image: member.user.image,
        share: member.claimedShare * 100 
      }));

      /* ---- TIMELINE ARRAY ---- */
      const timeline = [
        {
          step: "Initiated",
          date: new Date(sub.createdAt).toLocaleDateString(),
        },
        {
          step: "Submitted",
          date: new Date(sub.submittedAt || sub.createdAt).toLocaleDateString(),
        },
        {
          step: "Approved",
          date: new Date(sub.updatedAt).toLocaleDateString(),
        },
      ];

      return {
        id: item.id,
        title: item.title || sub.activity.title,
        description: item.description,
        type: sub.activity.type,

        summary: text.join("\n\n") || "Artifact verified via NextHive protocol.",
        evidenceFiles: [...files, ...urls],
        
        reviewers,
        squad,
        timeline,
        verifiedAt: new Date(sub.updatedAt).toLocaleDateString(),
      };
    })
    .filter(Boolean);

  /* ================= FINAL PROFILE PAYLOAD ================= */

  const profileData = {
    name: user.name,
    avatar: user.image || "/ai.png",
    identity: user.jobTitle || "NextHive Builder",
    bio: user.bio || "Building verifiable skills on the network.",
    location: user.localLanguage || null,
    website: user.website || null,

    tier: getTier(totalPoints),
    reputation: totalPoints,

    lastVerified: portfolio.length > 0 ? portfolio[0]?.verifiedAt : "Never",
    totalReviewers: uniqueReviewers.size,

    ksbData: [
      { dimension: "Knowledge", score: Math.min(kScore, 100), fullMark: 100 },
      { dimension: "Skill", score: Math.min(sScore, 100), fullMark: 100 },
      { dimension: "Behavior", score: Math.min(bScore, 100), fullMark: 100 },
    ],

    portfolio,
  };

  return <PublicProfileClient profile={profileData} />;
}