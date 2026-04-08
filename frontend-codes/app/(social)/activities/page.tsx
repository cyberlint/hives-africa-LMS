import { prisma } from "@/lib/db"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Users, User, Clock, Zap, Target } from "lucide-react"
import ActivityFilters from "./_components/ActivityFilters"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function ActivitiesHubPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  
  const whereClause: any = {
    status: { in: ['Published', 'Active'] },
    visibility: 'Public',
    courseId: null,
    programId: null
  }

  if (resolvedParams.q) {
    whereClause.OR = [
      { title: { contains: resolvedParams.q, mode: 'insensitive' } },
      { description: { contains: resolvedParams.q, mode: 'insensitive' } }
    ]
  }

  if (resolvedParams.type) whereClause.type = resolvedParams.type
  if (resolvedParams.difficulty) whereClause.difficulty = resolvedParams.difficulty

  const activities = await prisma.activity.findMany({
    where: whereClause,
    include: {
      ksbs: { include: { ksb: true } },
      _count: {
        select: { participations: true, participatingHives: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-[1400px] mx-auto py-8 px-4 sm:px-6 space-y-8">

      {/* HEADER (lighter + tighter) */}
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
        <div className="py-16 flex flex-col items-center text-center border border-dashed border-border/60 rounded-2xl bg-muted/5">
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
          let modeText = "Solo & Squads"
          let ModeIcon = Users

          if (activity.allowSolo && !activity.allowHive) {
            modeText = "Solo Only"
            ModeIcon = User
          } else if (!activity.allowSolo && activity.allowHive) {
            modeText = `Squads (${activity.minHiveSize || 1}-${activity.maxHiveSize || '∞'})`
          }

          return (
            <Card
              key={activity.id}
              className="group rounded-xl border-border/50 hover:border-orange/40 hover:shadow-md transition-all flex flex-col"
            >
              {/* HEADER */}
              <CardHeader className="p-4 pb-3 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-orange/10 text-orange text-[9px] font-semibold uppercase tracking-wide border-none">
                    {activity.type.replace(/_/g, ' ')}
                  </Badge>

                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <ModeIcon className="size-3" />
                    {modeText}
                  </div>
                </div>

                <CardTitle className="text-base font-semibold leading-snug line-clamp-2 group-hover:text-orange transition-colors">
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

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {activity.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs bg-muted/30 px-3 py-2 rounded-lg border border-border/40">
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <Trophy className="size-3.5 text-yellow fill-yellow" />
                    {new Intl.NumberFormat().format(activity.points)}
                  </div>

                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="size-3" />
                    {activity._count.participations + activity._count.participatingHives}
                  </div>
                </div>

                {/* KSB */}
                <div className="flex flex-wrap gap-1">
                  {activity.ksbs.slice(0, 2).map((aKsb) => (
                    <Badge
                      key={aKsb.ksbId}
                      variant="secondary"
                      className="text-[10px] px-2 py-0.5 bg-muted/40 border border-border/40"
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
                <Button
                  asChild
                  className="mt-auto h-9 text-xs font-semibold rounded-lg"
                >
                  <Link href={`/activities/${activity.slug}`}>
                    View Challenge
                  </Link>
                </Button>

              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}