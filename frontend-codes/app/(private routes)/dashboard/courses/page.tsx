"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RichTextRenderer } from "@/components/lms/RichTextRenderer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search, Filter, Grid3X3, List, BookOpen, Users,
  Clock, Star, Heart, ShoppingCart, Play, Award,
  TrendingUp, Eye, Share2, AlertCircle, Loader
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { useDashboard } from "@/app/(private routes)/dashboard/studentContext"
import { constructUrl } from "@/lib/construct-url"

interface Course {
  id: string
  title: string
  instructor: string
  category: string
  level: string
  rating: number
  students: number
  duration: string
  price: number
  originalPrice?: number
  thumbnail: string
  description: string
  progress?: number
  status: "enrolled" | "completed" | "wishlist" | "not-started"
  tags: string[]
}

export default function ViewAll() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState("title")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const { courses: allCourses, enrolledCourses, user, loading, error } = useDashboard()

  const mockCourses: Course[] = useMemo(() => {
    return allCourses.map((course) => {
      const userProgress = user.progress.find((p) => p.courseId === course.id)
      const isEnrolled = user.enrolledCourses.includes(course.id)
      const thumbnailUrl = constructUrl(course.fileKey)
      
      return {
        id: course.id,
        title: course.title,
        instructor: course.instructor.name,
        category: course.category,
        level: course.level as "Beginner" | "Intermediate" | "Advanced",
        rating: course.rating,
        students: 0, 
        duration: `${Math.floor(course.duration / 60)}h ${course.duration % 60}m`,
        price: course.price,
        thumbnail: thumbnailUrl,
        description: course.description,
        progress: userProgress?.progress,
        status: userProgress?.progress === 100 
          ? "completed" 
          : isEnrolled 
          ? "enrolled" 
          : "not-started",
        tags: [], 
      }
    })
  }, [allCourses, user.progress, user.enrolledCourses])

  const filteredAndSortedCourses = useMemo(() => {
    let filtered = mockCourses

    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter((course) => course.category === selectedCategory)
    }
    if (selectedLevel !== "all") {
      filtered = filtered.filter((course) => course.level === selectedLevel)
    }
    if (selectedStatus !== "all") {
      filtered = filtered.filter((course) => course.status === selectedStatus)
    }

    if (activeTab !== "all") {
      switch (activeTab) {
        case "enrolled":
          filtered = filtered.filter((course) => course.status === "enrolled")
          break
        case "wishlist":
          filtered = filtered.filter((course) => course.status === "wishlist")
          break
        case "completed":
          filtered = filtered.filter((course) => course.status === "completed")
          break
      }
    }

    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Course]
      let bValue: any = b[sortBy as keyof Course]

      if (sortBy === "rating" || sortBy === "price" || sortBy === "students") {
        aValue = Number(aValue)
        bValue = Number(bValue)
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [searchQuery, selectedCategory, selectedLevel, selectedStatus, sortBy, sortDirection, activeTab, mockCourses])

  const stats = useMemo(() => {
    return {
      total: mockCourses.length,
      enrolled: mockCourses.filter((c) => c.status === "enrolled").length,
      completed: mockCourses.filter((c) => c.status === "completed").length,
      wishlist: mockCourses.filter((c) => c.status === "wishlist").length,
    }
  }, [mockCourses])

  // Serene Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-6">
          <Loader className="h-6 w-6 animate-spin text-orange" strokeWidth={2} />
          <p className="text-muted-foreground text-sm tracking-wide">Loading curriculum...</p>
        </div>
      </div>
    )
  }

  // Calm Error State
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-md p-8 bg-card border border-border rounded-3xl shadow-sm">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-6" strokeWidth={1.5} />
          <h2 className="text-xl font-medium text-foreground mb-2">Unable to load courses</h2>
          <p className="text-muted-foreground mb-8 text-sm">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="rounded-full px-8 hover:bg-muted">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const handleCourseAction = (action: string, courseId: string) => {
    switch (action) {
      case "continue":
        router.push(`/dashboard/${courseId}/chapter/1`)
        break
      case "enroll":
      case "cart":
        router.push(`/course/${courseId}`)
        break
      case "review":
        router.push(`/dashboard/${courseId}/chapter/1#reviews`)
        break
      case "wishlist":
        console.log("wishlist", courseId)
        break
      case "share":
        console.log("share", courseId)
        break
      default:
        console.log(`${action} course:`, courseId)
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedLevel("all")
    setSelectedStatus("all")
    setSortBy("title")
    setSortDirection("asc")
  }

  const CourseCard = ({ course }: { course: Course }) => (
    <Card className="group flex flex-col h-full border-border bg-card transition-all duration-300 hover:border-orange/30 hover:shadow-md rounded-2xl overflow-hidden">
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <Image
          src={course.thumbnail || "/ai.png"}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-foreground border-none font-medium">
            {course.level}
          </Badge>
        </div>
        {course.progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-background/50 backdrop-blur-sm">
            <Progress value={course.progress} className="h-full rounded-none bg-transparent" indicatorClassName={course.progress === 100 ? "bg-green-500" : "bg-orange"} />
          </div>
        )}
      </div>
      
      <CardContent className="p-5 flex flex-col flex-1">
        <div className="space-y-3 flex-1">
          <div>
            <h3 className="line-clamp-2 font-semibold text-lg text-foreground transition-colors group-hover:text-orange leading-snug">
              {course.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{course.instructor}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-orange text-orange" />
              <span>{course.rating}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>{course.students.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{course.duration}</span>
            </div>
          </div>

          <div className="line-clamp-2 text-sm text-muted-foreground/80 pt-1">
            <RichTextRenderer contentJsonString={course.description} className="prose dark:prose-invert" />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-end gap-2">
              <span className="text-xl font-bold text-foreground">${course.price}</span>
              {course.originalPrice && (
                <span className="text-sm text-muted-foreground line-through pb-0.5">${course.originalPrice}</span>
              )}
            </div>
            <Badge
              className={cn(
                "border-none",
                course.status === "completed" ? "bg-green-500/10 text-green-600 dark:text-green-400" : 
                course.status === "enrolled" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : 
                "bg-muted text-muted-foreground"
              )}
            >
              {course.status === "not-started" ? "Available" : course.status.charAt(0).toUpperCase() + course.status.slice(1)}
            </Badge>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex-1">
              {course.status === "enrolled" ? (
                <Button className="w-full rounded-full bg-orange hover:bg-orange/90 text-white" onClick={() => handleCourseAction("continue", course.id)}>
                  <Play className="h-4 w-4 mr-2" fill="currentColor" /> Continue
                </Button>
              ) : course.status === "completed" ? (
                <Button className="w-full rounded-full" variant="outline" onClick={() => handleCourseAction("review", course.id)}>
                  <Award className="h-4 w-4 mr-2" /> Review
                </Button>
              ) : (
                <Button className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90" onClick={() => handleCourseAction("enroll", course.id)}>
                  <BookOpen className="h-4 w-4 mr-2" /> Enroll
                </Button>
              )}
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => handleCourseAction("wishlist", course.id)} className="rounded-full text-muted-foreground hover:text-orange hover:bg-orange/10">
                <Heart className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => handleCourseAction("cart", course.id)} className="rounded-full text-muted-foreground hover:text-foreground">
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const CourseListItem = ({ course }: { course: Course }) => (
    <Card className="transition-all duration-300 hover:shadow-md border-border bg-card rounded-2xl overflow-hidden hover:border-orange/30">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          <div className="relative h-40 sm:h-28 w-full sm:w-48 shrink-0 rounded-xl overflow-hidden bg-muted">
            <Image
              src={course.thumbnail || "/ai.png"}
              alt={course.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 200px"
            />
          </div>
          
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="truncate font-semibold text-lg text-foreground group-hover:text-orange transition-colors">{course.title}</h3>
                <p className="text-sm text-muted-foreground">{course.instructor}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground font-medium">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-orange text-orange" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{course.duration}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-muted">
                    {course.level}
                  </Badge>
                </div>
                {course.progress !== undefined && (
                  <div className="mt-4 max-w-xs">
                    <div className="flex justify-between text-xs mb-1.5 text-muted-foreground font-medium">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-1.5 bg-muted" indicatorClassName={course.progress === 100 ? "bg-green-500" : "bg-orange"} />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:items-end justify-between min-w-35 gap-4 lg:gap-0 lg:h-22">
                <div className="flex items-end gap-2 sm:justify-end">
                  <div className="text-xl font-bold text-foreground">${course.price}</div>
                  {course.originalPrice && (
                    <div className="text-sm text-muted-foreground line-through pb-0.5">${course.originalPrice}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" onClick={() => handleCourseAction("wishlist", course.id)} className="rounded-full text-muted-foreground hover:text-orange hover:bg-orange/10 h-9 w-9">
                    <Heart className="h-4 w-4" />
                  </Button>
                  {course.status === "enrolled" ? (
                    <Button size="sm" className="rounded-full bg-orange hover:bg-orange/90 text-white" onClick={() => handleCourseAction("continue", course.id)}>
                      Continue
                    </Button>
                  ) : course.status === "completed" ? (
                    <Button size="sm" variant="outline" className="rounded-full" onClick={() => handleCourseAction("review", course.id)}>
                      Review
                    </Button>
                  ) : (
                    <Button size="sm" className="rounded-full bg-foreground text-background hover:bg-foreground/90" onClick={() => handleCourseAction("enroll", course.id)}>
                      Enroll
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8 max-w-360 mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-border/40">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Curriculum Explorer</h1>
          <p className="text-muted-foreground">Comprehensive overview of all available paths and projects.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full px-4 border-border hover:bg-muted" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" strokeWidth={1.5} />
            Filters
          </Button>
          <div className="hidden sm:flex bg-muted rounded-full p-1 border border-border/50">
            <Button variant="ghost" size="sm" className={cn("rounded-full px-3 h-8", viewMode === "grid" && "bg-background shadow-sm")} onClick={() => setViewMode("grid")}>
              <Grid3X3 className="h-4 w-4" strokeWidth={1.5} />
            </Button>
            <Button variant="ghost" size="sm" className={cn("rounded-full px-3 h-8", viewMode === "list" && "bg-background shadow-sm")} onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Courses", value: stats.total, icon: BookOpen, color: "text-orange" },
          { title: "Enrolled", value: stats.enrolled, icon: TrendingUp, color: "text-blue-500" },
          { title: "Completed", value: stats.completed, icon: Award, color: "text-green-500" },
          { title: "Wishlist", value: stats.wishlist, icon: Heart, color: "text-red-500" }
        ].map((stat, i) => (
          <div key={i} className="p-5 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-full bg-muted flex items-center justify-center ${stat.color}`}>
              <stat.icon className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters (Animated reveal) */}
      <div className={cn("grid gap-4 transition-all duration-300 ease-in-out origin-top", showFilters ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 overflow-hidden")}>
        <div className="min-h-0">
          <div className="p-5 rounded-2xl bg-card border border-border shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search topics or projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border focus:border-orange focus:ring-orange/20 rounded-xl"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-background border-border rounded-xl">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Web Development">Web Development</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Backend Development">Backend Development</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Machine Learning">Machine Learning</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="bg-background border-border rounded-xl">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border">
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-background border-border rounded-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border">
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="students">Students</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground hover:text-foreground rounded-xl">
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs & Results */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Fixed grid-cols squishing on mobile */}
        <TabsList className="w-full flex sm:grid grid-cols-2 md:grid-cols-4 overflow-x-auto bg-muted p-1 rounded-2xl h-auto">
          <TabsTrigger value="all" className="rounded-xl py-2.5">All Courses</TabsTrigger>
          <TabsTrigger value="enrolled" className="rounded-xl py-2.5">Enrolled</TabsTrigger>
          <TabsTrigger value="wishlist" className="rounded-xl py-2.5">Wishlist</TabsTrigger>
          <TabsTrigger value="completed" className="rounded-xl py-2.5">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-8 outline-none">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Showing <span className="text-foreground">{filteredAndSortedCourses.length}</span> of {mockCourses.length} courses
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
              className="text-muted-foreground hover:text-foreground rounded-full"
            >
              {sortDirection === "asc" ? "↑" : "↓"} {sortBy}
            </Button>
          </div>

          {filteredAndSortedCourses.length > 0 ? (
            <div className={cn(viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4")}>
              {filteredAndSortedCourses.map((course) =>
                viewMode === "grid" ? (
                  <CourseCard key={course.id} course={course} />
                ) : (
                  <CourseListItem key={course.id} course={course} />
                ),
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card/50 px-6 py-20 text-center flex flex-col items-center">
              <Eye className="mx-auto mb-6 h-12 w-12 text-muted-foreground/30" strokeWidth={1} />
              <h3 className="mb-2 font-medium text-lg text-foreground">No courses found</h3>
              <p className="mb-8 text-sm text-muted-foreground max-w-md">Try adjusting your search criteria, or clear the filters to view the full catalog.</p>
              <Button onClick={clearFilters} className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-8">
                Reset Filters
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}