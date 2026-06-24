import { buttonVariants } from "@/components/ui/button";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import Link from "next/link";
import { prisma } from "@/lib/db"; // Import your Prisma client
import { formatDistanceToNow } from "date-fns"; // Optional: for "2 days ago" formatting if you have date-fns installed

// Fetch activities from the database
async function getActivities() {
  return await prisma.activity.findMany({
    orderBy: {
      createdAt: "desc", // Show the newest activities first
    },
    include: {
      _count: {
        select: { submissions: true }, // Grab the count of submissions automatically
      },
    },
  });
}

// Helper to color-code the status
function getStatusColor(status: string) {
  switch (status) {
    case "Published":
    case "Active":
      return "text-green-600";
    case "Draft":
      return "text-yellow-600";
    case "Archived":
      return "text-red-600";
    default:
      return "text-muted-foreground";
  }
}

export default async function ActivitiesDashboardPage() {
  const activities = await getActivities();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Activities</h1>
          <p className="text-muted-foreground text-sm">
            Create and manage hands-on projects, events, and peer reviews.
          </p>
        </div>

        {/* This triggers our magic /new route */}
        <Link 
          href="/admin/activities/new" 
          className={buttonVariants({ variant: "default" })}
        >
          <IconCirclePlusFilled className="mr-2" size={20} /> Create Activity
        </Link>
      </div>

      {/* List Area */}
      <div className="grid grid-cols-1 gap-3">
        {activities.length === 0 ? (
          <div className="border border-dashed rounded-lg p-12 text-center flex flex-col items-center justify-center space-y-3">
            <h3 className="text-lg font-medium">No activities yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {"You haven't created any learning activities. Click the button above to draft your first project, task, or event."}
            </p>
          </div>
        ) : (
          activities.map((activity) => (
            <div 
              key={activity.id} 
              className="border rounded-lg p-4 flex items-center justify-between hover:bg-muted/50 transition"
            >
              <div className="flex flex-col">
                <span className="font-medium text-sm truncate max-w-[300px] md:max-w-md">
                  {activity.title}
                </span>
                <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                  <span className="capitalize">{activity.type.toLowerCase().replace(/_/g, " ")}</span> 
                  <span>•</span> 
                  <span className="capitalize">{activity.difficulty.toLowerCase()}</span> 
                  <span>•</span> 
                  <span className={`font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status.charAt(0) + activity.status.slice(1).toLowerCase()}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground hidden sm:block">
                  {activity._count.submissions} submissions
                </span>
                <Link 
                  href={`/admin/activities/${activity.id}`} 
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Edit
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}