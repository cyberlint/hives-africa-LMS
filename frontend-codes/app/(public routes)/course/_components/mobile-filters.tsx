"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, X } from "lucide-react"
import type { FilterState } from "@/types/course"
import type { CourseListItem } from "@/hooks/useAllCourses"

interface MobileFiltersProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  courses: CourseListItem[]
}

export function MobileFilters({ isOpen, onClose, filters, onFiltersChange, courses }: MobileFiltersProps) {
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
        newFilters[filterType] = newFilters[filterType].filter((item: number) => item !== value)
      } else {
        ;(newFilters[filterType] as string[]) = (newFilters[filterType] as string[]).filter((item: string) => item !== value)
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Filters</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Course Category */}
          <div>
            <h3 className="font-bold text-[#2c3e50] mb-4">Course Category</h3>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-3">
                  <Checkbox
                    id={`mobile-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) => handleFilterChange("categories", category, checked as boolean)}
                    className="border-[#d1d5db] data-[state=checked]:bg-yellow data-[state=checked]:border-[#ff6b35]"
                  />
                  <label htmlFor={`mobile-${category}`} className="text-sm text-[#2c3e50] cursor-pointer">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Instructors */}
          <div>
            <h3 className="font-bold text-[#2c3e50] mb-4">Instructors</h3>
            <div className="space-y-3">
              {instructors.map((instructor) => (
                <div key={instructor} className="flex items-center space-x-3">
                  <Checkbox
                    id={`mobile-${instructor}`}
                    checked={filters.instructors.includes(instructor)}
                    onCheckedChange={(checked) => handleFilterChange("instructors", instructor, checked as boolean)}
                    className="border-[#d1d5db] data-[state=checked]:bg-yellow data-[state=checked]:border-[#ff6b35]"
                  />
                  <label htmlFor={`mobile-${instructor}`} className="text-sm text-[#2c3e50] cursor-pointer">
                    {instructor}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <h3 className="font-bold text-[#2c3e50] mb-4">Price</h3>
            <div className="space-y-3">
              {["All", "Free", "Paid"].map((price) => (
                <div key={price} className="flex items-center space-x-3">
                  <Checkbox
                    id={`mobile-${price}`}
                    checked={filters.priceTypes.includes(price)}
                    onCheckedChange={(checked) => handleFilterChange("priceTypes", price, checked as boolean)}
                    className="border-[#d1d5db] data-[state=checked]:bg-yellow data-[state=checked]:border-[#ff6b35]"
                  />
                  <label htmlFor={`mobile-${price}`} className="text-sm text-[#2c3e50] cursor-pointer">
                    {price}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Review */}
          <div>
            <h3 className="font-bold text-[#2c3e50] mb-4">Review</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-3">
                  <Checkbox
                    id={`mobile-rating-${rating}`}
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
              ))}
            </div>
          </div>

          {/* Level */}
          <div>
            <h3 className="font-bold text-[#2c3e50] mb-4">Level</h3>
            <div className="space-y-3">
              {["All levels", ...levels.filter((level) => level !== "All levels")].map((level) => (
                <div key={level} className="flex items-center space-x-3">
                  <Checkbox
                    id={`mobile-${level}`}
                    checked={filters.levels.includes(level)}
                    onCheckedChange={(checked) => handleFilterChange("levels", level, checked as boolean)}
                    className="border-[#d1d5db] data-[state=checked]:bg-yellow data-[state=checked]:border-[#ff6b35]"
                  />
                  <label htmlFor={`mobile-${level}`} className="text-sm text-[#2c3e50] cursor-pointer">
                    {level}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="flex-1 border-[#e9ecef] text-[#6c757d] hover:bg-[#f8f9fa] bg-transparent"
          >
            Clear All
          </Button>
          <Button onClick={onClose} className="flex-1 bg-yellow hover:bg-yellow/90 text-white">
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
