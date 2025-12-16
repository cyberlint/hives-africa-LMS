"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Play, Clock, Star, Filter, X, BookOpen } from "lucide-react"
import { toast } from "sonner"
import type { Course, CourseProgress } from "@/types"
import { useDashboard } from "../studentContext"
import Image from "next/image"
import Link from "next/link"
import { constructUrl } from "@/lib/construct-url"
interface MyLearningProps {
  courses?: Course[]
  userProgress?: CourseProgress[]
  onCourseSelect?: (course: Course) => void
}


export default function MyLearning() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [showFilters, setShowFilters] = useState(false)
  const [showAllCourses, setShowAllCourses] = useState(false)

   const {enrolledCourses, user, loading, error}=useDashboard()

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fdb606] mx-auto mb-4"></div>
          {/* <p className="text-gray-600">Loading your courses...</p> */}
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
          <p className="text-gray-600 mb-6">We couldn't load your courses. Please try again.</p>
          <Button onClick={() => window.location.reload()} className="bg-[#fdb606] hover:bg-[#f39c12]">
            Try Again
          </Button>
        </div>
      </div>
    )
  }
  // const handleCourseClick = (course: Course) => {
  //   try {
  //     onCourseSelect(course)
  //     toast({
  //       title: "Course Selected",
  //       description: `Opening ${course.title}...`,
  //     })
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to open course. Please try again.",
  //       variant: "destructive",
  //     })
  //   }
  // }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    toast(
       "Search Updated",{
         description: value ? `Searching for "${value}"` : "Search cleared",
       }  
    )
    
  }

  const handleFilterChange = (value: string) => {
    setFilterStatus(value)
    const filterLabels = {
      all: "All Courses",
      "in-progress": "In Progress",
      completed: "Completed",
      "not-started": "Not Started",
    }
    toast(
       "Filter Applied", {  description: `Showing ${filterLabels[value as keyof typeof filterLabels]}`,}
    
    )
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    const sortLabels = {
      recent: "Recently Accessed",
      alphabetical: "Alphabetical",
      progress: "Progress",
    }
    toast("Sort Applied",{  description: `Sorted by ${sortLabels[value as keyof typeof sortLabels]}`,}
    
    )
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
    toast(
      showFilters ? "Filters Hidden" : "Filters Shown",
      { description: showFilters ? "Filter options are now hidden" : "Use filters to refine your search",}
     
    )
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setFilterStatus("all")
    setSortBy("recent")
    setShowFilters(false)
    toast(
      "Filters Cleared",{  description: "All filters have been reset",}
    
    )
  }

  const toggleShowAllCourses = () => {
    setShowAllCourses(!showAllCourses)
    toast( 
      showAllCourses ? "Showing Limited Courses" : "Showing All Courses", {   description: showAllCourses ? "Displaying first 6 courses" : "Displaying all available courses",}
    
    )
  }

  const filteredCourses = enrolledCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase())
    const progress = user.progress.find((p) => p.courseId === course.id)

    if (filterStatus === "completed") return matchesSearch && progress?.progress === 100
    if (filterStatus === "in-progress")
      return matchesSearch && progress && progress.progress > 0 && progress.progress < 100
    if (filterStatus === "not-started") return matchesSearch && (!progress || progress.progress === 0)

    return matchesSearch
  })

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === "recent") {
      const aProgress = user.progress.find((p) => p.courseId === a.id)
      const bProgress = user.progress.find((p) => p.courseId === b.id)
      return new Date(bProgress?.lastAccessed || 0).getTime() - new Date(aProgress?.lastAccessed || 0).getTime()
    }
    if (sortBy === "alphabetical") return a.title.localeCompare(b.title)
    if (sortBy === "progress") {
      const aProgress = user.progress.find((p) => p.courseId === a.id)?.progress || 0
      const bProgress = user.progress.find((p) => p.courseId === b.id)?.progress || 0
      return bProgress - aProgress
    }
    return 0
  })

  // Limit courses display unless "show all" is active
  const displayedCourses = showAllCourses ? sortedCourses : sortedCourses.slice(0, 6)

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">My Learning</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="sm:hidden" onClick={toggleFilters}>
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            {(searchQuery || filterStatus !== "all" || sortBy !== "recent") && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Desktop Filters */}
        <div className="hidden sm:flex flex-col sm:flex-row gap-4 w-full">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search courses and instructors..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="not-started">Not Started</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Accessed</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="sm:hidden space-y-4 p-4 bg-gray-50 rounded-lg border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses and instructors..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select value={filterStatus} onValueChange={handleFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Accessed</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>
            Showing {displayedCourses.length} of {sortedCourses.length} courses
            {searchQuery && ` for "${searchQuery}"`}
          </span>
          {sortedCourses.length > 6 && (
            <Button
              variant="link"
              size="sm"
              onClick={toggleShowAllCourses}
              className="text-[#fdb606] hover:text-[#f39c12]"
            >
              {showAllCourses ? "Show Less" : `View All ${sortedCourses.length}`}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {displayedCourses.map((course) => {
          const progress = user.progress.find((p) => p.courseId === course.id)
          const progressValue = progress?.progress || 0
          const lastAccessed = progress?.lastAccessed
          const thumbnailUrl = constructUrl(course.fileKey)

          return (
            <Card
              key={course.id}
              className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]"
              // onClick={() => handleCourseClick(course)}
              
            >
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src={thumbnailUrl}
                    alt={course.title}
                    width={300}
                    height={200}
                    className="w-full h-32 sm:h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">
                    {progressValue === 100 && <Badge className="bg-green-500 text-xs">Completed</Badge>}
                    {progressValue > 0 && progressValue < 100 && (
                      <Badge className="bg-[#fdb606] text-xs">In Progress</Badge>
                    )}
                    {progressValue === 0 && (
                      <Badge variant="secondary" className="text-xs">
                        Not Started
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="p-3 sm:p-4 space-y-3">
                  <h3 className="font-semibold text-sm sm:text-lg line-clamp-2">{course.title}</h3>

                  <div className="flex items-center space-x-2">
                    <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                      <AvatarImage src={course.instructor.avatar || "/ai.png"} />
                      <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs sm:text-sm text-gray-600">{course.instructor.name}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>
                        {Math.floor(course.duration / 60)}h {course.duration % 60}m
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span>Progress</span>
                      <span>{progressValue}%</span>
                    </div>
                    <Progress value={progressValue} className="h-2" />
                  </div>

                  {lastAccessed && (
                    <p className="text-xs text-gray-500">
                      Last accessed: {new Date(lastAccessed).toLocaleDateString()}
                    </p>
                  )}

                  <Button
                    className="w-full bg-[#fdb606] hover:bg-[#f39c12] text-sm transition-colors"
                    // onClick={(e) => {
                    //   e.stopPropagation()
                    //   handleCourseClick(course)
                    // }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {progressValue === 0 ? "Start Learning" : progressValue === 100 ? "Review" : "Continue"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {displayedCourses.length === 0 && (
        <div className="text-center py-12 sm:py-16">
          <div className="max-w-lg mx-auto">
            {enrolledCourses.length === 0 ? (
              // No enrolled courses at all
              <>
                <div className="mb-6">
                  <svg
                    className="mx-auto h-32 w-32 text-gray-300"
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
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Start Your Learning Journey</h3>
                <p className="text-gray-600 mb-6 text-base">
                  You haven&apos;t enrolled in any courses yet. Explore our course catalog and find something that sparks your interest!
                </p>
                <Button 
                  asChild 
                  className="bg-[#fdb606] hover:bg-[#f39c12]"
                  size="lg"
                >
                  <Link href="/courses">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Browse All Courses
                  </Link>
                </Button>
              </>
            ) : (
              // Filtered results are empty
              <>
                <div className="mb-6">
                  <svg
                    className="mx-auto h-24 w-24 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600 mb-6">
                  No courses match your current filters. Try adjusting your search criteria.
                </p>
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Show All/Show Less Button at Bottom */}
      {sortedCourses.length > 6 && (
        <div className="text-center pt-4">
          <Button variant="outline" onClick={toggleShowAllCourses} className="min-w-[120px]">
            {showAllCourses ? "Show Less" : `View All ${sortedCourses.length} Courses`}
          </Button>
        </div>
      )}
    </div>
  )
}
