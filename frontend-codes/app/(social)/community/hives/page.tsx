import { requireAuth } from "@/domains/auth/require-auth"
import { prisma } from "@/lib/db"
import { Prisma } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users } from "lucide-react"
import Link from "next/link"

import HiveLaunchButton from "./_components/HiveLaunchButton"
import HiveFiltersInline from "./_components/HiveFiltersInline"

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

type SearchParams = Record<
  string,
  string | string[] | undefined
>

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function HiveDirectoryPage({ searchParams }: PageProps) {
  const session = await requireAuth()

  const params = await searchParams

  const q = typeof params.q === "string" ? params.q : ""
  const ksb = typeof params.ksb === "string" ? params.ksb : ""
  const sort = typeof params.sort === "string" ? params.sort : "treasury"
  const isRecruiting = params.recruiting === "true"

  const hives = await prisma.hive.findMany({
    where: {
      ...(q
        ? { name: { contains: q, mode: "insensitive" as Prisma.QueryMode } }
        : {}),
      ...(ksb
        ? {
            ksbs: {
              some: {
                ksb: {
                  title: {
                    contains: ksb,
                    mode: "insensitive" as Prisma.QueryMode,
                  },
                },
              },
            },
          }
        : {}),
      ...(isRecruiting ? { isRecruiting: true } : {}),
    },
    include: {
      _count: { select: { members: true } },
      ksbs: { include: { ksb: true }, take: 4 },
      members: {
        take: 3,
        include: {
          user: {
            include: {
              reputationLedger: { select: { points: true } },
            },
          },
        },
      },
    },
    orderBy:
      sort === "newest"
        ? { createdAt: "desc" }
        : sort === "members"
        ? { members: { _count: "desc" } }
        : undefined,
  })

  let processedHives = hives.map((hive) => {
    const treasury = hive.members.reduce((acc: number, member) => {
      const repArray = member.user.reputationLedger || []
      const userRep = repArray.reduce(
        (sum: number, r) => sum + (r.points || 0),
        0
      )
      return acc + userRep
    }, 0)

    return { ...hive, treasury }
  })

  if (sort === "treasury") {
    processedHives = processedHives.sort(
      (a, b) => b.treasury - a.treasury
    )
  }

  const topHive = processedHives[0]

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl px-6 sm:px-10 py-12 sm:py-14 border border-orange/10">

        <div className="absolute inset-0 bg-gradient-to-br from-orange/10 via-transparent to-transparent" />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-orange/10 blur-3xl rounded-full" />

        <div className="relative space-y-6 max-w-2xl text-center sm:text-left">

          <h1 className="text-3xl sm:text-4xl font-semibold leading-tight">
            Join a Hive. Build real things.
            <br />
            <span className="text-orange">Earn together.</span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-md">
            Discover teams building real projects. Join one or launch your own.
          </p>

          <div className="space-y-4 pt-2">

            <HiveFiltersInline />

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <HiveLaunchButton />

              <Button
                variant="outline"
                className="w-full sm:w-auto border-orange/20 hover:bg-orange/5"
              >
                Browse Top Hives
              </Button>
            </div>
          </div>
        </div>

        {/* TOP HIVE */}
        {topHive && !q && !ksb && (
          <div className="hidden md:block absolute right-6 top-6">
            <div className="border rounded-xl p-4 bg-background shadow-sm w-[200px]">
              <p className="text-xs text-muted-foreground">Top Hive</p>
              <p className="font-medium truncate">{topHive.name}</p>
              <div className="flex items-center gap-1 mt-1">
                <Trophy className="size-4 text-yellow-500" />
                <span className="text-sm font-semibold">
                  {new Intl.NumberFormat("en-US", {
                    notation: "compact",
                  }).format(topHive.treasury)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* LIST */}
      <div className="flex flex-col gap-3">

        {processedHives.length === 0 ? (
          <div className="py-16 text-center border rounded-xl text-muted-foreground">
            No Hives found
          </div>
        ) : (
          processedHives.map((hive, index) => {
            const isMember = hive.members.some(
              (m) => m.user.id === session.id
            )

            return (
              <Card
                key={hive.id}
                className="p-4 rounded-2xl hover:shadow-md transition flex flex-col gap-3"
              >

                {/* TOP */}
                <div className="flex items-start gap-3">

                  <div className="size-10 rounded-lg bg-muted flex items-center justify-center font-semibold shrink-0">
                    {getInitials(hive.name)}
                  </div>

                  <div className="flex-1 min-w-0">

                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold truncate max-w-[160px] sm:max-w-full">
                        {hive.name}
                      </p>

                      {sort === "treasury" && index === 0 && (
                        <Badge className="text-[10px] px-1.5 py-0">
                          #1
                        </Badge>
                      )}

                      {hive.isPrivate && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          Private
                        </Badge>
                      )}

                      {hive.isRecruiting && (
                        <span className="size-2 rounded-full bg-green-500" />
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {hive.description || "No description"}
                    </p>
                  </div>
                </div>

                {/* BOTTOM */}
                <div className="flex items-center justify-between gap-3">

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">

                    <span className="flex items-center gap-1">
                      <Trophy className="size-3 text-yellow-500" />
                      {new Intl.NumberFormat("en-US", {
                        notation: "compact",
                      }).format(hive.treasury)}
                    </span>

                    <span className="flex items-center gap-1">
                      <Users className="size-3 text-blue-500" />
                      {hive._count.members}
                    </span>

                  </div>

                  <Button
                    asChild
                    size="sm"
                    className="bg-orange text-black hover:opacity-90 shrink-0"
                  >
                    <Link href={`/community/hives/${hive.slug}`}>
                      {isMember ? "Enter" : "View"}
                    </Link>
                  </Button>

                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}