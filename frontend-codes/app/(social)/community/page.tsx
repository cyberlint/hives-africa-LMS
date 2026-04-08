import { requireAuth } from "@/domains/auth/require-auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Zap, Settings, Briefcase, Users, Clock } from "lucide-react"
import Link from "next/link"

import FeedComposer from "./_components/FeedComposer"
import SignalActions from "./_components/SignalActions"
import { SidebarPulse } from "./_components/SidebarPulse"
import { PulseItem } from "./_components/types"
import { constructUrl } from "@/lib/construct-url"

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

export default async function CommunityPage() {
  const session = await requireAuth()
  const userId = session.id

  const userKsbs = await prisma.userKSB.findMany({
    where: { userId },
    select: { ksbId: true }
  })
  const myKsbIds = userKsbs.map(k => k.ksbId)

  const [userData, userRep, signals, rawPulseData, liveEvents, matchedBounties, peerSubmissions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        hiveMemberships: { include: { hive: true } },
        portfolio: true,
      }
    }),
    prisma.reputationTransaction.aggregate({
      where: { userId },
      _sum: { points: true }
    }),
    prisma.signal.findMany({
      orderBy: [{ trustScore: 'desc' }, { createdAt: 'desc' }],
      include: {
        author: true,
        sparks: true,
        threads: { include: { author: true }, orderBy: { createdAt: 'asc' } },
        _count: { select: { threads: true } }
      },
      take: 20
    }),
    // THE PULSE DATA
    prisma.$transaction([
      prisma.reputationTransaction.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true }
      }),
      prisma.signal.findMany({
        take: 5,
        where: { type: 'SHOWCASE' },
        orderBy: { createdAt: 'desc' },
        include: { author: true }
      }),
      prisma.bounty.findMany({
        take: 5,
        where: { status: 'OPEN' },
        orderBy: { createdAt: 'desc' },
        include: { creator: true }
      })
    ]),
    prisma.event.findMany({
      where: {
        startdate: { lte: new Date() },
        enddate: { gte: new Date() }
      },
      take: 2
    }),
    prisma.bounty.findMany({
      where: {
        status: 'OPEN',
        creatorId: { not: userId },
      },
      orderBy: { stake: 'desc' },
      take: 3,
      include: { creator: true }
    }),
    prisma.submission.findMany({
      where: {
        status: "Submitted",
        userId: { not: userId },
      },
      orderBy: { createdAt: 'desc' },
      take: 2,
      include: { user: true, activity: true }
    })
  ])

  const totalRep = userRep._sum.points || 0
  const hives = userData?.hiveMemberships.map(m => m.hive) || []
  const portfolioItems = userData?.portfolio || []

  // Transform Pulse
  const pulseItems: PulseItem[] = [
    ...rawPulseData[0].map(rep => ({
      id: rep.id,
      type: "REPUTATION" as const,
      user: { name: rep.user.name, image: rep.user.image },
      title: `${rep.user.name.split(' ')[0]} earned Rep`,
      subtitle: rep.reason,
      timestamp: "Just now"
    })),
    ...rawPulseData[1].map(sig => ({
      id: sig.id,
      type: "PORTFOLIO" as const,
      user: { name: sig.author.name, image: sig.author.image },
      title: "New Showcase",
      subtitle: sig.content.substring(0, 40) + "...",
      timestamp: "Recent"
    })),
    ...rawPulseData[2].map(bounty => ({
      id: bounty.id,
      type: "EVENT" as const,
      user: { name: bounty.creator.name, image: bounty.creator.image },
      title: "Active Bounty",
      subtitle: `${bounty.stake} Rep Reward`,
      timestamp: "Live"
    }))
  ].sort(() => Math.random() - 0.5)

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden bg-background">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full px-4 md:px-6">

        {/* LEFT COLUMN */}
        <div className="md:col-span-4 lg:col-span-3 hidden md:block">
          <div className="sticky top-4 space-y-5">
            <Card className="overflow-hidden border-border/60 shadow-sm">
              <div className="h-16 bg-gradient-to-br from-orange/20 to-blue-500/10" />
              <CardContent className="pt-0 pb-5 flex flex-col items-center text-center">
                <Avatar className="size-16 border-4 border-background -mt-8 mb-3 shadow-md">
                  <AvatarImage src={session.image || undefined} />
                  <AvatarFallback>{getInitials(session.name || "User")}</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-sm tracking-tight">{session.name}</h3>
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                  {userData?.jobTitle || "Hive Member"}
                </p>
                <div className="w-full mt-5 pt-4 border-t flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Reputation</span>
                  <span className="font-black text-orange text-sm tracking-tighter">
                    {new Intl.NumberFormat().format(totalRep)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-2 flex flex-row justify-between items-center">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">My Hives</CardTitle>
                <Settings className="size-3.5 text-muted-foreground/50 cursor-pointer hover:text-foreground transition-colors" />
              </CardHeader>
              <CardContent className="space-y-1 pb-4">
                {hives.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-2">No active memberships.</p>
                ) : (
                  hives.map(hive => (
                    <Link key={hive.slug} href={`/community/hives/${hive.slug}`} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted/50 transition-all group">
                      <div className="size-8 rounded-lg bg-orange/10 text-orange flex items-center justify-center text-[10px] font-black group-hover:scale-110 transition-transform">
                        {getInitials(hive.name)}
                      </div>
                      <span className="text-xs font-bold text-foreground/80 group-hover:text-foreground">{hive.name}</span>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CENTER COLUMN */}
        <div className="md:col-span-8 lg:col-span-6 h-full overflow-y-auto pr-2 space-y-5 pb-20 pt-5 scrollbar-thin scrollbar-thumb-border">
          <FeedComposer user={{ id: session.id, name: session.name || "Anonymous", image: session.image || null, totalRep, portfolioItems }} />

          <div className="flex items-center gap-4 px-2">
            <Separator className="flex-1 opacity-50" />
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <Clock className="size-3" /> Latest Signals
            </div>
            <Separator className="flex-1 opacity-50" />
          </div>

          {signals.map((signal) => {
            const hasSparked = signal.sparks.some(s => s.userId === userId)
            return (
              <Card key={signal.id} className="border-border/60 shadow-sm hover:shadow-md transition-all overflow-hidden bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3 flex flex-row gap-3 items-start">
                  <Avatar className="size-10 border border-border/50">
                    <AvatarImage src={signal.author.image || undefined} />
                    <AvatarFallback>{getInitials(signal.author.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold hover:text-orange cursor-pointer transition-colors">{signal.author.name}</span>
                      {signal.type !== "DISCUSSION" && (
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter
                          ${signal.type === "SHOWCASE" ? "bg-orange/10 text-orange" : 
                            signal.type === "HELP_NEEDED" ? "bg-red-500/10 text-red-500" : "bg-muted text-muted-foreground"}`}
                        >
                          {signal.type.replace("_", " ")}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                      {new Date(signal.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 text-sm leading-relaxed whitespace-pre-wrap px-5">
                  <p className="text-foreground/90">{signal.content}</p>
                  
                  {signal.mediaKey && (
                    <div className="rounded-2xl overflow-hidden border border-border shadow-inner bg-black/5">
                      {signal.mediaKey.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                        <video src={constructUrl(signal.mediaKey)} controls className="w-full max-h-[450px] object-contain" />
                      ) : (
                        <img src={constructUrl(signal.mediaKey)} alt="Signal content" className="w-full max-h-[450px] object-cover" />
                      )}
                    </div>
                  )}

                  {signal.portfolioItemId && (
                    <div className="rounded-2xl border border-orange/20 bg-orange/5 p-4 hover:bg-orange/10 transition-colors cursor-pointer group">
                      <div className="flex gap-4 items-center">
                        <div className="p-2.5 rounded-xl bg-orange/10 text-orange group-hover:scale-110 transition-transform">
                          <Briefcase className="size-5" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-orange uppercase tracking-widest mb-1">Verified Proof</p>
                          <p className="text-sm font-bold text-foreground">Algorithmically Validated Output</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest pt-3 border-t border-border/40">
                    <span className="flex items-center gap-1.5 text-muted-foreground hover:text-orange cursor-pointer transition-colors">
                      <Zap className="size-3.5 fill-current" /> {signal.sparks.length} Sparks
                    </span>
                    <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                      {signal._count.threads} Threaded Replies
                    </span>
                  </div>
                </CardContent>

                <SignalActions 
                  signalId={signal.id} currentUserId={userId} currentUserName={session.name || "Anonymous"} 
                  currentUserImage={session.image || null} initialSparks={signal.sparks.length}
                  hasSparked={hasSparked} threads={signal.threads} 
                />
              </Card>
            )
          })}
        </div>

        {/* RIGHT COLUMN */}
        <div className="hidden lg:block lg:col-span-3 h-full overflow-y-auto no-scrollbar pb-10">
          <div className="sticky top-4 space-y-6">

            {/* LIVE SESSIONS */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50 flex items-center gap-2 px-1">
                <div className="size-1.5 bg-red-500/60 rounded-full" /> Active Sessions
              </h3>
              {liveEvents.length > 0 ? (
                liveEvents.map(event => (
                  <Card
  key={event.id}
  className="group border-border/50 bg-card/30 hover:bg-card/60 transition-all rounded-xl"
>
  <CardContent className="p-3 flex items-center justify-between gap-3">

    {/* LEFT: Content */}
    <div className="min-w-0">
      <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-orange transition-colors">
        {event.title}
      </p>

      {/* micro-meta*/}
      {event.startdate && (
        <p className="text-[10px] text-muted-foreground mt-1">
          {new Date(event.startdate).toLocaleDateString()}
        </p>
      )}
    </div>

    {/* RIGHT: Action */}
    <Link
      href={`/community/events/${event.id}`}
      className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-red-500 hover:text-white px-3 py-1.5 rounded-md border border-red-500/30 hover:bg-red-500 transition-all"
    >
      Enter
    </Link>

  </CardContent>
</Card>
                ))
              ) : (
                <div className="p-4 rounded-2xl border border-dashed border-border bg-muted/5 text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">No Live Sessions</p>
                </div>
              )}
            </div>

            {/* HIVE PULSE (Calm) */}
            <div className="space-y-4 pt-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 px-1">
                Hive Pulse
              </h3>
              <SidebarPulse initialData={pulseItems} />
            </div>

            {/* PEER GOVERNANCE */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2 px-1">
                <Users className="size-3.5" /> Peer Governance
              </h3>
              {peerSubmissions.map(sub => (
                <Card key={sub.id} className="border-border/60 bg-muted/5 shadow-sm hover:border-blue-500/30 transition-all cursor-pointer group">
                  <CardContent className="p-4">
                    <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">{sub.activity.title}</p>
                    <p className="text-xs font-bold leading-tight line-clamp-2 text-foreground/80">Pending review for <span className="text-foreground">{sub.user?.name}</span></p>
                    <div className="flex items-center justify-between mt-4">
                       <Avatar className="size-5 border-2 border-background shadow-sm"><AvatarImage src={sub.user?.image || undefined} /></Avatar>
                       <span className="text-[9px] font-black uppercase text-blue-500 group-hover:underline">Review & Earn Rep</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}