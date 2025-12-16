"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  Grid3X3,
  List,
  BookOpen,
  Users,
  Clock,
  Star,
  Heart,
  ShoppingCart,
  Play,
  Award,
  TrendingUp,
  Eye,
  Share2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { useDashboard } from "../studentContext"
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

interface ViewAllProps {
  onTabChange: (tab: string) => void
}

// Courses will be fetched from API via context

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

  // Get courses from context
  const { courses: allCourses, enrolledCourses, user, loading, error } = useDashboard()

  // Transform courses to match the Course interface
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
        students: 0, // TODO: Add to API
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
        tags: [], // TODO: Add tags to API
      }
    })
  }, [allCourses, user.progress, user.enrolledCourses])

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = mockCourses

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((course) => course.category === selectedCategory)
    }

    // Filter by level
    if (selectedLevel !== "all") {
      filtered = filtered.filter((course) => course.level === selectedLevel)
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((course) => course.status === selectedStatus)
    }

    // Filter by tab
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

    // Sort courses
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

  // Statistics
  const stats = useMemo(() => {
    return {
      total: mockCourses.length,
      enrolled: mockCourses.filter((c) => c.status === "enrolled").length,
      completed: mockCourses.filter((c) => c.status === "completed").length,
      wishlist: mockCourses.filter((c) => c.status === "wishlist").length,
    }
  }, [mockCourses])

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fdb606] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-red-600">Unable to load courses</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
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
        // Optional: Implement share functionality
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
    <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-[#fdb606]/30">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={course.thumbnail || "/ai.png"}
            alt={course.title}
            width={300}
            height={200}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-white/90 text-gray-700">
              {course.level}
            </Badge>
          </div>
          {course.progress !== undefined && (
            <div className="absolute bottom-2 left-2 right-2">
              <Progress value={course.progress} className="h-2" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-[#fdb606] transition-colors">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600">{course.instructor}</p>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{course.rating}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{course.students.toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{course.duration}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-[#fdb606]">${course.price}</span>
              {course.originalPrice && (
                <span className="text-sm text-gray-500 line-through">${course.originalPrice}</span>
              )}
            </div>
            <Badge
              variant={
                course.status === "completed" ? "default" : course.status === "enrolled" ? "secondary" : "outline"
              }
              className={cn(
                course.status === "completed" && "bg-green-100 text-green-800",
                course.status === "enrolled" && "bg-blue-100 text-blue-800",
              )}
            >
              {course.status === "not-started" ? "Available" : course.status}
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex space-x-2">
              {course.status === "enrolled" ? (
                <Button size="sm" onClick={() => handleCourseAction("continue", course.id)}>
                  <Play className="h-4 w-4 mr-1" />
                  Continue
                </Button>
              ) : course.status === "completed" ? (
                <Button size="sm" variant="outline" onClick={() => handleCourseAction("review", course.id)}>
                  <Award className="h-4 w-4 mr-1" />
                  Review
                </Button>
              ) : (
                <Button size="sm" onClick={() => handleCourseAction("enroll", course.id)}>
                  <BookOpen className="h-4 w-4 mr-1" />
                  Enroll
                </Button>
              )}
            </div>
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCourseAction("wishlist", course.id)}
                className="p-2"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleCourseAction("cart", course.id)} className="p-2">
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleCourseAction("share", course.id)} className="p-2">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const CourseListItem = ({ course }: { course: Course }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Image
            src={course.thumbnail || "/ai.png"}
            alt={course.title}
            width={100}
            height={100}
            className="w-24 h-16 object-cover rounded flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate">{course.title}</h3>
                <p className="text-sm text-gray-600">{course.instructor}</p>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{course.rating}</span>
                  </div>
                  <span>{course.duration}</span>
                  <Badge variant="outline" className="text-xs">
                    {course.level}
                  </Badge>
                </div>
                {course.progress !== undefined && (
                  <div className="mt-2">
                    <Progress value={course.progress} className="h-2 w-32" />
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4 ml-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-[#fdb606]">${course.price}</div>
                  {course.originalPrice && (
                    <div className="text-sm text-gray-500 line-through">${course.originalPrice}</div>
                  )}
                </div>
                <div className="flex space-x-2">
                  {course.status === "enrolled" ? (
                    <Button size="sm" onClick={() => handleCourseAction("continue", course.id)}>
                      Continue
                    </Button>
                  ) : course.status === "completed" ? (
                    <Button size="sm" variant="outline" onClick={() => handleCourseAction("review", course.id)}>
                      Review
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => handleCourseAction("enroll", course.id)}>
                      Enroll
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => handleCourseAction("wishlist", course.id)}>
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">View All Courses</h1>
          <p className="text-gray-600 mt-1">Comprehensive overview of all available courses</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-[#fdb606]" />
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Enrolled</p>
                <p className="text-2xl font-bold">{stats.enrolled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Wishlist</p>
                <p className="text-2xl font-bold">{stats.wishlist}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className={cn("transition-all duration-300", showFilters || "hidden md:block")}>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
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
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="students">Students</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="enrolled">Enrolled</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Results */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredAndSortedCourses.length} of {mockCourses.length} courses
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            >
              {sortDirection === "asc" ? "↑" : "↓"} {sortBy}
            </Button>
          </div>

          {/* Course Grid/List */}
          {filteredAndSortedCourses.length > 0 ? (
            <div
              className={cn(viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4")}
            >
              {filteredAndSortedCourses.map((course) =>
                viewMode === "grid" ? (
                  <CourseCard key={course.id} course={course} />
                ) : (
                  <CourseListItem key={course.id} course={course} />
                ),
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters}>Clear all filters</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
