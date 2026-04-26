import { requireAuth } from "@/domains/auth/require-auth"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, ShieldAlert, Zap, Lock, Archive, Plus } from "lucide-react"
import Link from "next/link"

import JoinHiveButton from "../_components/JoinHiveButton"
import HiveGovernanceCard from "../_components/HiveGovernanceCard"
import CreateProposalForm from "../_components/CreateProposalForm"

const getInitials = (name: string) =>
  name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()

export default async function HiveDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const session = await requireAuth()
  const resolvedParams = await params

  const hive = await prisma.hive.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      ksbs: { include: { ksb: true } },
      members: {
        include: {
          user: { select: { id: true, name: true, image: true, reputationLedger: { select: { points: true } } } }
        },
        orderBy: { equityShare: 'desc' }
      },
      proposals: {
        include: { votes: true, creator: { select: { name: true } } },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!hive) return notFound()

  const currentMemberRecord = hive.members.find(m => m.user.id === session.id)
  const isMember = !!currentMemberRecord
  const userEquity = currentMemberRecord?.equityShare || 0
  const retained = (hive.treasurySplit * 100).toFixed(0)
  const distributed = (100 - hive.treasurySplit * 100).toFixed(0)
  const mappedProposals = hive.proposals.map((prop) => ({
    ...prop,
    creatorName: prop.isAnonymous ? "Classified" : prop.creator?.name || "Unknown",
  }))

  const activeProposals = mappedProposals.filter(
    (p) => p.status === "ACTIVE" && new Date(p.expiresAt) > new Date()
  )

  const archivedProposals = mappedProposals.filter(
    (p) => p.status !== "ACTIVE" || new Date(p.expiresAt) <= new Date()
  )

  const treasury = hive.members.reduce((acc, member) => {
    const rep = member.user.reputationLedger?.reduce((s, r) => s + (r.points || 0), 0) || 0
    return acc + rep
  }, 0)

  return (
    <div className="max-w-[1100px] mx-auto px-3 sm:px-5 py-4 space-y-5">

      {/* HERO (lighter + tighter) */}
      <div className="rounded-xl border bg-card p-4 sm:p-5 space-y-4">

        <div className="flex items-start sm:items-center gap-3">

          <div className="size-12 sm:size-14 rounded-lg bg-muted flex items-center justify-center text-sm font-semibold shrink-0">
            {getInitials(hive.name)}
          </div>

          <div className="min-w-0 flex-1">

            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-semibold truncate">
                {hive.name}
              </h1>

              {hive.isPrivate && (
                <Badge variant="outline" className="text-[10px]">
                  <Lock className="size-3 mr-1" /> Private
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {hive.description || "An autonomous skill cluster."}
            </p>

          </div>
        </div>

        {/* Stats (mobile friendly) */}
        <div className="flex gap-6 text-xs sm:text-sm">

          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-yellow-500" />
            <span className="font-medium">
              {new Intl.NumberFormat('en-US', { notation: "compact" }).format(treasury)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="size-4 text-blue-500" />
            <span className="font-medium">
              {hive.members.length} members
            </span>
          </div>

        </div>

        {/* Skills */}
        <div className="flex gap-2 overflow-x-auto pt-1">
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
        <TabsList className="w-full border-b bg-transparent rounded-none h-10 p-0 flex gap-5 overflow-x-auto">
          <TabsTrigger value="overview" className="px-0 text-sm">Overview</TabsTrigger>
          <TabsTrigger value="captable" className="px-0 text-sm">Cap Table</TabsTrigger>
          <TabsTrigger value="governance" className="px-0 text-sm">Governance</TabsTrigger>
        </TabsList>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-5 mt-5">

          <div className="lg:col-span-2 space-y-5">

            {/* OVERVIEW */}
            <TabsContent value="overview" className="m-0">
              <Card>
                <CardContent className="text-sm text-muted-foreground p-4 leading-relaxed">
                  This hive is recruiting contributors for real work.
                  Earn reputation, build proof of contribution, and gain influence as the hive grows.
                </CardContent>
              </Card>
            </TabsContent>

            {/* CAP TABLE */}
            <TabsContent value="captable" className="m-0 space-y-4">

              {hive.isPrivate && !isMember ? (
                <div className="p-10 text-center border rounded-xl text-sm text-muted-foreground">
                  Private cap table
                </div>
              ) : (
                <>
                  {/* EQUITY POLICY */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-semibold">
                        Equity Policy
                      </CardTitle>
                      <CardDescription className="text-xs">
                        How value flows in this hive
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">

                      {/* Progress bar style split */}
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden flex">
                        <div
                          className="bg-orange"
                          style={{ width: `${retained}%` }}
                        />
                        <div
                          className="bg-blue-500"
                          style={{ width: `${distributed}%` }}
                        />
                      </div>

                      {/* Labels */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <span className="size-2 rounded-full bg-orange" />
                          Treasury {retained}%
                        </span>

                        <span className="flex items-center gap-1">
                          <span className="size-2 rounded-full bg-blue-500" />
                          Members {distributed}%
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        A portion of all value generated is retained by the hive treasury to
                        fund future missions, while the rest is distributed among contributors
                        based on participation and governance decisions.
                      </p>

                    </CardContent>
                  </Card>

                  {/* 👇 EXISTING EQUITY DISTRIBUTION */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-semibold">
                        Equity Distribution
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-0">
                      {hive.members.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between px-4 py-3 border-t gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar className="size-8">
                              <AvatarImage src={m.user.image || undefined} />
                              <AvatarFallback>
                                {getInitials(m.user.name)}
                              </AvatarFallback>
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
                </>
              )}

            </TabsContent>

            {/* GOVERNANCE */}
            <TabsContent value="governance" className="m-0 space-y-6">

              {!isMember && (
                <div className="p-8 text-center border rounded-xl text-sm text-muted-foreground">
                  Members only
                </div>
              )}

              {isMember && (
                <>
                  {activeProposals.length === 0 ? (
                    <div className="p-6 sm:p-8 text-center border border-dashed rounded-2xl bg-muted/5 space-y-4">

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">
                          No active decisions right now
                        </p>

                        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                          Motions are how this hive governs itself — from electing leaders to funding work and enforcing rules automatically.

                          Once a motion passes, it executes. No manual enforcement.
                        </p>
                      </div>

                      {isMember && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="bg-orange text-white hover:bg-orange/90 font-medium">
                              <Plus className="size-4 mr-1.5" />
                              Create motion
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="max-w-xl p-0 border-none bg-transparent shadow-none">
                            <DialogHeader className="sr-only">
                              <DialogTitle>Create Motion</DialogTitle>
                            </DialogHeader>

                            <CreateProposalForm
                              hiveId={hive.id}
                              currentUserId={session.id}
                              members={hive.members.map((m) => ({
                                userId: m.user.id,
                                user: { name: m.user.name },
                              }))}
                            />
                          </DialogContent>
                        </Dialog>
                      )}

                    </div>
                  ) : (
                    activeProposals.map((p) => (
                      <HiveGovernanceCard
                        key={p.id}
                        proposal={p}
                        currentUserId={session.id}
                        userEquity={userEquity}
                      />
                    ))
                  )}

                  {archivedProposals.length > 0 && (
                    <div className="space-y-4 pt-6">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase">
                        <Archive className="size-4" /> Archived
                      </div>

                      {archivedProposals.map((p) => (
                        <HiveGovernanceCard
                          key={p.id}
                          proposal={p}
                          currentUserId={session.id}
                          userEquity={userEquity}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>

          </div>

          {/* RIGHT PANEL */}
          <div>
            <Card className="lg:sticky lg:top-6">
              <CardContent className="p-4 space-y-3">

                {isMember ? (
                  <>
                    {/* PRIMARY ACTION NOW WORKSPACE */}
                    <Button asChild className="w-full bg-orange text-white hover:bg-orange/90">
                      <Link href={`/community/hives/${hive.slug}/workspace`}>
                        Enter Workspace
                      </Link>
                    </Button>

                    {/* SECONDARY */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Plus className="size-4 mr-2" /> Draft Motion
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-w-xl p-0 border-none bg-transparent shadow-none">
                        <DialogHeader className="sr-only">
                          <DialogTitle>Draft a New Motion</DialogTitle>
                        </DialogHeader>

                        <CreateProposalForm
                          hiveId={hive.id}
                          currentUserId={session.id}
                          members={hive.members.map(m => ({
                            userId: m.user.id,
                            user: { name: m.user.name }
                          }))}
                        />
                      </DialogContent>
                    </Dialog>
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