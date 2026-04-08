import { prisma } from "@/lib/db";
import { requireAuth } from "@/domains/auth/require-auth";
import { ActivitiesBoard } from "./_components/activities-board";

export default async function Page() {
  const user = await requireAuth();
  const userId = user.id;

  // 1. Get all the Hives this user belongs to
  const userHiveMemberships = await prisma.hiveMember.findMany({
    where: { userId: userId },
    select: { hiveId: true }
  });
  const userHiveIds = userHiveMemberships.map(m => m.hiveId);

  // 2. Fetch Activities with Multi-Hive awareness
  const rawActivities = await prisma.activity.findMany({
    where: {
      status: "Published", 
    },
    include: {
      ksbs: {
        include: { ksb: true },
      },
      // Check if the user is on the roster for this activity (Solo or Squad)
      participations: {
        where: { userId: userId }
      },
      // Find the latest submission made EITHER by the user solo, OR by their Hive
      submissions: {
        where: {
          OR: [
            { userId: userId },
            { hiveId: { in: userHiveIds } }
          ]
        },
        orderBy: { createdAt: "desc" },
        take: 1, 
      },
    },
    orderBy: { deadline: "asc" }, 
  });

  const formattedActivities = rawActivities.map((act) => {
    const latestSubmission = act.submissions[0];
    const participation = act.participations[0];
    
    // Smarter default status mapping
    let currentStatus = "Pending"; // Not joined yet
    
    if (latestSubmission) {
      currentStatus = latestSubmission.status; // e.g., "Submitted", "Under_Review"
    } else if (participation) {
      currentStatus = "In_Progress"; // They are on the roster, but no submission yet
    }

    return {
      id: act.id,
      title: act.title,
      type: act.type,
      difficulty: act.difficulty || "Intermediate", 
      points: act.points || 0,
      deadline: act.deadline,
      status: currentStatus,
      
      // We pass this extra context down so your ActivitiesBoard can optionally 
      // render a badge showing *how* they are participating (Solo vs Squad)
      participationMode: participation ? (participation.hiveId ? "Squad" : "Solo") : null,
      
      ksbs: act.ksbs.map((mapping) => ({
        title: mapping.ksb.title,
        type: mapping.ksb.type,
      })),
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <ActivitiesBoard initialActivities={formattedActivities} />
    </div>
  );
}