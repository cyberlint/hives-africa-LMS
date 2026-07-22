import { prisma } from "@/lib/db"
import Link from "next/link"
import { Prisma } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Users, User, Clock, Target, type LucideIcon } from "lucide-react"
import ActivityFilters from "./_components/ActivityFilters"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

function getModeDisplay(activity: { allowSolo: boolean; allowHive: boolean; minHiveSize: number | null; maxHiveSize: number | null }): {
  label: string
  Icon: LucideIcon
} {
  if (activity.allowSolo && !activity.allowHive) {
    return { label: "Solo Only", Icon: User }
  }
  if (!activity.allowSolo && activity.allowHive) {
    return {
      label: `Squads (${activity.minHiveSize ?? 1}-${activity.maxHiveSize ?? "∞"})`,
      Icon: Users,
    }
  }
  return { label: "Solo & Squads", Icon: Users }
}

function buildWhereClause(params: { [key: string]: string | undefined }): Prisma.ActivityWhereInput {
  const where: Prisma.ActivityWhereInput = {
    status: { in: ["Published", "Active"] },
    visibility: "Public",
    courseId: null,
    programId: null,
  }

  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
    ]
  }

  if (params.type) where.type = params.type
  if (params.difficulty) where.difficulty = params.difficulty

  return where
}

export default async function ActivitiesHubPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const whereClause = buildWhereClause(resolvedParams)

  const activities = await prisma.activity.findMany({
    where: whereClause,
    include: {
      ksbs: { include: { ksb: true } },
      _count: {
        select: { participations: true, participatingHives: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 px-4 py-8 sm:px-6">
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          The Arena
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
          Discover challenges. Build proof. Earn reputation.
        </p>
      </div>

      {/* FILTERS */}
      <ActivityFilters />

      {/* EMPTY STATE */}
      {activities.length === 0 && (
        <div className="py-16 flex flex-col items-center text-center border border-dashed border-border/60 rounded-2xl bg-muted/30">
          <Target className="size-10 text-muted-foreground/40 mb-3" />
          <h3 className="text-base font-semibold text-foreground">No challenges found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Try adjusting your filters or search query.
          </p>
          <Button asChild variant="outline" className="mt-4 h-9 text-xs">
            <Link href="/activities">Clear Filters</Link>
          </Button>
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {activities.map((activity) => {
          const { label: modeText, Icon: ModeIcon } = getModeDisplay(activity)
          const totalParticipants = activity._count.participations + activity._count.participatingHives

          return (
            <Card
              key={activity.id}
              className="group flex flex-col rounded-xl border border-border/50 bg-card transition-all hover:border-primary/40 hover:shadow-md"
            >
              {/* HEADER */}
              <CardHeader className="p-4 pb-3 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="border-none bg-primary/10 text-primary text-[9px] font-semibold uppercase tracking-wide">
                    {activity.type.replace(/_/g, " ")}
                  </Badge>

                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <ModeIcon className="size-3" />
                    {modeText}
                  </div>
                </div>

                <CardTitle className="text-base font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {activity.title}
                </CardTitle>

                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" />
                  {activity.deadline
                    ? `Ends ${new Date(activity.deadline).toLocaleDateString()}`
                    : "Rolling"}
                </p>
              </CardHeader>

              {/* BODY */}
              <CardContent className="px-4 pb-4 pt-0 flex flex-col gap-4 flex-1">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {activity.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/40 px-3 py-2 text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <Trophy className="size-3.5 fill-amber-500 text-amber-500" />
                    {new Intl.NumberFormat().format(activity.points)}
                  </div>

                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="size-3" />
                    {totalParticipants}
                  </div>
                </div>

                {/* KSB */}
                <div className="flex flex-wrap gap-1">
                  {activity.ksbs.slice(0, 2).map((aKsb) => (
                    <Badge
                      key={aKsb.ksbId}
                      variant="secondary"
                      className="border-border/50 bg-muted text-[10px]"
                    >
                      {aKsb.ksb.title}
                    </Badge>
                  ))}

                  {activity.ksbs.length > 2 && (
                    <span className="text-[10px] text-muted-foreground font-medium">
                      +{activity.ksbs.length - 2}
                    </span>
                  )}
                </div>

                {/* CTA */}
                <Button asChild className="mt-auto h-9 text-xs font-semibold rounded-lg">
                  <Link href={`/activities/${activity.slug}`}>View Challenge</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}