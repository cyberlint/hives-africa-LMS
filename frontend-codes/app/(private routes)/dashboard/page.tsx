"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Clock, Award, TrendingUp, Play, Loader } from "lucide-react"
import type { Course, User } from "@/types"

import { toast } from "sonner"
import { useDashboard } from "./studentContext"
import { useAuth, withAuth } from "@/contexts/AuthContext"
import { UserTypeIndicator } from "@/components/shared/user-type-indicator"
import Link from "next/link"
import Image from "next/image"
import { constructUrl } from "@/lib/construct-url"
import { authClient } from "@/lib/auth-client"


function DashboardOverview() {
  const { data: session } = authClient.useSession() // Use Better Auth
  const { enrolledCourses, loading, error, user: dashboardUser } = useDashboard()
  // Use session data or fallback
  const sessionUser = session?.user || {
    name: "Guest User",
    email: "guest@example.com",
    image: "/ai.png",
  }

  // Combine session user with dashboard user info
  const user = {
    name: sessionUser.name || dashboardUser.name,
    email: sessionUser.email || dashboardUser.email,
    image: sessionUser.image || dashboardUser.avatar || "/ai.png",
  }

  // Get progress from dashboard context (already populated from Enrollment model)
  const userProgress = dashboardUser.progress

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader className="h-8 w-8 animate-spin text-yellow" />
        </div>
      </div>
    )
  }

  // Show error state only for actual errors (not empty state)
  if (error && !error.includes('Unauthorized')) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Something went wrong</h2>
          <p className="text-gray-600 mb-6">We couldn't load your dashboard. Please try again.</p>
          <Button onClick={() => window.location.reload()} className="bg-[#fdb606] hover:bg-[#f39c12]">
            Try Again
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

  // Check if user has no enrolled courses - show empty state
  const hasNoCourses = enrolledCourses.length === 0


//   const handleCourseClick = (course: Course) => {
//     onCourseSelect(course)
//   }

//   const handleViewAllCourses = () => {
//     if (onTabChange) {
//       onTabChange("view-all")
//     }
//     toast({
//       title: "Navigation",
//       description: "Opening View All page...",
//     })
//   }

