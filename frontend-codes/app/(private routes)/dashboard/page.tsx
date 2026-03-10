"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Award, Loader, AlertCircle, Compass, Library } from "lucide-react"
import { useDashboard } from "@/app/(private routes)/dashboard/studentContext"
import Link from "next/link"
import Image from "next/image"
import { constructUrl } from "@/lib/construct-url"
import { authClient } from "@/lib/auth-client"

function DashboardOverview() {
  const { data: session } = authClient.useSession()
  const { enrolledCourses, loading, error, user: dashboardUser } = useDashboard()

  const sessionUser = session?.user || {
    name: "Guest",
    email: "guest@example.com",
    image: "/ai.png",
  }

  const user = {
    name: sessionUser.name || dashboardUser.name,
  }

  const userProgress = dashboardUser.progress

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-6">
          <Loader className="h-6 w-6 animate-spin text-orange" strokeWidth={2} />
          <p className="text-muted-foreground text-sm tracking-wide">Preparing your workspace...</p>
        </div>
      </div>
    )
  }

  // Error State
  if (error && !error.includes('Unauthorized')) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-md p-8 bg-card border border-border rounded-3xl">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-6" strokeWidth={1.5} />
          <h2 className="text-xl font-medium text-foreground mb-2">We encountered a brief interruption.</h2>
          <p className="text-muted-foreground mb-8 text-sm">Please refresh the page to restore your workspace.</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="rounded-full px-8 hover:bg-muted">
            Refresh
          </Button>
        </div>
      </div>
    )
  }

  const totalProgress = userProgress.length > 0 
    ? userProgress.reduce((acc: number, p) => acc + p.progress, 0) / userProgress.length 
    : 0
  const completedCourses = userProgress.filter((p) => p.progress === 100).length
  const inProgressCourses = userProgress.filter((p) => p.progress > 0 && p.progress < 100).length
  const hasNoCourses = enrolledCourses.length === 0

  return (
    <div className="space-y-10 sm:space-y-12 pb-16 max-w-6xl mx-auto">
      
      {/* 1. Welcome Header (Removed redundant avatar block) */}
      <div className="pb-6 border-b border-border/40">
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
            Welcome back, {user.name.split(' ')[0]}.
          </h1>
          <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
            {hasNoCourses 
            ? "Even the tallest tree begins as a small seed. Explore the curriculum and start growing your skills today."
            : "By trying often, the monkey learns to jump from the tree. Keep pushing forward to reach new heights in your learning journey."}
          </p>
        </div>
      </div>

      {/* 2. Stat Overview (Theme compliant) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { title: "Enrolled Courses", value: enrolledCourses.length, icon: Library },
          { title: "Completed", value: completedCourses, icon: Award },
          { title: "Learning Time", value: "24h", icon: Clock },
          { title: "Avg Progress", value: `${Math.round(totalProgress)}%`, icon: Compass }
        ].map((stat, i) => (
          <div key={i} className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-4 transition-colors">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <stat.icon className="h-4 w-4 text-muted-foreground/50" strokeWidth={1.5} />
            </div>
            <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* 3. Main Content Area */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-foreground">
            {hasNoCourses ? "Explore the Curriculum" : "Current Focus"}
          </h2>
          {!hasNoCourses && (
            <Link href={"/dashboard/learning"} className="text-sm font-medium text-orange hover:text-orange/80 transition-colors">
              View all
            </Link>
          )}
        </div>

        {hasNoCourses ? (
          /* Empty State */
          <div className="rounded-3xl border border-border bg-card/50 px-6 py-20 text-center flex flex-col items-center shadow-sm">
            <Library className="h-12 w-12 text-muted-foreground/30 mb-6" strokeWidth={1} />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Your curriculum awaits
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md text-sm leading-relaxed">
              Browse our selection of carefully crafted projects and courses to begin building your foundation.
            </p>
            
            {/* Restored Primary Orange Button */}
            <Button asChild className="bg-orange hover:bg-orange/90 text-white rounded-full px-8 py-6 shadow-sm shadow-orange/20 font-medium transition-all hover:scale-[1.02]">
              <Link href={"/dashboard/courses"}>
                <Compass className="h-5 w-5 mr-2" strokeWidth={2} />
                Browse Catalog
              </Link>
            </Button>
            
            {/* Restored Clickable, Interactive Tags */}
            <div className="mt-12 flex flex-wrap gap-2 justify-center max-w-lg">
              {["Data Analysis", "Machine Learning", "UI/UX Design", "Business Intelligence", "Python"].map(tag => (
                <Link key={tag} href={`/dashboard/courses?category=${encodeURIComponent(tag)}`}>
                  <Badge variant="outline" className="px-4 py-2 rounded-full font-normal text-muted-foreground border-border hover:border-orange hover:text-orange hover:bg-orange/10 transition-colors cursor-pointer">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          /* Course Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {enrolledCourses.slice(0, 4).map((course) => {
              const progress = userProgress.find((p) => p.courseId === course.id)
              const thumbnailUrl = constructUrl(course.fileKey)
              const isCompleted = progress?.progress === 100

              return (
                <Link href={`/dashboard/${course.id}/chapter`} key={course.id} className="group flex flex-col h-full">
                  <Card className="rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md hover:border-orange/30 transition-all duration-300 flex flex-col h-full bg-card">
                    <div className="relative h-44 w-full overflow-hidden bg-muted">
                      <Image
                        src={thumbnailUrl}
                        alt={course.title}
                        className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                    
                    <CardContent className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        <Avatar className="h-5 w-5 border border-border">
                          <AvatarImage src={course.instructor.avatar || "/ai.png"} />
                          <AvatarFallback className="text-[9px] bg-muted text-muted-foreground">{course.instructor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground line-clamp-1">{course.instructor.name}</span>
                      </div>
                      
                      <h3 className="font-medium text-base text-foreground mb-6 line-clamp-2 leading-snug group-hover:text-orange transition-colors">
                        {course.title}
                      </h3>
                      
                      <div className="mt-auto pt-4 border-t border-border/50">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs text-muted-foreground">
                            {isCompleted ? "Completed" : "Progress"}
                          </span>
                          <span className="text-xs font-medium text-foreground">
                            {progress?.progress || 0}%
                          </span>
                        </div>
                        <Progress 
                          value={progress?.progress || 0} 
                          className="h-1.5 bg-muted" 
                          indicatorClassName={isCompleted ? "bg-green-500" : "bg-orange"}
                        />
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
  )
}

export default DashboardOverview;