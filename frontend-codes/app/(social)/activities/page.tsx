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
  
  // 1. Build the dynamic Where clause based on URL parameters
  const whereClause: any = {
    status: { in: ['Published', 'Active'] },
    visibility: 'Public',
    courseId: null, // Keep course homework out of the global arena
    programId: null
  }

  // Apply Search Query
  if (resolvedParams.q) {
    whereClause.OR = [
      { title: { contains: resolvedParams.q, mode: 'insensitive' } },
      { description: { contains: resolvedParams.q, mode: 'insensitive' } }
    ]
  }

  // Apply Exact Filters
  if (resolvedParams.type) whereClause.type = resolvedParams.type
  if (resolvedParams.difficulty) whereClause.difficulty = resolvedParams.difficulty

  // 2. Fetch the filtered activities
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
    <div className="max-w-[1280px] mx-auto py-10 px-4 md:px-6">
      
      {/* HEADER */}
      <div className="flex flex-col justify-end gap-2 mb-8">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground flex items-center gap-3">
          The Arena
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Discover hackathons, bounties, and global challenges. Build your verified arsenal and earn on-chain reputation.
        </p>
      </div>

      {/* FILTER CONTROLS */}
      <ActivityFilters />

      {/* EMPTY STATE */}
      {activities.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-center border border-dashed border-border/60 rounded-3xl bg-muted/5">
          <Target className="size-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-bold text-foreground">No challenges found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            We couldn't find any activities matching your current filters. Try clearing your search or adjusting the categories.
          </p>
          <Button asChild variant="outline" className="mt-6 font-bold">
            <Link href="/activities">Clear Filters</Link>
          </Button>
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => {
          let modeText = "Solo & Squads"
          let ModeIcon = Users
          if (activity.allowSolo && !activity.allowHive) {
            modeText = "Solo Only"
            ModeIcon = User
          } else if (!activity.allowSolo && activity.allowHive) {
            modeText = `Squads Only (${activity.minHiveSize || 1}-${activity.maxHiveSize || '∞'})`
          }

          return (
            <Card key={activity.id} className="rounded-2xl border-border/60 shadow-sm hover:border-orange/30 hover:shadow-md transition-all flex flex-col group overflow-hidden">
              <CardHeader className="p-5 pb-3 bg-muted/5 border-b border-border/30">
                <div className="flex justify-between items-start mb-3">
                  <Badge className="bg-orange/10 text-orange border-none font-bold uppercase tracking-widest text-[9px]">
                    {activity.type.replace(/_/g, ' ')}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-bold flex items-center gap-1 text-muted-foreground bg-background">
                    <ModeIcon className="size-3" /> {modeText}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-black leading-tight group-hover:text-orange transition-colors line-clamp-2">
                  {activity.title}
                </CardTitle>
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mt-2">
                  <Clock className="size-3.5 text-blue-500" /> 
                  {activity.deadline ? `Ends ${new Date(activity.deadline).toLocaleDateString()}` : 'Rolling Deadline'}
                </p>
              </CardHeader>
              
              <CardContent className="p-5 pt-4 flex-1 flex flex-col justify-between space-y-5">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {activity.description}
                </p>

                <div className="space-y-4">
                  {/* Stats */}
                  <div className="flex justify-between items-center text-sm font-bold bg-muted/20 p-3 rounded-xl border border-border/50">
                    <div className="flex items-center gap-2 text-foreground">
                      <Trophy className="size-4 text-yellow fill-yellow" /> 
                      {new Intl.NumberFormat('en-US').format(activity.points)} Rep
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                      <Users className="size-3.5" /> 
                      {activity._count.participations} Solo • {activity._count.participatingHives} Squads
                    </div>
                  </div>

                  {/* KSB Arsenal */}
                  <div className="flex flex-wrap gap-1.5">
                    {activity.ksbs.slice(0, 3).map((aKsb) => (
                      <Badge key={aKsb.ksbId} variant="secondary" className="bg-card border border-border/60 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
                        <Zap className="size-3 mr-1 text-orange/70" /> {aKsb.ksb.title}
                      </Badge>
                    ))}
                    {activity.ksbs.length > 3 && (
                      <Badge variant="secondary" className="bg-transparent border-none text-muted-foreground text-[10px] font-bold">
                        +{activity.ksbs.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <Button asChild className="w-full font-bold bg-foreground text-background hover:bg-foreground/90 h-11 mt-2">
                  <Link href={`/activities/${activity.slug}`}>
                    View Details
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