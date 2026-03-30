"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Zap, Trophy, Target, Flame, GitPullRequest,
  CheckCircle2, AlertCircle, ExternalLink, Activity,
  Compass, Library, Award, Clock, ArrowRight, Loader,
  LucideIcon,
  Users,
  MessageSquare,
  Calendar,
  Video
} from "lucide-react"
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip
} from "recharts"
import Link from "next/link"
import Image from "next/image"
import { constructUrl } from "@/lib/construct-url"
import { authClient } from "@/lib/auth-client"
import { useDashboard } from "@/app/(private routes)/dashboard/studentContext"
import { getDashboardData, DashboardActionItem } from "./actions/get-dashboard-data"

// Map string icon names from the database to actual Lucide components
const IconMap: Record<string, LucideIcon> = {
  Zap,
  GitPullRequest,
  Target,
  Award
}

function generateKSBInsight(ksbData: { dimension: string; score: number; fullMark: number }[]) {

  if (!ksbData || ksbData.length === 0) return null;

  const activeScores = ksbData.filter(k => k.score > 0);

  if (activeScores.length === 0 || activeScores.every(k => k.score <= 10)) {
    return {
      type: "new",
      text: "Welcome! We don't have quite enough data to map your skills just yet. Complete some projects and come back here to track your growth!",
      actionText: "Explore Curriculum",
      link: "/dashboard/courses"
    };
  }

  const sorted = [...ksbData].sort((a, b) => a.score - b.score);
  const weakest = sorted[0];
  const strongest = sorted[sorted.length - 1];

  if (strongest.score - weakest.score <= 10 && strongest.score >= 50) {
    return {
      type: "balanced",
      text: "You're doing great across the board! Keep up the momentum by taking on some new challenges.",
      actionText: "Find a Challenge",
      link: "/dashboard/activities"
    };
  }

  // Friendly suggestions
  let actionText = "";
  let link = "/dashboard/activities";

  if (weakest.dimension === "Knowledge") {
    actionText = "learning modules";
    link = "/dashboard/learning";
  } else if (weakest.dimension === "Skill") {
    actionText = "hands-on projects";
    link = "/dashboard/activities?type=project";
  } else if (weakest.dimension === "Behavior") {
    actionText = "peer reviews";
    link = "/dashboard/activities?type=peer_review";
  }

  const isCritical = weakest.score < 40 && strongest.score >= 50;

  return {
    type: "gap",
    isCritical,
    weakName: weakest.dimension,
    strongName: strongest.dimension,
    actionText,
    link
  };
}

