"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SubmissionsFilterBarProps {
  courses: { id: string; title: string }[]
  programs: { id: string; title: string }[]
}

export function SubmissionsFilterBar({ courses, programs }: SubmissionsFilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get current filter values from URL
  const currentCourse = searchParams.get("courseId") || "all"
  const currentProgram = searchParams.get("programId") || "all"
  const initialSearch = searchParams.get("search") || ""

  // 1. Local state to track the user's keystrokes instantly
  const [searchTerm, setSearchTerm] = useState(initialSearch)

  // Helper to update URL params
  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all" || value === "") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  // 2. The Debounce Engine
  useEffect(() => {
    // Set a timer to trigger the URL update 300ms after the last keystroke
    const delayDebounceFn = setTimeout(() => {
      // Only trigger if the search term actually changed
      if (searchTerm !== initialSearch) {
        updateFilters("search", searchTerm)
      }
    }, 300)

    // Cleanup function: If the user types another letter before 300ms is up,
    // this cancels the previous timer and starts a new one.
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, initialSearch]) 


  const clearFilters = () => {
    setSearchTerm("") // Clear the local input
    router.push(pathname) // Clear the URL
  }

  const hasActiveFilters = currentCourse !== "all" || currentProgram !== "all" || searchTerm !== ""

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
      
      {/* Search Input (Now tied to local state, not directly to the URL) */}
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input 
          placeholder="Search activity title..." 
          className="pl-9 bg-background"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Program Filter */}
      <Select value={currentProgram} onValueChange={(val) => updateFilters("programId", val)}>
        <SelectTrigger className="w-full sm:w-[200px] bg-background">
          <SelectValue placeholder="All Programs" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Programs</SelectItem>
          {programs.map(p => (
            <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Course Filter */}
      <Select value={currentCourse} onValueChange={(val) => updateFilters("courseId", val)}>
        <SelectTrigger className="w-full sm:w-[200px] bg-background">
          <SelectValue placeholder="All Courses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Courses</SelectItem>
          {courses.map(c => (
            <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button variant="ghost" size="icon" onClick={clearFilters} className="shrink-0 text-muted-foreground hover:text-foreground">
          <X className="size-4" />
        </Button>
      )}
    </div>
  )
}