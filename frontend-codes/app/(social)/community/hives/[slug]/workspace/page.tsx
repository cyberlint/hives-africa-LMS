import { requireAuth } from "@/domains/auth/require-auth"
import { prisma } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Lock, AlertTriangle, CheckCircle2, MessageSquare,
  Calendar, ShieldAlert, FileCode2, Globe, ArrowRight, Users
} from "lucide-react"
import Link from "next/link"
import HiveChat from "../../_components/HiveChat"
import WorkspaceProposalCard from "../../_components/WorkspaceProposalCard" // <-- Import the new component
import type { ComposerUserContext } from "../../../_components/FeedComposer"

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()

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
        orderBy: { createdAt: "desc" },
        include: { votes: true } // <-- ADDED: Crucial for determining if they voted
      },
      messages: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "asc" }
      }
    }
  })

  if (!hive) return notFound()

  const currentMember = hive.members.find((m) => m.userId === session.id)
  if (!currentMember && hive.isPrivate) {
    redirect(`/community/hives/${hive.slug}`)
  }

  const equityPercentage = currentMember
    ? (currentMember.equityShare * 100).toFixed(1)
    : "0.0"

  const dbUser = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      reputationLedger: { select: { points: true } },
      portfolio: true
    }
  })

  const totalRep =
    dbUser?.reputationLedger.reduce((acc, curr) => acc + curr.points, 0) || 0

  const composerUser: ComposerUserContext = {
    id: dbUser!.id,
    name: dbUser!.name,
    image: dbUser!.image,
    totalRep,
    portfolioItems: dbUser?.portfolio || []
  }

  const pendingSplits = await prisma.submissionRoster.findMany({
    where: { userId: session.id, approvalStatus: "PENDING" },
    include: {
      submission: {
        include: { activity: true, roster: { include: { user: true } } }
      }
    },
    take: 1
  })

  const activeSplit = pendingSplits[0]

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
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="size-12 sm:size-14 rounded-xl bg-orange/10 text-orange border border-orange/20 flex items-center justify-center font-bold text-lg">
            {getInitials(hive.name)}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-2xl font-semibold truncate">
                {hive.name}
              </h1>

              <Badge variant="outline" className="text-[10px]">
                {hive.isPrivate ? <Lock className="size-3 mr-1" /> : <Globe className="size-3 mr-1" />}
                {hive.isPrivate ? "Private" : "Public"}
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {currentMember
                ? <>Stake: <span className="font-semibold text-foreground">{equityPercentage}%</span></>
                : <span className="italic">Viewing as guest</span>}
            </p>
          </div>
        </div>

        {currentMember && (
          <Button variant="outline" size="sm" className="w-full sm:w-auto h-10">
            <Calendar className="size-4 mr-2" />
            Sync
          </Button>
        )}
      </div>

      {/* SPLIT NOTICE */}
      {activeSplit && (
        <Card className="border-orange/30 bg-orange/5">
          <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="size-10 sm:size-12 rounded-full bg-orange/20 flex items-center justify-center">
              <AlertTriangle className="size-5 sm:size-6 text-orange" />
            </div>

            <div className="flex-1 space-y-3">
              <h3 className="text-base sm:text-lg font-semibold">
                Review contribution split
              </h3>

              <div className="flex flex-wrap gap-2">
                {activeSplit.submission.roster.map((c) => {
                  const isMe = c.userId === session.id
                  return (
                    <div key={c.id} className="px-3 py-1.5 rounded-lg text-xs bg-muted/30">
                      {isMe ? "You" : c.user.name.split(" ")[0]} • {(c.claimedShare * 100).toFixed(0)}%
                    </div>
                  )
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button className="w-full sm:w-auto">Accept</Button>
                <Button variant="outline" className="w-full sm:w-auto">Review</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* GRID */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-5 sm:gap-6">

        {/* CHAT */}
        <Card className="lg:col-span-2 flex flex-col rounded-2xl overflow-hidden">
          <CardHeader className="flex justify-between items-center border-b py-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="size-4" />
              Team Chat
            </CardTitle>
            <Badge>{hive.members.length}</Badge>
          </CardHeader>

          <div className="flex-1 min-h-[400px] sm:min-h-[500px]">
            <HiveChat
              hiveId={hive.id}
              hiveName={hive.name}
              currentUserId={session.id}
              disabled={!currentMember}
              initialMessages={hive.messages}
            />
          </div>
        </Card>

        {/* SIDEBAR */}
        <div className="space-y-5">

          {/* MISSIONS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <FileCode2 className="size-4 text-orange" />
                Active Work
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {hiveMissions.map((hm) => {
                const isOptedIn = optedInActivityIds.includes(hm.activityId)
                const latestSubmission = hm.activity.submissions[0]

                return (
                  <div key={hm.activityId} className="p-3 rounded-lg bg-muted/30 space-y-2">
                    <p className="text-sm font-medium">{hm.activity.title}</p>

                    {latestSubmission ? (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="size-3" /> Submitted
                      </p>
                    ) : isOptedIn ? (
                      <Button asChild size="sm" className="w-full">
                        <Link href={`/dashboard/activities/${hm.activity.id}?hiveId=${hive.id}`}>
                          Submit work
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild size="sm" variant="outline" className="w-full">
                        <Link href={`/activities/${hm.activity.slug}`}>
                          Join team
                        </Link>
                      </Button>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* GOVERNANCE */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldAlert className="size-4 text-indigo-500" />
                Decisions
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {hive.proposals.length === 0 ? (
                <div className="p-4 text-center border border-dashed rounded-xl bg-muted/5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">No active motions</p>
                </div>
              ) : (
                hive.proposals.map((p) => (
                  <WorkspaceProposalCard 
                    key={p.id} 
                    proposal={p} 
                    currentUserId={session.id}
                    userEquity={parseFloat(equityPercentage)}
                  />
                ))
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}