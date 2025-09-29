"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-[#e9ecef] bg-transparent hover:bg-[#f8f9fa] disabled:opacity-50"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {getVisiblePages().map((page, index) => (
        <div key={index}>
          {page === "..." ? (
            <span className="px-3 py-2 text-[#6c757d]">...</span>
          ) : (
            <Button
              size="sm"
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => onPageChange(page as number)}
              className={
                currentPage === page
                  ? "bg-[#1a2332] hover:bg-[#1a2332]/90 text-white"
                  : "border-[#e9ecef] hover:bg-[#f8f9fa] bg-transparent text-[#2c3e50]"
              }
            >
              {page}
            </Button>
          )}
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border-[#e9ecef] bg-transparent hover:bg-[#f8f9fa] disabled:opacity-50"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
