import { requireAuth } from "@/domains/auth/require-auth"
import { prisma } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Lock, AlertTriangle, CheckCircle2, MessageSquare,
  Calendar, GitPullRequest, ShieldAlert, FileCode2, Globe
} from "lucide-react"
import Link from "next/link"
import HiveChat from "../../_components/HiveChat"
import type { ComposerUserContext } from "../../../_components/FeedComposer"

const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function HiveWorkspacePage({ params }: PageProps) {
  const session = await requireAuth()
  const resolvedParams = await params

  const hive = await prisma.hive.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      members: { include: { user: true } },
      proposals: {
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' }
      },
      messages: {
        include: {
          user: { select: { id: true, name: true, image: true } }
        },
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  if (!hive) return notFound()

  const currentMember = hive.members.find(m => m.userId === session.id)
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
    where: { userId: session.id, approvalStatus: 'PENDING' },
    include: {
      submission: {
        include: { activity: true, roster: { include: { user: true } } }
      }
    },
    take: 1
  })

  const activeSplit = pendingSplits[0]

  const activeMission = await prisma.participation.findFirst({
    where: { userId: session.id, progress: { lt: 100 } },
    include: { activity: true },
    orderBy: { joinedAt: 'desc' }
  })

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-xl bg-muted flex items-center justify-center font-semibold text-sm">
            {getInitials(hive.name)}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{hive.name}</h1>
              <Badge variant="outline" className="text-xs">
                {hive.isPrivate ? <Lock className="size-3 mr-1" /> : <Globe className="size-3 mr-1" />}
                {hive.isPrivate ? "Private" : "Public"}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mt-1">
              {currentMember
                ? <>You own <span className="font-medium text-foreground">{equityPercentage}%</span> of this hive</>
                : <span className="italic">Viewing as guest</span>}
            </p>
          </div>
        </div>

        {currentMember && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="size-4 mr-2" /> Sync
            </Button>

            <Button asChild size="sm">
              <Link href={`/community/hives/${hive.slug}/submit`}>
                <GitPullRequest className="size-4 mr-2" />
                Submit
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* ================= SMART SPLIT ================= */}
      {activeSplit && (
        <Card className="border-orange/30 bg-orange/5">
          <CardContent className="p-5 flex gap-4">
            <AlertTriangle className="text-orange mt-1" />

            <div className="flex-1">
              <h3 className="font-semibold">
                Approve Split • {activeSplit.submission.activity.title}
              </h3>

              <p className="text-sm text-muted-foreground mt-1">
                Confirm contribution shares before payout is distributed.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {activeSplit.submission.roster.map((c) => {
                  const isMe = c.userId === session.id
                  return (
                    <div
                      key={c.id}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs
                      ${isMe ? "bg-orange/10 border-orange/30" : "bg-background"}`}
                    >
                      <Avatar className="size-6">
                        <AvatarImage src={c.user.image || undefined} />
                        <AvatarFallback className="text-[10px]">
                          {getInitials(c.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {isMe ? "You" : c.user.name.split(' ')[0]}
                      </span>
                      <span className="text-muted-foreground">
                        {(c.claimedShare * 100).toFixed(0)}%
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 flex gap-2">
                <Button size="sm">
                  <CheckCircle2 className="size-4 mr-2" />
                  Approve
                </Button>
                <Button size="sm" variant="outline">
                  Dispute
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ================= GRID ================= */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* CHAT */}
        <Card className="lg:col-span-2 flex flex-col h-[600px] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <MessageSquare className="size-4" />
              Hive Chat
            </CardTitle>

            <span className="text-xs text-muted-foreground">
              {hive.members.length} members
            </span>
          </CardHeader>

          <HiveChat
            hiveId={hive.id}
            hiveName={hive.name}
            currentUserId={session.id}
            disabled={!currentMember}
            initialMessages={hive.messages}
          />
        </Card>

        {/* SIDEBAR */}
        <div className="space-y-6">

          {/* MISSION */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileCode2 className="size-4" />
                Active Mission
              </CardTitle>
            </CardHeader>

            <CardContent>
              {activeMission ? (
                <>
                  <h4 className="font-medium text-sm">
                    {activeMission.activity.title}
                  </h4>

                  <Progress value={activeMission.progress} className="mt-3 h-2" />

                  <div className="flex justify-between text-xs mt-2 text-muted-foreground">
                    <span>{activeMission.progress}% complete</span>
                    <span>In progress</span>
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground text-center">
                  No active mission
                </div>
              )}
            </CardContent>
          </Card>

          {/* GOVERNANCE */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShieldAlert className="size-4" />
                Governance
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {hive.proposals.length > 0 ? (
                hive.proposals.map((p) => (
                  <div key={p.id} className="p-3 border rounded-lg">
                    <Badge variant="outline" className="text-[10px] mb-1">
                      {p.type.replace('_', ' ')}
                    </Badge>

                    <p className="text-sm font-medium">{p.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {p.description}
                    </p>

                    <Button size="sm" className="mt-2 w-full">
                      Vote
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  No proposals
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}