"use client"

import { useState, useMemo } from "react"
// import { Header } from "@/components/header"
// import { Navigation } from "@/components/navigation"
import { Sidebar } from "./_components/sidebar"
import { CourseGrid } from "./_components/course-grid"
import { CourseList } from "./_components/course-list"
import { Pagination } from "./_components/pagination"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Footer } from "@/components/footer"
import { CourseModal } from "./_components/course-modal"
import { MobileFilters } from "./_components/mobile-filters"
import { Grid3X3, List, Search,Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMediaQuery } from "@/hooks/use-media-query"
import { FilterDropdown } from "./_components/filter-dropdown"
export interface Course {
  id: number
  title: string
  instructor: string
  category: string
  duration: string
  students: number
  lessons: number
  level: string
  price: string
  originalPrice?: string
  rating: number
  image: string
  description: string
  tags: string[]
}

export interface FilterState {
  categories: string[]
  instructors: string[]
  priceTypes: string[]
  ratings: number[]
  levels: string[]
}

const courses: Course[] = [
  {
    id: 1,
    title: "AI Python For Beginners",
    instructor: "DeterminedPolitas",
    category: "Commercial",
    duration: "2Weeks",
    students: 156,
    lessons: 20,
    level: "Beginner",
    price: "Free",
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=360",
    description:
      "Learn the fundamentals of AI and Python programming. This comprehensive course covers machine learning basics, data analysis, and practical AI applications.",
    tags: ["Python", "AI", "Machine Learning", "Beginner"],
  },
  {
    id: 2,
    title: "Create An LMS Website With LearnPress",
    instructor: "DeterminedPolitas",
    category: "Office",
    duration: "2Weeks",
    students: 156,
    lessons: 20,
    level: "Intermediate",
    price: "₦2,999,999.0",
    originalPrice: "Free",
    rating: 4.2,
    image: "/placeholder.svg?height=200&width=360",
    description:
      "Build a complete Learning Management System using LearnPress. Learn WordPress development, course creation, and student management systems.",
    tags: ["WordPress", "LMS", "Web Development", "LearnPress"],
  },
  {
    id: 3,
    title: "Prompt Engineering For Beginners",
    instructor: "Andrew Ng",
    category: "Shop",
    duration: "2Weeks",
    students: 156,
    lessons: 20,
    level: "Beginner",
    price: "₦5,999.0",
    originalPrice: "Free",
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=360",
    description:
      "Master the art of prompt engineering for AI systems. Learn to create effective prompts for ChatGPT, GPT-4, and other language models.",
    tags: ["AI", "Prompt Engineering", "ChatGPT", "Language Models"],
  },
  {
    id: 4,
    title: "Advanced Data Science Techniques",
    instructor: "John Doe",
    category: "Educate",
    duration: "3Weeks",
    students: 89,
    lessons: 25,
    level: "Expert",
    price: "₦15,999.0",
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=360",
    description:
      "Advanced data science methodologies including deep learning, statistical modeling, and big data processing techniques.",
    tags: ["Data Science", "Deep Learning", "Statistics", "Big Data"],
  },
  {
    id: 5,
    title: "Mobile App Development with React Native",
    instructor: "DeterminedPolitas",
    category: "Academy",
    duration: "4Weeks",
    students: 234,
    lessons: 30,
    level: "Intermediate",
    price: "Free",
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=360",
    description:
      "Build cross-platform mobile applications using React Native. Learn navigation, state management, and app deployment.",
    tags: ["React Native", "Mobile Development", "JavaScript", "Cross-platform"],
  },
  {
    id: 6,
    title: "Google Digital Marketing And E-Commerce",
    instructor: "Andrew Ng",
    category: "Single family home",
    duration: "2Weeks",
    students: 156,
    lessons: 20,
    level: "All levels",
    price: "₦5,999.0",
    originalPrice: "Free",
    rating: 4.3,
    image: "/placeholder.svg?height=200&width=360",
    description:
      "Comprehensive digital marketing course covering SEO, social media marketing, Google Ads, and e-commerce strategies.",
    tags: ["Digital Marketing", "SEO", "Google Ads", "E-commerce"],
  },
  {
    id: 7,
    title: "Cybersecurity Fundamentals",
    instructor: "John Doe",
    category: "Studio",
    duration: "3Weeks",
    students: 178,
    lessons: 22,
    level: "Beginner",
    price: "₦8,999.0",
    rating: 4.4,
    image: "/placeholder.svg?height=200&width=360",
    description:
      "Learn essential cybersecurity concepts, threat detection, network security, and ethical hacking basics.",
    tags: ["Cybersecurity", "Network Security", "Ethical Hacking", "Security"],
  },
  {
    id: 8,
    title: "Cloud Computing with AWS",
    instructor: "DeterminedPolitas",
    category: "University",
    duration: "5Weeks",
    students: 267,
    lessons: 35,
    level: "Intermediate",
    price: "Free",
    rating: 4.9,
    image: "/placeholder.svg?height=200&width=360",
    description: "Master Amazon Web Services including EC2, S3, Lambda, and cloud architecture best practices.",
    tags: ["AWS", "Cloud Computing", "DevOps", "Infrastructure"],
  },
]

