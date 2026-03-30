import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { PublicProfileClient } from "../_components/public-profile-client";

export default async function PublicProfilePage({
  params,
}: {
  params: { id: string }; // ✅ FIX 1: params is NOT a Promise
}) {

  // 1. Fetch user + approved submissions
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      submissions: {
        where: { status: "Approved" },
        include: {
          activity: {
            include: {
              ksbs: {
                include: { ksb: true }
              }
            }
          },
          reviews: {
            include: {
              reviewer: {
                select: { id: true, name: true, image: true } // ✅ include id
              }
            }
          }
        },
        orderBy: { updatedAt: "desc" }
      }
    }
  });

  if (!user) return notFound();

  // 2. Aggregation Engine
  let totalPoints = 0;
  let kScore = 0;
  let sScore = 0;
  let bScore = 0;

  const uniqueReviewers = new Set<string>();

  // 3. Process Portfolio
  const portfolio = user.submissions.map((sub) => {

    // ✅ Safe guards
    if (!sub.activity) return null;

    totalPoints += sub.activity.points || 0;

    // KSB Aggregation
    sub.activity.ksbs.forEach((mapping) => {
      const weight = mapping.weight || 1;

      switch (mapping.ksb.type) {
        case "Knowledge":
          kScore += weight * 5;
          break;
        case "Skill":
          sScore += weight * 5;
          break;
        case "Behavior":
          bScore += weight * 5;
          break;
      }
    });

    // Parse content safely
    let parsedContent: Record<string, any> = {};
    try {
      parsedContent =
        typeof sub.content === "string"
          ? JSON.parse(sub.content)
          : sub.content || {};
    } catch (e) {
      parsedContent = {};
    }

    // Extract structured data
    const values = Object.values(parsedContent);

    const textSnippets = values.filter(
      (v) => typeof v === "string" && !v.startsWith("http")
    ) as string[];

    const urlLinks = values.filter(
      (v) => typeof v === "string" && v.startsWith("http")
    ) as string[];

    const fileLinks = values
      .filter((v) => Array.isArray(v))
      .flat() as string[];

    // Reviewers
    const reviewers = sub.reviews.map((r) => {
      if (r.reviewerId) uniqueReviewers.add(r.reviewerId);

      return {
        name: r.reviewer?.name || "Verified Reviewer",
        image: r.reviewer?.image || "/ai.png",
        comment: r.feedback || "Requirement fulfilled securely.",
        score: r.score ?? null
      };
    });

    return {
      id: sub.id,
      title: sub.activity.title,
      type: sub.activity.type,

      summary:
        textSnippets.join("\n\n") ||
        "Artifact successfully submitted and verified via NextHive protocol.",

      evidenceFiles: [...fileLinks, ...urlLinks],

      reviewers,

      timeline: [
        {
          step: "Initiated",
          date: new Date(sub.createdAt).toLocaleDateString()
        },
        {
          step: "Submitted",
          date: new Date(sub.submittedAt || sub.createdAt).toLocaleDateString()
        },
        {
          step: "Approved",
          date: new Date(sub.updatedAt).toLocaleDateString()
        }
      ]
    };
  }).filter(Boolean); // ✅ remove nulls safely

  // 4. Tier Logic (cleaner)
  const getTier = (points: number) => {
    if (points > 3000) return "Elite Builder";
    if (points > 1500) return "Gold Builder";
    if (points > 500) return "Silver Builder";
    return "Bronze Builder";
  };

  // 5. Final Profile Object
  const profileData = {
    name: user.name,
    avatar: user.image || "/ai.png",

    // ✅ FIX: your schema doesn’t have headline
    identity: user.jobTitle || "NextHive Builder",

    bio: user.bio || "Building verifiable skills on the network.",
    location: user.localLanguage || null, // ⚠️ you don’t have location field
    website: user.website || null,

    tier: getTier(totalPoints),
    reputation: totalPoints,

    lastVerified:
      portfolio.length > 0
        ? portfolio[0]?.timeline?.[2]?.date
        : "Never",

    totalReviewers: uniqueReviewers.size,

    ksbData: [
      { dimension: "Knowledge", score: Math.min(kScore, 100), fullMark: 100 },
      { dimension: "Skill", score: Math.min(sScore, 100), fullMark: 100 },
      { dimension: "Behavior", score: Math.min(bScore, 100), fullMark: 100 }
    ],

    portfolio
  };

  return <PublicProfileClient profile={profileData} />;
}