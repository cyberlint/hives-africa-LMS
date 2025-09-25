import { Checkbox } from "@/components/ui/checkbox"
import { Star } from "lucide-react"
import type { Course, FilterState } from "@/types/course"

interface SidebarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  courses: Course[]
}

export function Sidebar({ filters, onFiltersChange, courses }: SidebarProps) {
  const categories = Array.from(new Set(courses.map((course) => course.category)))
  const instructors = Array.from(new Set(courses.map((course) => course.instructor)))
  const levels = Array.from(new Set(courses.map((course) => course.level)))

  const getCategoryCount = (category: string) => {
    return courses.filter((course) => course.category === category).length
  }

  const getInstructorCount = (instructor: string) => {
    return courses.filter((course) => course.instructor === instructor).length
  }

  const getPriceCount = (priceType: string) => {
    if (priceType === "All") return courses.length
    if (priceType === "Free") return courses.filter((course) => course.price === "Free").length
    if (priceType === "Paid") return courses.filter((course) => course.price !== "Free").length
    return 0
  }

  const getRatingCount = (rating: number) => {
    return courses.filter((course) => course.rating >= rating).length
  }

  const getLevelCount = (level: string) => {
    if (level === "All levels") return courses.length
    return courses.filter((course) => course.level === level).length
  }

  const handleFilterChange = (filterType: keyof FilterState, value: string | number, checked: boolean) => {
    const newFilters = { ...filters }

    if (checked) {
      if (filterType === "ratings") {
        newFilters[filterType] = [...newFilters[filterType], value as number]
      } else {
        ;(newFilters[filterType] as string[]) = [...(newFilters[filterType] as string[]), value as string]
      }
    } else {
      if (filterType === "ratings") {
        newFilters[filterType] = newFilters[filterType].filter((item) => item !== value)
      } else {
        ;(newFilters[filterType] as string[]) = (newFilters[filterType] as string[]).filter((item) => item !== value)
      }
    }

    onFiltersChange(newFilters)
  }

  return (
    <aside className="w-72 bg-[#f8f9fa] p-6 min-h-screen border-l border-[#e9ecef]">
      {/* Course Category */}
      <div className="mb-8">
        <h3 className="font-bold text-[#2c3e50] mb-4">Course Category</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center justify-between py-1">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={category}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={(checked) => handleFilterChange("categories", category, checked as boolean)}
                  className="border-[#d1d5db] data-[state=checked]:bg-yellow data-[state=checked]:border-[#ff6b35]"
                />
                <label htmlFor={category} className="text-sm text-[#2c3e50] cursor-pointer">
                  {category}
                </label>
              </div>
              <span className="text-sm text-[#6c757d] font-medium">{getCategoryCount(category)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructors */}
      <div className="mb-8">
        <h3 className="font-bold text-[#2c3e50] mb-4">Instructors</h3>
        <div className="space-y-3">
          {instructors.map((instructor) => (
            <div key={instructor} className="flex items-center justify-between py-1">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={instructor}
                  checked={filters.instructors.includes(instructor)}
                  onCheckedChange={(checked) => handleFilterChange("instructors", instructor, checked as boolean)}
                  className="border-[#d1d5db] data-[state=checked]:bg-yellow data-[state=checked]:border-[#ff6b35]"
                />
                <label htmlFor={instructor} className="text-sm text-[#2c3e50] cursor-pointer">
                  {instructor}
                </label>
              </div>
              <span className="text-sm text-[#6c757d] font-medium">{getInstructorCount(instructor)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="mb-8">
        <h3 className="font-bold text-[#2c3e50] mb-4">Price</h3>
        <div className="space-y-3">
          {["All", "Free", "Paid"].map((price) => (
            <div key={price} className="flex items-center justify-between py-1">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={price}
                  checked={filters.priceTypes.includes(price)}
                  onCheckedChange={(checked) => handleFilterChange("priceTypes", price, checked as boolean)}
                  className="border-[#d1d5db] data-[state=checked]:bg-yellow data-[state=checked]:border-[#ff6b35]"
                />
                <label htmlFor={price} className="text-sm text-[#2c3e50] cursor-pointer">
                  {price}
                </label>
              </div>
              <span className="text-sm text-[#6c757d] font-medium">{getPriceCount(price)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review */}
      <div className="mb-8">
        <h3 className="font-bold text-[#2c3e50] mb-4">Review</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center justify-between py-1">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.ratings.includes(rating)}
                  onCheckedChange={(checked) => handleFilterChange("ratings", rating, checked as boolean)}
                  className="border-[#d1d5db] data-[state=checked]:bg-yellow data-[state=checked]:border-[#ff6b35]"
                />
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < rating ? "fill-[#ff6b35] text-[#ff6b35]" : "text-[#e9ecef]"}`}
                    />
                  ))}
                  <span className="text-xs text-[#6c757d] ml-1">& up</span>
                </div>
              </div>
              <span className="text-sm text-[#6c757d] font-medium">({getRatingCount(rating)})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Level */}
      <div className="mb-8">
        <h3 className="font-bold text-[#2c3e50] mb-4">Level</h3>
        <div className="space-y-3">
          {["All levels", ...levels.filter((level) => level !== "All levels")].map((level) => (
            <div key={level} className="flex items-center justify-between py-1">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={level}
                  checked={filters.levels.includes(level)}
                  onCheckedChange={(checked) => handleFilterChange("levels", level, checked as boolean)}
                  className="border-[#d1d5db] data-[state=checked]:bg-yellow data-[state=checked]:border-[#ff6b35]"
                />
                <label htmlFor={level} className="text-sm text-[#2c3e50] cursor-pointer">
                  {level}
                </label>
              </div>
              <span className="text-sm text-[#6c757d] font-medium">{getLevelCount(level)}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