const ITEMS_PER_PAGE = 6

export default function CoursesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    instructors: [],
    priceTypes: [],
    ratings: [],
    levels: [],
  })

  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")

  // Filter and search logic
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      // Category filter
      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(course.category)

      // Instructor filter
      const matchesInstructor = filters.instructors.length === 0 || filters.instructors.includes(course.instructor)

      // Price filter
      const matchesPrice =
        filters.priceTypes.length === 0 ||
        (filters.priceTypes.includes("Free") && course.price === "Free") ||
        (filters.priceTypes.includes("Paid") && course.price !== "Free") ||
        filters.priceTypes.includes("All")

      // Rating filter
      const matchesRating = filters.ratings.length === 0 || filters.ratings.some((rating) => course.rating >= rating)

      // Level filter
      const matchesLevel =
        filters.levels.length === 0 || filters.levels.includes(course.level) || filters.levels.includes("All levels")

      return matchesSearch && matchesCategory && matchesInstructor && matchesPrice && matchesRating && matchesLevel
    })
  }, [searchQuery, filters])

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Reset pagination when filters change
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      instructors: [],
      priceTypes: [],
      ratings: [],
      levels: [],
    })
    setSearchQuery("")
    setCurrentPage(1)
  }

  const activeFiltersCount = Object.values(filters).reduce((count, filterArray) => count + filterArray.length, 0)

  return (
<div className="min-h-screen bg-white">
  

      <div className={`flex ${isMobile ? "flex-col" : ""} max-w-7xl mx-auto`}>
        <main className={`flex-1 p-6 ${isMobile ? "order-1" : ""}`}>
          {/* Top Controls */}
          <div className={`flex ${isMobile ? "flex-col gap-4" : "items-center justify-between"} mb-8`}>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-[#2c3e50]">All Courses</h1>
              {activeFiltersCount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#6c757d]">
                    {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} active
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-[#ff6b35] border-[#ff6b35] hover:bg-[#ff6b35] hover:text-white bg-transparent"
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </div>

            <div className={`flex items-center gap-4 ${isMobile ? "w-full" : ""}`}>
              <div className={`relative ${isMobile ? "flex-1" : ""}`}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8e9aaf] w-4 h-4" />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className={`pl-10 ${isMobile ? "w-full" : "w-64"} h-10 border-[#e9ecef] focus:border-[#ff6b35] focus:ring-[#ff6b35] rounded-md bg-white`}
                />
              </div>

              {isMobile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="h-10 px-3 border-[#e9ecef] text-[#6c757d] hover:bg-[#f8f9fa] bg-white flex items-center gap-2 flex-shrink-0"
                >
                  <Filter className="w-4 h-4" />
                  {activeFiltersCount > 0 && (
                    <span className="bg-[#ff6b35] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              )}

              <div className="flex items-center gap-2">
                {/* filter on desktop */}
                
                {/* {!isMobile && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 px-3 border-[#e9ecef] text-[#6c757d] hover:bg-[#f8f9fa] bg-white flex items-center gap-2"
                      >
                        <Filter className="w-4 h-4" />
                        Filters
                        {activeFiltersCount > 0 && (
                          <span className="bg-[#ff6b35] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {activeFiltersCount}
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80 p-4 bg-white border border-[#e9ecef] shadow-lg">
                      <FilterDropdown filters={filters} onFiltersChange={handleFilterChange} courses={courses} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                )} */}

                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={`h-10 w-10 p-0 rounded-none border-r border-[#e9ecef] ${
                      viewMode === "grid"
                        ? "bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white"
                        : "text-[#6c757d] hover:bg-[#f8f9fa] bg-white border-y border-l border-[#e9ecef]"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`h-10 w-10 p-0 rounded-none ${
                      viewMode === "list"
                        ? "bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white"
                        : "text-[#6c757d] hover:bg-[#f8f9fa] bg-white border-y border-r border-[#e9ecef]"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-6">
            <p className="text-[#6c757d]">
              Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredCourses.length)} of{" "}
              {filteredCourses.length} courses
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          {/* Course Content */}
          {paginatedCourses.length > 0 ? (
            viewMode === "grid" ? (
              <CourseGrid
                courses={paginatedCourses}
                onCourseSelect={setSelectedCourse}
                isMobile={isMobile}
                isTablet={isTablet}
              />
            ) : (
              <CourseList courses={paginatedCourses} onCourseSelect={setSelectedCourse} isMobile={isMobile} />
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-[#6c757d] text-lg mb-4">No courses found</p>
              <p className="text-[#8e9aaf] mb-6">Try adjusting your search or filters</p>
              <Button onClick={clearAllFilters} className="bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white">
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          )}
        </main>

        {!isMobile && <Sidebar filters={filters} onFiltersChange={handleFilterChange} courses={courses} />}
      </div>

  

      {/* Course Details Modal */}
      {selectedCourse && (
        <CourseModal course={selectedCourse} isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} />
      )}

      {/* Mobile Filters Modal */}
      {isMobile && (
        <MobileFilters
          isOpen={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          filters={filters}
          onFiltersChange={handleFilterChange}
          courses={courses}
        />
      )}
    </div>
  )
}