//   const handleViewAchievements = () => {
//     if (onTabChange) {
//       onTabChange("achievements")
//     }
//     toast({
//       title: "Navigation",
//       description: "Opening Achievements page...",
//     })
//   }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#fdb606] to-[#f39c12] rounded-lg p-4 sm:p-6 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-base sm:text-lg opacity-90">Continue your learning journey</p>
      </div>

      {/* User Type Indicator for non-student users */}
      {/* {authUser && <UserTypeIndicator user={authUser} showMessage={true} />} */}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{enrolledCourses.length}</div>
            <p className="text-xs text-muted-foreground">{inProgressCourses} in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Completed</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{completedCourses}</div>
            <p className="text-xs text-muted-foreground">Courses finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Learning Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">24h</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Avg Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{Math.round(totalProgress)}%</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning or Empty State */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg sm:text-xl">
            {hasNoCourses ? "Start Your Learning Journey" : "Continue Learning"}
          </CardTitle>
         
          {!hasNoCourses && (
            <Button variant="outline" size="sm"  className="hidden sm:flex"  asChild>
              <Link href={"/learning"}>
                View All
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {hasNoCourses ? (
            // Empty State - No Enrolled Courses
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="mb-6">
                <svg
                  className="mx-auto h-32 w-32 text-gray-300 dark:text-[#2a3547]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No courses yet
              </h3>
              <p className="text-gray-600 dark:text-gray-500 mb-6 max-w-md text-sm sm:text-base">
                You haven&apos;t enrolled in any courses yet. Start your learning journey by exploring our course catalog and find something that interests you!
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  asChild 
                  className="bg-[#fdb606] hover:bg-[#f39c12] text-white"
                  size="lg"
                >
                  <Link href={"/courses"}>
                    <BookOpen className="h-5 w-5 mr-2" />
                    Browse Courses
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline"
                  className="text-gray-900 dark:text-white border-gray-300 dark:border-[#2a3547] hover:bg-gray-100 dark:hover:bg-[#0a0f19]"
                  size="lg"
                >
                  <Link href={"/learning"}>
                    View All Courses
                  </Link>
                </Button>
              </div>
              
              {/* Quick Stats for Empty State */}
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-[#2a3547] w-full max-w-2xl">
                <p className="text-sm text-gray-500 dark:text-gray-600 mb-4">Popular categories to get started:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary" className="cursor-pointer hover:bg-[#fdb606] hover:text-white transition-colors">
                    Web Development
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-[#fdb606] hover:text-white transition-colors">
                    Data Science
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-[#fdb606] hover:text-white transition-colors">
                    Design
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-[#fdb606] hover:text-white transition-colors">
                    Business
                  </Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-[#fdb606] hover:text-white transition-colors">
                    Marketing
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            // Show Enrolled Courses
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enrolledCourses.slice(0, 3).map((course) => {
                  const progress = userProgress.find((p) => p.courseId === course.id)
                  const thumbnailUrl = constructUrl(course.fileKey)
                  return (
                    <div
                      key={course.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <Image
                        src={thumbnailUrl}
                        alt={course.title}
                        className="w-full h-24 sm:h-32 object-cover rounded mb-3"
                        width={100}
                        height={100}
                      />
                      <h3 className="font-semibold mb-2 line-clamp-2 text-sm sm:text-base">{course.title}</h3>
                      <div className="flex items-center space-x-2 mb-3">
                        <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                          <AvatarImage src={course.instructor.avatar || "/ai.png"} />
                          <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs sm:text-sm text-gray-600">{course.instructor.name}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span>Progress</span>
                          <span>{progress?.progress || 0}%</span>
                        </div>
                        <Progress value={progress?.progress || 0} className="h-2" />
                      </div>
                      <Button
                        className="w-full mt-3 bg-[#fdb606] hover:bg-[#f39c12] text-sm"
                        asChild
                      >
                        <Link href={`/${course.id}/chapter`}>
                          <Play className="h-4 w-4 mr-2" />
                          Continue
                        </Link>
                      </Button>
                    </div>
                  )
                })}
              </div>

              {/* Mobile View All Button */}
              <div className="sm:hidden mt-4">
                <Button variant="outline" className="w-full"  asChild>
                  <Link href={"/learning"}>
                    View All Courses
                  </Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Recent Achievements - Only show if user has courses */}
      {!hasNoCourses && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg sm:text-xl">Recent Achievements</CardTitle>
            <Button variant="outline" size="sm"  className="hidden sm:flex" asChild>
              <Link href={"/achievements"}>
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {completedCourses > 0 ? (
              <div className="space-y-4">
                <Link href={"/achievements"}>
                  <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="bg-[#fdb606] p-2 rounded-full">
                      <Award className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm sm:text-base">First Course Completed</h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Completed your first course - Keep up the great work!
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      New
                    </Badge>
                  </div>
                </Link>
                {inProgressCourses > 0 && (
                  <Link href={"/achievements"}>
                    <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="bg-green-500 p-2 rounded-full">
                        <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm sm:text-base">Learning in Progress</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          You have {inProgressCourses} course{inProgressCourses > 1 ? 's' : ''} in progress
                        </p>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            ) : (
              // Empty achievements state
              <div className="text-center py-8">
                <div className="mb-4">
                  <Award className="h-12 w-12 text-gray-300 mx-auto" />
                </div>
                <p className="text-gray-600 text-sm">
                  Complete courses to unlock achievements!
                </p>
              </div>
            )}

            {/* Mobile View All Button */}
            {completedCourses > 0 && (
              <div className="sm:hidden mt-4">
                <Button variant="outline" className="w-full"  asChild>
                  <Link href={"/achievements"}>
                    View All Achievements
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
export default DashboardOverview;

// export default withAuth(DashboardOverview);
