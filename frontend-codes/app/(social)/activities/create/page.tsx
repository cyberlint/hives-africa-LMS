import { prisma } from "@/lib/db"
import { ActivityType } from "@prisma/client"
import CreateActivityForm from "../_components/CreateActivityForm"

export default async function Page() {
  // Extracting the enum values directly from your DB schema
  const activityTypes = Object.values(ActivityType)
  const globalKSBs = await prisma.kSB.findMany({ 
  select: { id: true, title: true, type: true },
  orderBy: { title: 'asc' }
});

  return (
    <div className="min-h-screen bg-background">
      <CreateActivityForm activityTypes={activityTypes} availableKSBs={globalKSBs} />
    </div>
  )
}