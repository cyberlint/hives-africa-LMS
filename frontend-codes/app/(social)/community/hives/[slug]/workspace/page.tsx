import { requireAuth } from "@/domains/auth/require-auth"
import { prisma } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import WorkspaceShell from "../../_components/HiveWorkspaceShell"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function HiveWorkspacePage({ params }: PageProps) {
  const session = await requireAuth()
  const { slug } = await params

  const hive = await prisma.hive.findUnique({
    where: { slug },
    include: {
      members: { include: { user: true } },
      proposals: {
        where: { status: "ACTIVE" },
        include: { votes: true },
      },
      messages: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "asc" }
      }
    },
  })

  if (!hive) return notFound()

  const currentMember = hive.members.find((m) => m.userId === session.id)
  if (!currentMember && hive.isPrivate) {
    redirect(`/community/hives/${hive.slug}`)
  }

  // Calculate equity for voting power
  const equityPercentage = currentMember
    ? (currentMember.equityShare * 100).toFixed(1)
    : "0.0"

  // Fetch pending split notices
  const pendingSplits = await prisma.submissionRoster.findMany({
    where: { userId: session.id, approvalStatus: "PENDING" },
    include: {
      submission: {
        include: { 
          activity: true, 
          roster: { include: { user: true } } 
        }
      }
    },
    take: 1
  })

  // Fetch active missions
  const hiveMissions = await prisma.hiveActivity.findMany({
    where: { hiveId: hive.id },
    include: {
      activity: {
        include: {
          submissions: {
            where: { hiveId: hive.id },
            orderBy: { createdAt: "desc" },
            take: 1
          }
        }
      }
    },
    orderBy: { joinedAt: "desc" }
  })

  const myParticipations = await prisma.participation.findMany({
  where: { userId: session.id, hiveId: hive.id }
})

const optedInActivityIds = myParticipations.map((p) => p.activityId)

  return (
    <WorkspaceShell 
      hive={hive} 
      session={session} 
      currentMember={currentMember} 
      hiveMissions={hiveMissions}
      equityPercentage={equityPercentage}
      activeSplit={pendingSplits[0]} 
      optedInActivityIds={optedInActivityIds}
    />
  )
}