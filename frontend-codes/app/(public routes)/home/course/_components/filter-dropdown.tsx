"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"


 interface FilterState {
  categories: string[]
  instructors: string[]
  priceTypes: string[]
  ratings: number[]
  levels: string[]
}
 interface Course {
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
interface FilterDropdownProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  courses: Course[]
}

export function FilterDropdown({ filters, onFiltersChange, courses }: FilterDropdownProps) {
  const categories = Array.from(new Set(courses.map((course) => course.category)))
  const instructors = Array.from(new Set(courses.map((course) => course.instructor)))
  const levels = Array.from(new Set(courses.map((course) => course.level)))

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

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      instructors: [],
      priceTypes: [],
      ratings: [],
      levels: [],
    })
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {/* Quick Filters */}
      <div className="flex items-center justify-between pb-2 border-b border-[#e9ecef]">
        <h3 className="font-semibold text-[#2c3e50]">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="text-[#ff6b35] hover:bg-[#ff6b35]/10 h-auto p-1"
        >
          Clear All
        </Button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-medium text-[#2c3e50] mb-2 text-sm">Category</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {categories.slice(0, 5).map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`dropdown-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={(checked) => handleFilterChange("categories", category, checked as boolean)}
                className="border-[#d1d5db] data-[state=checked]:bg-[#ff6b35] data-[state=checked]:border-[#ff6b35]"
              />
              <label htmlFor={`dropdown-${category}`} className="text-xs text-[#2c3e50] cursor-pointer">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="font-medium text-[#2c3e50] mb-2 text-sm">Price</h4>
        <div className="space-y-2">
          {["All", "Free", "Paid"].map((price) => (
            <div key={price} className="flex items-center space-x-2">
              <Checkbox
                id={`dropdown-price-${price}`}
                checked={filters.priceTypes.includes(price)}
                onCheckedChange={(checked) => handleFilterChange("priceTypes", price, checked as boolean)}
                className="border-[#d1d5db] data-[state=checked]:bg-[#ff6b35] data-[state=checked]:border-[#ff6b35]"
              />
              <label htmlFor={`dropdown-price-${price}`} className="text-xs text-[#2c3e50] cursor-pointer">
                {price}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-medium text-[#2c3e50] mb-2 text-sm">Rating</h4>
        <div className="space-y-2">
          {[5, 4, 3].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`dropdown-rating-${rating}`}
                checked={filters.ratings.includes(rating)}
                onCheckedChange={(checked) => handleFilterChange("ratings", rating, checked as boolean)}
                className="border-[#d1d5db] data-[state=checked]:bg-[#ff6b35] data-[state=checked]:border-[#ff6b35]"
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
          ))}
        </div>
      </div>

      {/* Level */}
      <div>
        <h4 className="font-medium text-[#2c3e50] mb-2 text-sm">Level</h4>
        <div className="space-y-2">
          {["Beginner", "Intermediate", "Expert"].map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox
                id={`dropdown-level-${level}`}
                checked={filters.levels.includes(level)}
                onCheckedChange={(checked) => handleFilterChange("levels", level, checked as boolean)}
                className="border-[#d1d5db] data-[state=checked]:bg-[#ff6b35] data-[state=checked]:border-[#ff6b35]"
              />
              <label htmlFor={`dropdown-level-${level}`} className="text-xs text-[#2c3e50] cursor-pointer">
                {level}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}