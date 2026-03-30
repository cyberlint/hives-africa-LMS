import { prisma } from "@/lib/db";
import { requireAuth } from "@/domains/auth/require-auth";
import { ActivitiesBoard } from "./_components/activities-board";

export default async function Page() {
  const user = await requireAuth();
  const userId = user.id;

  const rawActivities = await prisma.activity.findMany({
    where: {
      status: "Published", 
    },
    include: {
      ksbs: {
        include: { ksb: true },
      },
      submissions: {
        where: { userId: userId },
        orderBy: { createdAt: "desc" },
        take: 1, 
      },
    },
    orderBy: { deadline: "asc" }, 
  });

  const formattedActivities = rawActivities.map((act) => {
    const latestSubmission = act.submissions[0];
    let currentStatus = "Pending";
    
    if (latestSubmission) {
      currentStatus = latestSubmission.status;
    }

    return {
      id: act.id,
      title: act.title,
      type: act.type,
      difficulty: act.difficulty || "Intermediate", 
      points: act.points || 0,
      deadline: act.deadline,
      status: currentStatus,
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