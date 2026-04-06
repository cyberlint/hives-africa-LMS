import { requireAuth } from "@/domains/auth/require-auth"
import { prisma } from "@/lib/db"
import { Prisma } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Lock } from "lucide-react"
import Link from "next/link"

import HiveLaunchButton from "./_components/HiveLaunchButton"
import HiveFilters from "./_components/HiveFilters"

const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function HiveDirectoryPage({ searchParams }: PageProps) {
  const session = await requireAuth()
  const params = await searchParams

  const q = typeof params.q === 'string' ? params.q : ""
  const ksb = typeof params.ksb === 'string' ? params.ksb : ""
  const sort = typeof params.sort === 'string' ? params.sort : "treasury"
  const isRecruiting = params.recruiting === 'true'

  const hives = await prisma.hive.findMany({
    where: {
      ...(q ? { name: { contains: q, mode: 'insensitive' as Prisma.QueryMode } } : {}),
      ...(ksb ? { ksbs: { some: { ksb: { title: { contains: ksb, mode: 'insensitive' as Prisma.QueryMode } } } } } : {}),
      ...(isRecruiting ? { isRecruiting: true } : {})
    },
    include: {
      _count: { select: { members: true } },
      ksbs: { include: { ksb: true }, take: 4 },
      members: {
        take: 3,
        include: {
          user: {
            include: { reputationLedger: { select: { points: true } } }
          }
        }
      }
    },
    orderBy: sort === 'newest'
      ? { createdAt: 'desc' }
      : sort === 'members'
      ? { members: { _count: 'desc' } }
      : undefined
  })

  let processedHives = hives.map((hive) => {
    const treasury = hive.members.reduce((acc: number, member) => {
      const repArray = member.user.reputationLedger || []
      const userRep = repArray.reduce((sum: number, r) => sum + (r.points || 0), 0)
      return acc + userRep
    }, 0)

    return { ...hive, treasury }
  })

  if (sort === 'treasury') {
    processedHives = processedHives.sort((a, b) => b.treasury - a.treasury)
  }

  const topHive = processedHives[0]

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">

      {/* HERO */}
      <div className="relative rounded-2xl border bg-card overflow-hidden p-5 sm:p-8">
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-2xl sm:text-4xl font-semibold leading-tight">
            Find your Squad.
            <br />
            <span className="text-orange">Pool your Rep.</span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground">
            Join a Hive or launch your own to earn sweat equity.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="w-full sm:w-auto">
              Browse Top Hives
            </Button>
            <HiveLaunchButton />
          </div>
        </div>

        {topHive && !q && !ksb && (
          <div className="hidden md:block absolute right-6 top-6">
            <div className="border rounded-xl p-4 bg-background shadow-sm w-[200px]">
              <p className="text-xs text-muted-foreground">Top Hive</p>
              <p className="font-medium truncate">{topHive.name}</p>
              <div className="flex items-center gap-1 mt-1">
                <Trophy className="size-4 text-yellow-500" />
                <span className="text-sm font-semibold">
                  {new Intl.NumberFormat('en-US', { notation: "compact" }).format(topHive.treasury)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <HiveFilters />

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
        {processedHives.length === 0 ? (
          <div className="col-span-full py-16 text-center border rounded-xl text-muted-foreground">
            No Hives found
          </div>
        ) : (
          processedHives.map((hive, index) => {
            const isTopRank = sort === 'treasury' && index === 0 && !q && !ksb
            const isMember = hive.members.some((m) => m.user.id === session.id)

            return (
              <Card key={hive.id} className="flex flex-col">

                {/* HEADER */}
                <CardHeader className="p-4 space-y-3">

                  {/* badges */}
                  <div className="flex flex-wrap gap-1">
                    {isTopRank && <Badge>#1</Badge>}
                    {hive.isPrivate && <Badge variant="outline"><Lock className="size-3 mr-1" />Private</Badge>}
                    {hive.isRecruiting && <Badge className="bg-green-500/10 text-green-600">Recruiting</Badge>}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-lg bg-muted flex items-center justify-center font-semibold">
                      {getInitials(hive.name)}
                    </div>

                    <div className="min-w-0">
                      <CardTitle className="text-sm font-semibold truncate">
                        {hive.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {new Date(hive.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                {/* CONTENT */}
                <CardContent className="p-4 pt-0 flex-1 space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {hive.description}
                  </p>

                  {/* STATS */}
                  <div className="flex flex-col sm:flex-row gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Trophy className="size-4 text-yellow-500" />
                      <span>{new Intl.NumberFormat('en-US', { notation: "compact" }).format(hive.treasury)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-blue-500" />
                      <span>{hive._count.members}</span>
                    </div>
                  </div>

                  {/* TAGS */}
                  <div className="flex flex-wrap gap-1.5">
                    {hive.ksbs.map(k => (
                      <Badge key={k.ksbId} variant="secondary" className="text-[10px]">
                        {k.ksb.title}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                {/* FOOTER */}
                <CardFooter className="p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div className="flex -space-x-2">
                    {hive.members.map((m) => (
                      <Avatar key={m.id} className="size-7 border-2 border-card">
                        <AvatarImage src={m.user.image || undefined} />
                        <AvatarFallback className="text-[10px]">
                          {getInitials(m.user.name)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>

                  <Button asChild className="w-full sm:w-auto">
                    <Link href={`/community/hives/${hive.slug}`}>
                      {isMember ? "Enter" : "View"}
                    </Link>
                  </Button>
                </CardFooter>

              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}