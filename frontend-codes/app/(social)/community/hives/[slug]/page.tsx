import { requireAuth } from "@/domains/auth/require-auth"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, ShieldAlert, Zap, Scale, Lock } from "lucide-react"
import Link from "next/link"

import JoinHiveButton from "../_components/JoinHiveButton"

const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

function getTimeRemaining(expiresAt: Date) {
  const total = expiresAt.getTime() - Date.now()
  if (total <= 0) return "Expired"
  const h = Math.floor((total / (1000 * 60 * 60)) % 24)
  const d = Math.floor(total / (1000 * 60 * 60 * 24))
  return d > 0 ? `${d}d ${h}h` : `${h}h`
}

export default async function HiveDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const session = await requireAuth()
  const resolvedParams = await params

  const hive = await prisma.hive.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      ksbs: { include: { ksb: true } },
      members: {
        include: {
          user: { include: { reputationLedger: { select: { points: true } } } }
        },
        orderBy: { equityShare: 'desc' }
      },
      proposals: {
        where: { status: 'ACTIVE' },
        include: { votes: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!hive) return notFound()

  const isMember = hive.members.some(m => m.user.id === session.id)

  const treasury = hive.members.reduce((acc, member) => {
    const rep = member.user.reputationLedger?.reduce((s, r) => s + (r.points || 0), 0) || 0
    return acc + rep
  }, 0)

  const retained = (hive.treasurySplit * 100).toFixed(0)
  const distributed = (100 - hive.treasurySplit * 100).toFixed(0)

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6">

      {/* HERO */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="px-4 sm:px-6 py-5 flex flex-col gap-5">

          {/* Identity */}
          <div className="flex items-center gap-3">
            <div className="size-14 sm:size-20 rounded-xl bg-muted flex items-center justify-center text-sm sm:text-xl font-semibold shrink-0">
              {getInitials(hive.name)}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-xl font-semibold truncate">
                  {hive.name}
                </h1>

                {hive.isPrivate && (
                  <Badge variant="outline" className="text-[10px] whitespace-nowrap">
                    <Lock className="size-3 mr-1" /> Private
                  </Badge>
                )}
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                {hive.description || "An autonomous skill cluster."}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="size-4 text-yellow-500" />
              <div>
                <p className="text-[10px] text-muted-foreground">Treasury</p>
                <p className="text-sm font-semibold">
                  {new Intl.NumberFormat('en-US', { notation: "compact" }).format(treasury)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="size-4 text-blue-500" />
              <div>
                <p className="text-[10px] text-muted-foreground">Members</p>
                <p className="text-sm font-semibold">{hive.members.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="px-4 sm:px-6 py-3 border-t flex gap-2 overflow-x-auto scrollbar-thin">
          {hive.ksbs.length > 0 ? (
            hive.ksbs.map(k => (
              <Badge key={k.ksbId} variant="outline" className="text-[10px] whitespace-nowrap">
                <Zap className="size-3 mr-1" /> {k.ksb.title}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground italic">
              No skills declared
            </span>
          )}
        </div>
      </div>

      {/* TABS */}
      <Tabs defaultValue="overview">
        <TabsList className="w-full border-b bg-transparent rounded-none h-11 p-0 overflow-x-auto flex gap-6 px-1">
          <TabsTrigger value="overview" className="px-0 h-full text-sm font-medium whitespace-nowrap">
            Overview
          </TabsTrigger>
          <TabsTrigger value="captable" className="px-0 h-full text-sm font-medium whitespace-nowrap">
            Cap Table
          </TabsTrigger>
          <TabsTrigger value="governance" className="px-0 h-full text-sm font-medium whitespace-nowrap">
            Governance
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">

            {/* OVERVIEW */}
            <TabsContent value="overview" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Overview</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  This hive is actively forming its core team and pursuing new opportunities.
                </CardContent>
              </Card>
            </TabsContent>

            {/* CAP TABLE */}
            <TabsContent value="captable" className="m-0">
              {hive.isPrivate && !isMember ? (
                <div className="p-10 text-center border rounded-xl text-sm text-muted-foreground">
                  Private cap table
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">
                      Equity Distribution
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {retained}% retained • {distributed}% distributed
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-0">
                    {hive.members.map((m) => (
                      <div key={m.id} className="flex items-center justify-between px-4 py-3 border-t gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="size-8">
                            <AvatarImage src={m.user.image || undefined} />
                            <AvatarFallback>{getInitials(m.user.name)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium truncate">
                            {m.user.name}
                          </span>
                        </div>

                        <span className="text-sm font-semibold shrink-0">
                          {(m.equityShare * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* GOVERNANCE */}
            <TabsContent value="governance" className="m-0 space-y-4">
              {hive.proposals.map((p) => {
                const forVotes = p.votes.filter(v => v.choice === 'FOR').reduce((s, v) => s + v.voteWeight, 0)
                const againstVotes = p.votes.filter(v => v.choice === 'AGAINST').reduce((s, v) => s + v.voteWeight, 0)
                const total = forVotes + againstVotes
                const percent = total > 0 ? (forVotes / total) * 100 : 0

                return (
                  <Card key={p.id}>
                    <CardHeader>
                      <CardTitle className="text-sm font-semibold">
                        {p.title}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {getTimeRemaining(p.expiresAt)} remaining
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {p.description}
                      </p>

                      <Progress value={percent} className="h-2" />

                      {isMember && (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button size="sm" className="flex-1">
                            Vote For
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Vote Against
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </TabsContent>
          </div>

          {/* RIGHT */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Actions
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                {isMember ? (
                  <>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link href={`/community/hives/${hive.slug}/workspace`}>
                        Enter Workspace
                      </Link>
                    </Button>

                    <Button variant="outline" className="w-full justify-start">
                      Draft Proposal
                    </Button>
                  </>
                ) : (
                  <JoinHiveButton
                    hiveId={hive.id}
                    isPrivate={hive.isPrivate}
                    isRecruiting={hive.isRecruiting}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  )
}