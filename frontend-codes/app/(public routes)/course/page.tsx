"use client"

import { useState, useMemo, useEffect } from "react"
// import { Header } from "@/components/header"
// import { Navigation } from "@/components/navigation"
import { Sidebar } from "./_components/sidebar"
import { CourseGrid } from "./_components/course-grid"
import { CourseList } from "./_components/course-list"
import { Pagination } from "./_components/pagination"
// import { Footer } from "@/components/footer"

import { MobileFilters } from "./_components/mobile-filters"
import { Grid3X3, List, Search, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMediaQuery } from "@/hooks/use-media-query"

import { FilterState } from "@/types/course"
import { useAllCourses, CourseListItem } from "@/hooks/useAllCourses"

const ITEMS_PER_PAGE = 6

export default function CoursesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

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

  // Determine server-side filters (search only)
  const serverCategory = undefined
  const serverLevel = undefined

  // Fetch courses from API (no category/level filters - these are client-side)
  const { courses: apiCourses, loading, error } = useAllCourses({
    category: serverCategory,
    level: serverLevel,
    search: searchQuery,
  })

  // Client-side filtering for remaining filters (instructor, price, rating)
  const filteredCourses = useMemo(() => {
    return apiCourses.filter((course) => {
      // Instructor filter
      const matchesInstructor = filters.instructors.length === 0 || filters.instructors.includes(course.instructor)

      // Price filter
      const matchesPrice =
        filters.priceTypes.length === 0 ||
        (filters.priceTypes.includes("Free") && course.price === 0) ||
        (filters.priceTypes.includes("Paid") && course.price > 0) ||
        filters.priceTypes.includes("All")

      // Rating filter
      const matchesRating = filters.ratings.length === 0 || filters.ratings.some((rating) => course.rating >= rating)

      // Category filter (client-side for multiple selections)
      const matchesCategory = 
        filters.categories.length === 0 || 
        filters.categories.includes(course.category)

      // Level filter (client-side for multiple selections)
      const matchesLevel =
        filters.levels.length === 0 || 
        filters.levels.includes(course.level) || 
        filters.levels.includes("All levels")

      return matchesInstructor && matchesPrice && matchesRating && matchesCategory && matchesLevel
    })
  }, [apiCourses, filters])

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#1d2026] flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center gap-3">
          <Loader className="h-8 w-8 animate-spin text-yellow" />
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#1d2026] flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#2c3e50] dark:text-gray-100 mb-4">Error Loading Courses</h1>
          <p className="text-[#6c757d] dark:text-gray-400 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-yellow hover:bg-yellow/90 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#1d2026] transition-colors duration-300">
      {/* <Header />
      <Navigation /> */}

      <div className={`flex ${isMobile ? "flex-col" : ""} max-w-7xl mx-auto`}>
        <main className={`flex-1 p-6 ${isMobile ? "order-1" : ""}`}>
          {/* Top Controls */}
          <div className={`flex ${isMobile ? "flex-col gap-4" : "items-center justify-between"} mb-8`}>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-[#2c3e50] dark:text-gray-100">All Courses</h1>
              {activeFiltersCount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#6c757d] dark:text-gray-400">
                    {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} active
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-[#ff6b35] border-[#ff6b35] hover:bg-yellow hover:text-white bg-transparent"
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </div>

            <div className={`flex items-center gap-4 ${isMobile ? "w-full" : ""}`}>
              <div className={`relative ${isMobile ? "flex-1" : ""}`}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8e9aaf] dark:text-gray-500 w-4 h-4" />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className={`pl-10 ${isMobile ? "w-full" : "w-64"} h-10 border-[#e9ecef] dark:border-[#404854] dark:bg-[#2a2f3a] dark:text-gray-100 dark:placeholder:text-gray-500 focus:border-[#ff6b35] focus:ring-[#ff6b35] rounded-md bg-white`}
                />
              </div>

              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`h-10 w-10 p-0 rounded-none border-r border-[#e9ecef] dark:border-[#404854] ${
                    viewMode === "grid"
                      ? "bg-yellow hover:bg-yellow/90 text-white"
                      : "text-[#6c757d] dark:text-gray-400 hover:bg-[#f8f9fa] dark:hover:bg-[#2a2f3a] bg-white dark:bg-[#1d2026] border-y border-l border-[#e9ecef] dark:border-[#404854]"
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
                      ? "bg-yellow hover:bg-yellow/90 text-white"
                      : "text-[#6c757d] dark:text-gray-400 hover:bg-[#f8f9fa] dark:hover:bg-[#2a2f3a] bg-white dark:bg-[#1d2026] border-y border-r border-[#e9ecef] dark:border-[#404854]"
                  }`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-6">
            <p className="text-[#6c757d] dark:text-gray-400">
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
                isMobile={isMobile}
                isTablet={isTablet}
              />
            ) : (
              <CourseList courses={paginatedCourses} isMobile={isMobile} />
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-[#6c757d] dark:text-gray-400 text-lg mb-4">No courses found</p>
              <p className="text-[#8e9aaf] dark:text-gray-500 mb-6">Try adjusting your search or filters</p>
              <Button onClick={clearAllFilters} className="bg-yellow hover:bg-yellow/90 text-white">
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          )}
        </main>

        {!isMobile && <Sidebar filters={filters} onFiltersChange={handleFilterChange} courses={apiCourses} />}
      </div>

      {/* <Footer /> */}



      {/* Mobile Filters Modal */}
      {isMobile && (
        <MobileFilters
          isOpen={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          filters={filters}
          onFiltersChange={handleFilterChange}
          courses={apiCourses}
        />
      )}
    </div>
  )
}