export default function DashboardOverview() {
  const { data: session } = authClient.useSession()
  const { enrolledCourses, loading: coursesLoading, error, user: dashboardUser } = useDashboard()

  // --- REAL-TIME ENGINE STATE ---
  const [engineData, setEngineData] = useState({
    reputationPoints: 0,
    verifiedKSBs: 0,
    tier: "Builder",
    streak: 0,
    ksbData: [
      { dimension: 'Knowledge', score: 0, fullMark: 100 },
      { dimension: 'Skill', score: 0, fullMark: 100 },
      { dimension: 'Behavior', score: 0, fullMark: 100 },
    ],
    nextMoves: [] as DashboardActionItem[],
    microWins: [] as { id: number, text: string, time: string }[],
    portfolio: [] as any[], // <--- ADD THIS
  })
  const [isEngineLoading, setIsEngineLoading] = useState(true)

  useEffect(() => {
    async function loadEngine() {
      const targetUserId = session?.user?.id || dashboardUser?.id;
      if (!targetUserId) return;

      const result = await getDashboardData(targetUserId);
      if (result.status === "success" && result.data) {
        setEngineData(result.data);
      }
      setIsEngineLoading(false);
    }

    if (!coursesLoading) {
      loadEngine();
    }
  }, [session, dashboardUser, coursesLoading]);

  const user = {
    name: session?.user?.name || dashboardUser?.name || "Builder",
  }

  const userProgress = dashboardUser?.progress || []

  if (coursesLoading || isEngineLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] animate-in fade-in duration-1000">
        <div className="flex flex-col items-center gap-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-orange/20 blur-xl rounded-full size-12 animate-pulse" />
            <Loader className="h-8 w-8 animate-spin text-orange relative z-10" strokeWidth={2} />
          </div>
          <p className="text-muted-foreground text-sm tracking-wide font-medium">Initializing workspace...</p>
        </div>
      </div>
    )
  }

  if (error && !error.includes("Unauthorized")) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-md p-8 bg-card border border-border rounded-3xl shadow-sm">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-6" strokeWidth={1.5} />
          <h2 className="text-xl font-medium text-foreground mb-2">Workspace Interrupted</h2>
          <p className="text-muted-foreground mb-8 text-sm">We encountered an issue while fetching your data.</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="rounded-full px-8 hover:bg-muted">
            Refresh Link
          </Button>
        </div>
      </div>
    )
  }

  const totalProgress = userProgress.length > 0
    ? userProgress.reduce((acc: number, p) => acc + p.progress, 0) / userProgress.length
    : 0
  const completedCourses = userProgress.filter((p) => p.progress === 100).length
  const hasNoCourses = enrolledCourses.length === 0

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* 🟣 A. HERO SECTION */}
      <div className="relative rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-5 sm:p-6 overflow-hidden">

        {/* Subtle Glow (reduced + controlled) */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange/10 rounded-full blur-3xl pointer-events-none opacity-60" />

        <div className="relative z-10 flex flex-col gap-6">

          {/* TOP: Identity + Status */}
          <div className="space-y-3">

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="bg-background/60 border-orange/30 text-orange text-xs px-2.5 py-1 rounded-full flex items-center gap-1"
              >
                <Trophy className="size-3.5" />
                {engineData.tier}
              </Badge>

              <Badge
                variant="secondary"
                className="bg-orange/10 text-orange text-xs px-2.5 py-1 rounded-full flex items-center gap-1 border-none"
              >
                <Flame className="size-3.5" fill="currentColor" />
                {engineData.streak}d
              </Badge>
            </div>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {user.name.split(" ")[0]}.
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md">
              {hasNoCourses
                ? "Your journey to verifiable skills starts here."
                : `${engineData.verifiedKSBs} competencies verified.`}
            </p>
          </div>

          {/* BOTTOM: Stats + CTA (stacked on mobile) */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            {/* Reputation */}
            <div className="flex items-end justify-between sm:block">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Reputation
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                {engineData.reputationPoints}
                <span className="text-sm font-medium text-muted-foreground ml-1">
                  pts
                </span>
              </p>
            </div>

            {/* CTA */}
            <Button asChild className="bg-yellow text-white w-full sm:w-auto rounded-full hover:bg-foreground/90 px-5 py-5 sm:py-2 h-auto font-medium">
              <Link href="/p/username">
                View Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 🎛 Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex gap-2 overflow-x-auto px-1 pb-2 hide-scrollbar">
          {[
            { label: "Overview", value: "overview" },
            { label: "Proof", value: "portfolio" },
            { label: "Community", value: "community" },
            { label: "Journey", value: "journey" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="shrink-0 rounded-full px-4 py-2 text-sm font-medium
        text-muted-foreground
        data-[state=active]:bg-foreground
        data-[state=active]:text-background
        transition-colors"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* --- OVERVIEW TAB --- */}
        <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex flex-col gap-10 lg:grid lg:grid-cols-12 lg:gap-10">

            {/* LEFT COLUMN (Span 8) */}
            <div className="lg:col-span-8 space-y-10">

              {/* 🟡 Action-Driven Engine (MINIMALIST REDESIGN) */}
              {!hasNoCourses && engineData.nextMoves.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-base font-semibold flex items-center gap-2">
                    <Target className="size-4 text-orange" />
                    Action Required
                  </h2>

                  <div className="divide-y divide-border/40 rounded-2xl border border-border/50 bg-card/40">
                    {engineData.nextMoves.map((move) => {
                      const MoveIcon = IconMap[move.icon] || Zap;

                      return (
                        <div key={move.id} className="flex items-center justify-between gap-3 p-4">

                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 rounded-xl bg-muted/50">
                              <MoveIcon className="size-4" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {move.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {move.time}
                              </p>
                            </div>
                          </div>

                          <Button asChild size="sm" variant="ghost" className="shrink-0 hover:bg-yellow-200">
                            <Link href={move.link}>
                              Review
                            </Link>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 🟢 Blended Course Grid / Empty State */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground tracking-tight">
                    {hasNoCourses ? "Explore the Curriculum" : "Current Focus"}
                  </h2>
                </div>

                {hasNoCourses ? (
                  <div className="rounded-[2rem] border border-border bg-card/40 backdrop-blur-sm px-6 py-24 text-center flex flex-col items-center shadow-sm">
                    <div className="size-20 rounded-full bg-muted/50 flex items-center justify-center mb-6 border border-border/50">
                      <Library className="h-10 w-10 text-muted-foreground/50" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-medium text-foreground mb-2">Your workspace awaits</h3>
                    <p className="text-muted-foreground mb-10 max-w-md text-base leading-relaxed">
                      Browse our selection of carefully crafted projects and courses to begin building your foundation.
                    </p>
                    <Button asChild className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8 py-6 shadow-xl font-medium transition-all hover:scale-[1.03]">
                      <Link href={"/dashboard/courses"} className="bg-yellow text-white">
                        <Compass className="h-5 w-5 mr-2" strokeWidth={2} />
                        Browse Catalog
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {enrolledCourses.slice(0, 2).map((course) => {
                      const progress = userProgress.find((p) => p.courseId === course.id)
                      const thumbnailUrl = constructUrl(course.fileKey)
                      const isCompleted = progress?.progress === 100

                      return (
                        <Link href={`/dashboard/${course.id}/chapter`} key={course.id} className="group flex flex-col h-full">
                          <Card className="rounded-[2rem] overflow-hidden border border-border/60 shadow-sm hover:shadow-xl hover:border-orange/40 transition-all duration-500 flex flex-col h-full bg-card/60 backdrop-blur-sm">
                            <div className="relative h-48 w-full overflow-hidden bg-muted">
                              <Image src={thumbnailUrl} alt={course.title} className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" fill sizes="(max-width: 768px) 100vw, 50vw" />
                            </div>
                            <CardContent className="p-6 flex flex-col flex-1">
                              <div className="flex items-center gap-3 mb-4">
                                <Avatar className="h-6 w-6 border border-border/50">
                                  <AvatarImage src={course.instructor.avatar || "/ai.png"} />
                                  <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">{course.instructor.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs font-medium text-muted-foreground line-clamp-1">{course.instructor.name}</span>
                              </div>
                              <h3 className="font-semibold text-lg text-foreground mb-8 line-clamp-2 leading-snug group-hover:text-orange transition-colors">
                                {course.title}
                              </h3>
                              <div className="mt-auto pt-5 border-t border-border/40">
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{isCompleted ? "Completed" : "Progress"}</span>
                                  <span className="text-sm font-semibold text-foreground">{progress?.progress || 0}%</span>
                                </div>
                                <Progress value={progress?.progress || 0} className="h-1.5 bg-muted/50" indicatorClassName={isCompleted ? "bg-green-500" : "bg-orange"} />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN (Span 4) */}
            <div className="lg:col-span-4 space-y-8">
              {/* 🔵 C. KSB RADAR */}
              <Card className="rounded-2xl border border-border/50 bg-card/40">
                <CardHeader className="p-4 border-b border-border/40">
                  <CardTitle className="text-sm font-semibold flex justify-between">
                    Skill Matrix
                    <span className="text-xs text-muted-foreground">
                      Lv. {Math.floor(engineData.reputationPoints / 500) + 1}
                    </span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4">
                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={engineData.ksbData}>
                        <PolarGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                        <PolarAngleAxis dataKey="dimension" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontWeight: 600 }} />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "12px", border: "1px solid hsl(var(--border))", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} itemStyle={{ color: "hsl(var(--foreground))", fontWeight: 500 }} />
                        <Radar name="Competence" dataKey="score" stroke="hsl(var(--orange))" strokeWidth={2.5} fill="hsl(var(--orange))" fillOpacity={0.25} />
                      </RadarChart>
                    </ResponsiveContainer>
                    {/* ---> INSIGHT ENGINE HERE <--- */}
                    <div className="mt-4 w-full">
                      {(() => {
                        const insight = generateKSBInsight(engineData.ksbData);

                        if (!insight) return null;

                        return (
                          <div className={`p-5 rounded-2xl border backdrop-blur-sm transition-colors ${insight.type === 'gap' && insight.isCritical
                              ? 'bg-orange/5 border-orange/20'
                              : 'bg-muted/30 border-border/40'
                            }`}>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                Quick Tip
                              </p>
                              {insight.type === 'gap' && insight.isCritical && (
                                <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-orange bg-orange/10 px-2 py-0.5 rounded-sm">
                                  <AlertCircle className="size-3" /> Needs Attention
                                </span>
                              )}
                            </div>

                            <p className="text-sm text-foreground leading-relaxed mb-4">
                              {insight.type === "new" || insight.type === "balanced" ? (
                                insight.text
                              ) : insight.isCritical ? (
                                <>
                                  It looks like your <span className="font-semibold text-orange">{insight.weakName}</span> skills could use a little extra love right now. Spending some time on <span className="font-semibold text-foreground">{insight.actionText}</span> will really help you level up!
                                </>
                              ) : (
                                <>
                                  You are doing awesome in <span className="font-semibold text-foreground">{insight.strongName}</span>! To round out your profile, try picking up a few more <span className="font-semibold text-orange">{insight.actionText}</span> to boost your <span className="font-semibold text-orange">{insight.weakName}</span>.
                                </>
                              )}
                            </p>

                            <Button asChild variant={insight.type === 'gap' && insight.isCritical ? 'default' : 'secondary'} className="w-full rounded-xl text-xs font-medium h-9">
                              <Link href={insight.link}>
                                {insight.actionText} <ArrowRight className="ml-1.5 size-3" />
                              </Link>
                            </Button>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

{/* --- PROOF OF WORK & FEEDBACK TAB --- */}
        <TabsContent value="portfolio" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-foreground tracking-tight">Verified Outputs & Feedback</h2>
              <p className="text-muted-foreground text-sm">Review instructor feedback on your submitted projects and peer reviews.</p>
            </div>
            <Button variant="outline" className="rounded-full bg-transparent hover:bg-muted/50 border-border/50 font-medium">
              Share Public Portfolio <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>

          {!engineData.portfolio || engineData.portfolio.length === 0 ? (
            <div className="text-center p-12 border border-dashed border-border/50 rounded-3xl bg-muted/10">
              <Compass className="size-10 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground">No submissions yet</h3>
              <p className="text-sm text-muted-foreground">Complete activities to build your verifiable portfolio.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {engineData.portfolio.map((sub) => {
                // 1. Explicitly handle all states
                const isApproved = sub.status === "Approved";
                const needsRevision = sub.status === "Revision_Required";
                const isRejected = sub.status === "Rejected";
                
                // 2. Dynamic UI config
                const statusConfig = {
                  icon: isApproved ? CheckCircle2 : needsRevision ? AlertCircle : isRejected ? AlertCircle : Clock,
                  color: isApproved ? "text-green-600 bg-green-500/10 border-green-500/20" : 
                         needsRevision ? "text-orange bg-orange/10 border-orange/20" : 
                         isRejected ? "text-red-600 bg-red-500/10 border-red-500/20" : 
                         "text-blue-500 bg-blue-500/10 border-blue-500/20",
                  text: sub.status.replace(/_/g, " "),
                  actionText: isApproved ? "View Verified Output" : 
                              needsRevision ? "Read Feedback & Revise" : 
                              isRejected ? "View Details & Retry" : 
                              "View Status"
                };

                const feedbackSnippet = sub.reviews?.[0]?.feedback;

                return (
                  <div key={sub.id} className={`group flex flex-col p-6 rounded-[2rem] border backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 ${
                    isApproved ? 'bg-green-50/10 hover:bg-green-50/30 hover:border-green-500/30 border-green-500/10' : 
                    needsRevision ? 'bg-orange/5 hover:bg-orange/10 border-orange/20' : 
                    isRejected ? 'bg-red-500/5 hover:bg-red-500/10 border-red-500/20' : 
                    'bg-card/30 hover:bg-card/60 border-border/40'
                  }`}>
                    
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="secondary" className="bg-background border-border/50 text-[10px] uppercase font-bold text-muted-foreground">
                        {sub.activity.type.replace(/_/g, " ")}
                      </Badge>
                      <span className={`flex items-center gap-1 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${statusConfig.color}`}>
                        <statusConfig.icon className="size-3" /> {statusConfig.text}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-foreground mb-4 leading-snug group-hover:text-orange transition-colors line-clamp-2">
                      {sub.activity.title}
                    </h3>
                    
                    {/* 3. SHOW FEEDBACK PREVIEW IF IT EXISTS */}
                    {feedbackSnippet ? (
                      <div className="mb-6 flex-1">
                        <div className="p-3 rounded-xl bg-background/50 border border-border/50 text-xs text-muted-foreground italic relative">
                          <MessageSquare className="absolute top-3 left-3 size-3 text-muted-foreground/40" />
                          <p className="line-clamp-2 pl-6">"{feedbackSnippet}"</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground mb-6 flex-1">
                        Submitted on {new Date(sub.submittedAt || sub.createdAt).toLocaleDateString()}
                      </p>
                    )}
                    
                    <div className="space-y-4 pt-4 border-t border-border/30 mt-auto">
                      {/* Show Instructor Score if evaluated */}
                      {sub.reviews?.[0]?.score !== undefined && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Instructor Score</span>
                          <span className="font-bold text-foreground">{sub.reviews[0].score}/5</span>
                        </div>
                      )}
                      
                      {/* Dynamic CTA Link */}
                      <Link href={`/dashboard/activities/${sub.activityId}`} className={`inline-flex items-center text-xs font-bold uppercase tracking-wider transition-colors ${
                        isRejected ? "text-red-600 hover:text-red-700" : "text-foreground hover:text-orange"
                      }`}>
                        {statusConfig.actionText} <ExternalLink className="ml-1.5 size-3" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* --- JOURNEY TAB --- */}
        <TabsContent value="journey" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { title: "Enrolled Courses", value: enrolledCourses.length, icon: Library },
              { title: "Completed", value: completedCourses, icon: Award },
              { title: "Learning Time", value: "24h", icon: Clock },
              { title: "Avg Progress", value: `${Math.round(totalProgress)}%`, icon: Compass }
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-[2rem] bg-card/40 border border-border/50 shadow-sm flex flex-col gap-4 transition-colors backdrop-blur-sm">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <stat.icon className="h-5 w-5 text-muted-foreground/50" strokeWidth={1.5} />
                </div>
                <div className="text-3xl font-semibold text-foreground">{stat.value}</div>
              </div>
            ))}
          </div>

          {!hasNoCourses && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {enrolledCourses.map((course) => {
                const progress = userProgress.find((p) => p.courseId === course.id)
                const thumbnailUrl = constructUrl(course.fileKey)
                const isCompleted = progress?.progress === 100

                return (
                  <Link href={`/dashboard/${course.id}/chapter`} key={course.id} className="group flex flex-col h-full">
                    <Card className="rounded-[2rem] overflow-hidden border border-border/60 shadow-sm hover:shadow-xl hover:border-orange/40 transition-all duration-300 flex flex-col h-full bg-card/60 backdrop-blur-sm">
                      <div className="relative h-44 w-full overflow-hidden bg-muted">
                        <Image src={thumbnailUrl} alt={course.title} className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" />
                      </div>
                      <CardContent className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="h-6 w-6 border border-border/50">
                            <AvatarImage src={course.instructor.avatar || "/ai.png"} />
                            <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">{course.instructor.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-muted-foreground line-clamp-1">{course.instructor.name}</span>
                        </div>
                        <h3 className="font-semibold text-lg text-foreground mb-6 line-clamp-2 leading-snug group-hover:text-orange transition-colors">
                          {course.title}
                        </h3>
                        <div className="mt-auto pt-5 border-t border-border/40">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{isCompleted ? "Completed" : "Progress"}</span>
                            <span className="text-sm font-semibold text-foreground">{progress?.progress || 0}%</span>
                          </div>
                          <Progress value={progress?.progress || 0} className="h-1.5 bg-muted/50" indicatorClassName={isCompleted ? "bg-green-500" : "bg-orange"} />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* --- COMMUNITY TAB (The Network Signal) --- */}
        <TabsContent value="community" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">

          {/* Top Banner: Network Pulse */}
          <div className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-card/20 p-6 sm:p-8 backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="space-y-2 relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live Network</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">{"The Builder's Hive"}</h2>
              <p className="text-sm text-muted-foreground max-w-lg">
                Connect with peers, review trending projects, and join live squads to accelerate your skill acquisition.
              </p>
            </div>

            <div className="flex gap-4 relative z-10 shrink-0 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
              <div className="flex flex-col items-center justify-center px-6 py-4 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-md shadow-sm">
                <span className="text-2xl font-bold text-foreground">142</span>
                <span className="text-xs font-medium text-muted-foreground">Active Builders</span>
              </div>
              <div className="flex flex-col items-center justify-center px-6 py-4 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-md shadow-sm">
                <span className="text-2xl font-bold text-orange">2.4k</span>
                <span className="text-xs font-medium text-muted-foreground">Points Generated</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* LEFT COLUMN: Trending Artifacts (Span 8) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
                  <Flame className="size-5 text-orange" /> Trending Artifacts
                </h3>
                <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  View All <ArrowRight className="ml-1.5 size-4" />
                </Button>
              </div>

              <div className="grid gap-4">
                {/* Artifact Card 1 */}
                <div className="group p-5 rounded-[2rem] border border-border/40 bg-card/30 hover:bg-card/60 hover:border-border/80 transition-all duration-300 backdrop-blur-sm flex flex-col sm:flex-row gap-5">
                  <div className="relative h-32 w-full sm:w-48 shrink-0 overflow-hidden rounded-[1.2rem] bg-muted border border-border/50">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 mix-blend-overlay z-10" />
                    <Image src="/ai.png" alt="Project" className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" fill sizes="200px" />
                  </div>
                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="size-5">
                            <AvatarImage src="/ai.png" />
                            <AvatarFallback className="text-[9px]">JD</AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-muted-foreground">Sarah Jenkins • 2h ago</span>
                        </div>
                        <Badge variant="secondary" className="bg-background text-[10px] uppercase font-bold text-muted-foreground border-none">Capstone</Badge>
                      </div>
                      <h4 className="font-semibold text-foreground text-base leading-snug group-hover:text-orange transition-colors">Healthcare Predictive Model</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1.5">
                        Trained a random forest classifier to predict patient readmission rates with 89% accuracy using cleaned clinical data.
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-2">
                        <span className="text-[10px] font-medium uppercase tracking-wider bg-muted/50 text-muted-foreground px-2 py-1 rounded-md">Python</span>
                        <span className="text-[10px] font-medium uppercase tracking-wider bg-muted/50 text-muted-foreground px-2 py-1 rounded-md">Machine Learning</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-orange cursor-pointer transition-colors">
                          <Zap className="size-3.5" /> 24
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-blue-500 cursor-pointer transition-colors">
                          <MessageSquare className="size-3.5" /> 5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Artifact Card 2 */}
                <div className="group p-5 rounded-[2rem] border border-border/40 bg-card/30 hover:bg-card/60 hover:border-border/80 transition-all duration-300 backdrop-blur-sm flex flex-col sm:flex-row gap-5">
                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="size-5">
                            <AvatarImage src="/ai.png" />
                            <AvatarFallback className="text-[9px]">MK</AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-muted-foreground">Marcus K. • 5h ago</span>
                        </div>
                        <Badge variant="secondary" className="bg-background text-[10px] uppercase font-bold text-muted-foreground border-none">Peer Review</Badge>
                      </div>
                      <h4 className="font-semibold text-foreground text-base leading-snug group-hover:text-orange transition-colors">Architecture Audit: E-Commerce API</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1.5">
                        Complete breakdown of the provided Node.js architecture, highlighting structural bottlenecks and proposing a microservices refactor.
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-2">
                        <span className="text-[10px] font-medium uppercase tracking-wider bg-muted/50 text-muted-foreground px-2 py-1 rounded-md">System Design</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-orange cursor-pointer transition-colors">
                          <Zap className="size-3.5" /> 18
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-blue-500 cursor-pointer transition-colors">
                          <MessageSquare className="size-3.5" /> 2
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Squads & Ops (Span 4) */}
            <div className="lg:col-span-4 space-y-8">

              {/* Active Squads (Chats/Guilds) */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground tracking-tight flex items-center gap-2">
                  <Users className="size-4 text-muted-foreground" /> Active Squads
                </h3>
                <div className="bg-card/30 border border-border/50 rounded-[2rem] p-2 backdrop-blur-sm shadow-sm">
                  {[
                    { name: "Data Engineering Guild", members: 42, active: true, unread: 3 },
                    { name: "Frontend Masters", members: 28, active: true, unread: 0 },
                    { name: "Cohort 4 Study Group", members: 12, active: false, unread: 0 },
                  ].map((squad, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 rounded-2xl hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="size-10 rounded-xl bg-gradient-to-br from-border to-muted flex items-center justify-center border border-border/50">
                            <span className="text-sm font-bold text-foreground">{squad.name.charAt(0)}</span>
                          </div>
                          {squad.active && <div className="absolute -bottom-1 -right-1 size-3.5 bg-green-500 border-2 border-background rounded-full" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground group-hover:text-orange transition-colors">{squad.name}</p>
                          <p className="text-xs text-muted-foreground">{squad.members} members</p>
                        </div>
                      </div>
                      {squad.unread > 0 && (
                        <span className="size-5 rounded-full bg-orange flex items-center justify-center text-[10px] font-bold text-white">
                          {squad.unread}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Events / Hackathons */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground tracking-tight flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" /> Upcoming Ops
                </h3>
                <div className="grid gap-3">
                  <div className="group p-4 rounded-[1.5rem] border border-border/50 bg-card/40 hover:bg-card/80 transition-all backdrop-blur-sm shadow-sm cursor-pointer hover:border-orange/30">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center justify-center w-12 h-14 rounded-xl bg-orange/10 text-orange shrink-0 border border-orange/20">
                        <span className="text-xs font-bold uppercase">Mar</span>
                        <span className="text-lg font-black leading-none">28</span>
                      </div>
                      <div>
                        <Badge variant="outline" className="text-[9px] uppercase font-bold border-none bg-muted/50 text-muted-foreground mb-1 px-1.5 py-0">Hackathon</Badge>
                        <h4 className="text-sm font-semibold text-foreground leading-snug group-hover:text-orange transition-colors">72h BI Dashboard Sprint</h4>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Users className="size-3" /> 40 spots left
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group p-4 rounded-[1.5rem] border border-border/50 bg-card/40 hover:bg-card/80 transition-all backdrop-blur-sm shadow-sm cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center justify-center w-12 h-14 rounded-xl bg-muted/50 text-muted-foreground shrink-0 border border-border/50">
                        <span className="text-xs font-bold uppercase">Apr</span>
                        <span className="text-lg font-black leading-none">02</span>
                      </div>
                      <div>
                        <Badge variant="outline" className="text-[9px] uppercase font-bold border-none bg-muted/50 text-muted-foreground mb-1 px-1.5 py-0">Webinar</Badge>
                        <h4 className="text-sm font-semibold text-foreground leading-snug group-hover:text-blue-500 transition-colors">Advanced SQL Optimization</h4>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Video className="size-3" /> Online Event
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}