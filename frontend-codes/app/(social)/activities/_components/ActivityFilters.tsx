"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useTransition, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2, PlusCircle } from "lucide-react"
import Link from "next/link"

export default function ActivityFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Local state for debounced search typing
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  
  const currentType = searchParams.get("type") || ""
  const currentDifficulty = searchParams.get("difficulty") || ""

  // Debounce the search input (waits 400ms after typing stops before querying)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (searchQuery) params.set("q", searchQuery)
      else params.delete("q")

      const newUrl = `?${params.toString()}`
      if (`?${searchParams.toString()}` !== newUrl) {
        startTransition(() => router.push(newUrl, { scroll: false }))
      }
    }, 400)
    return () => clearTimeout(timeoutId)
  }, [searchQuery, searchParams, router])

  // Direct updater for dropdowns
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    
    startTransition(() => router.push(`?${params.toString()}`, { scroll: false }))
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-sm mb-8">
      
      <div className="flex flex-col sm:flex-row w-full md:max-w-2xl gap-3">
        {/* Search Bar */}
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Search challenges..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-muted/20 border-border/50 focus-visible:ring-orange/30" 
          />
        </div>

        {/* Type Filter */}
        <select 
          value={currentType}
          onChange={(e) => updateFilter("type", e.target.value)}
          disabled={isPending}
          className="h-10 px-3 rounded-md text-sm bg-muted/20 border border-border/50 text-foreground outline-none cursor-pointer hover:bg-muted/30 focus:ring-1 focus:ring-orange/30 w-full sm:w-auto"
        >
          <option value="">All Types</option>
          <option value="Hackathon">Hackathon</option>
          <option value="Datathon">Datathon</option>
          <option value="Open_Source_Contribution">Open Source</option>
          <option value="Challenge">Challenge</option>
        </select>

        {/* Difficulty Filter */}
        <select 
          value={currentDifficulty}
          onChange={(e) => updateFilter("difficulty", e.target.value)}
          disabled={isPending}
          className="h-10 px-3 rounded-md text-sm bg-muted/20 border border-border/50 text-foreground outline-none cursor-pointer hover:bg-muted/30 focus:ring-1 focus:ring-orange/30 w-full sm:w-auto"
        >
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Expert">Expert</option>
        </select>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        {isPending && <Loader2 className="size-4 text-orange animate-spin" />}
        <Button asChild className="w-full md:w-auto bg-foreground text-background hover:bg-foreground/90 font-bold h-10 shadow-sm">
          <Link href="/activities/create">
            <PlusCircle className="size-4 mr-2" />
            Host a Challenge
          </Link>
        </Button>
      </div>
    </div>
  )
}