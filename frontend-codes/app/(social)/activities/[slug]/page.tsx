import { prisma } from "@/lib/db"
import { requireAuth } from "@/domains/auth/require-auth"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Trophy, Users, Zap, Clock, Target, Rocket
} from "lucide-react"
import JoinArenaTrigger from "../_components/JoinArenaTrigger"

const getInitials = (name: string) =>
  name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()

export default async function ActivityDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await requireAuth()
  const { slug } = await params

  const activity = await prisma.activity.findUnique({
    where: { slug },
    include: {
      ksbs: { include: { ksb: true } },
      participatingHives: {
        include: { hive: { include: { members: true } } },
        orderBy: { joinedAt: "desc" }
      },
      participations: {
        where: { hiveId: null },
        include: { user: true },
        orderBy: { joinedAt: "desc" }
      }
    }
  })

  if (!activity) return notFound()

  // 1. Fetch exactly HOW the user is participating (Include Hive data)
  const myParticipation = await prisma.participation.findFirst({
    where: { userId: session.id, activityId: activity.id },
    include: { hive: true } // Tells us if they are Solo or with a Squad
  })

  // 2. Check if any of the user's Hives are ALREADY registered for this activity
  const userHiveMemberships = await prisma.hiveMember.findMany({
    where: { userId: session.id },
    select: { hiveId: true }
  })
  const userHiveIds = userHiveMemberships.map(m => m.hiveId)
  
  const myCommittedHives = activity.participatingHives
    .filter(ph => userHiveIds.includes(ph.hiveId))
    .map(ph => ph.hive)

  // 3. Find Hives where user has authority to click "Commit Squad"
  const leadershipHives = await prisma.hiveMember.findMany({
    where: {
      userId: session.id,
      role: { in: ["FOUNDER", "ADMIN", "LEAD"] }
    },
    include: {
      hive: { include: { _count: { select: { members: true } } } }
    }
  })

  const eligibleHives = leadershipHives.map(m => ({
    slug: m.hive.slug,
    name: m.hive.name,
    memberCount: m.hive._count.members,
    role: m.role
  }))

  const activityData = {
    id: activity.id,
    title: activity.title,
    slug: activity.slug!,
    allowSolo: activity.allowSolo,
    allowHive: activity.allowHive,
    minHiveSize: activity.minHiveSize,
    maxHiveSize: activity.maxHiveSize,
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-6 space-y-8">

      {/* ================= HERO ================= */}
      <div className="rounded-2xl border bg-card overflow-hidden">

        {/* TOP STRIP */}
        <div className="h-32 bg-gradient-to-r from-orange/10 via-background to-blue-500/10 border-b" />

        <div className="px-5 md:px-8 py-6 space-y-4">
          <div className="flex items-start gap-4">

            <div className="size-16 rounded-xl bg-orange/10 flex items-center justify-center shrink-0">
              <Rocket className="size-7 text-orange" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="text-[10px]">{activity.type.replace(/_/g, " ")}</Badge>
                <Badge variant="outline" className="text-[10px]">{activity.difficulty}</Badge>
              </div>

              <h1 className="text-xl md:text-3xl font-semibold mt-2 leading-tight">
                {activity.title}
              </h1>

              <p className="text-sm text-muted-foreground mt-2 max-w-xl">
                {activity.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* SKILLS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Required Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {activity.ksbs.map(k => (
                <Badge key={k.ksbId} variant="secondary" className="text-xs">
                  <Zap className="size-3 mr-1" />
                  {k.ksb.title}
                </Badge>
              ))}
            </CardContent>
          </Card>

          {/* OBJECTIVES */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Target className="size-4" />
                Objectives
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                Submit your work before the deadline. All submissions are reviewed and validated.
              </p>
              <ul className="space-y-1">
                <li>• Clean, well-documented output</li>
                <li>• Verifiable work links (GitHub, Figma, etc.)</li>
                <li>• Clear contribution breakdown (for teams)</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* JOIN CARD */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground">Reward</p>
                <div className="flex items-center gap-1 mt-1">
                  <Trophy className="size-4 text-yellow-500" />
                  <span className="text-lg font-semibold">
                    {new Intl.NumberFormat().format(activity.points)}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-muted-foreground">Deadline</p>
                <p className="text-sm font-medium mt-1 flex items-center gap-1 justify-end">
                  <Clock className="size-4" />
                  {activity.deadline
                    ? new Date(activity.deadline).toLocaleDateString()
                    : "Rolling"}
                </p>
              </div>
            </CardHeader>

            <CardContent>
              {/* UPDATED TRIGGER WITH NEW PROPS */}
              <JoinArenaTrigger
                activity={activityData}
                eligibleHives={eligibleHives}
                myParticipation={myParticipation}
                myCommittedHives={myCommittedHives}
              />

              <p className="text-xs text-muted-foreground mt-3 text-center">
                {activity.allowSolo && "Solo"}
                {activity.allowSolo && activity.allowHive && " & "}
                {activity.allowHive && "Team"} participation available
              </p>
            </CardContent>
          </Card>

          {/* TEAMS */}
          <Card>
            <CardHeader className="flex flex-row justify-between">
              <CardTitle className="text-sm font-semibold">
                Teams
              </CardTitle>
              <Badge variant="secondary">{activity.participatingHives.length}</Badge>
            </CardHeader>

            <CardContent className="space-y-2">
              {activity.participatingHives.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No teams yet
                </p>
              ) : (
                activity.participatingHives.map(({ hive }) => (
                  <div key={hive.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="size-8 rounded-md bg-muted flex items-center justify-center text-xs font-semibold">
                      {getInitials(hive.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{hive.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {hive.members.length} members
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* SOLO */}
          <Card>
            <CardHeader className="flex flex-row justify-between">
              <CardTitle className="text-sm font-semibold">
                Individuals
              </CardTitle>
              <Badge variant="secondary">{activity.participations.length}</Badge>
            </CardHeader>

            <CardContent className="flex flex-wrap gap-2">
              {activity.participations.length === 0 ? (
                <p className="text-xs text-muted-foreground w-full text-center py-4">
                  No participants yet
                </p>
              ) : (
                activity.participations.map(({ user }) => (
                  <Avatar key={user.id} className="size-9">
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback>
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                ))
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}