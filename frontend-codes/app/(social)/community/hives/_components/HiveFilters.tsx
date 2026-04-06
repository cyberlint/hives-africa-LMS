"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, Filter, Briefcase, Loader2 } from "lucide-react"
import { useTransition, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function HiveFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Local state for instant typing feel
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [ksbQuery, setKsbQuery] = useState(searchParams.get("ksb") || "")
  
  const isRecruitingActive = searchParams.get("recruiting") === "true"
  const currentSort = searchParams.get("sort") || "treasury"

  // PROPER DEBOUNCE EFFECT
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (searchQuery) params.set("q", searchQuery)
      else params.delete("q")

      if (ksbQuery) params.set("ksb", ksbQuery)
      else params.delete("ksb")

      // Only trigger a route change if the URL actually needs to update
      const newUrl = `?${params.toString()}`
      if (`?${searchParams.toString()}` !== newUrl) {
        startTransition(() => {
          router.push(newUrl, { scroll: false }) // scroll: false prevents page jumps
        })
      }
    }, 500) // Waits 500ms after the user stops typing

    // Cleanup clears the timeout if the user types again before 500ms
    return () => clearTimeout(timeoutId)
  }, [searchQuery, ksbQuery, searchParams, router])

  // Direct updater for buttons/dropdowns (no debounce needed)
  const updateFilterDirectly = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-4 z-30 bg-background/80 backdrop-blur-md py-4 border-b border-border/40">
      
      <div className="flex flex-col sm:flex-row w-full md:max-w-xl gap-4">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Search by Hive name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-card border-border/50 rounded-full shadow-sm text-sm" 
          />
        </div>

        <div className="relative w-full">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Filter by Skill (e.g. Python)" 
            value={ksbQuery}
            onChange={(e) => setKsbQuery(e.target.value)}
            className="pl-10 h-10 bg-card border-border/50 rounded-full shadow-sm text-sm" 
          />
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto scrollbar-hide">
        <Button 
          onClick={() => updateFilterDirectly("recruiting", isRecruitingActive ? "" : "true")}
          disabled={isPending}
          className={`rounded-full h-10 px-4 text-xs font-bold shrink-0 transition-colors ${
            isRecruitingActive 
              ? "bg-green-500 hover:bg-green-600 text-white shadow-sm" 
              : "bg-transparent border border-border/50 text-foreground hover:bg-muted"
          }`}
        >
          {isRecruitingActive && <Briefcase className="size-3 mr-1.5" />}
          Recruiting Now
        </Button>

        <select 
          value={currentSort}
          onChange={(e) => updateFilterDirectly("sort", e.target.value)}
          disabled={isPending}
          className="h-10 px-4 rounded-full text-xs font-bold bg-background border border-border/50 text-foreground outline-none cursor-pointer hover:bg-muted/50 transition-colors shrink-0"
        >
          <option value="treasury">Top Treasury</option>
          <option value="members">Most Members</option>
          <option value="newest">Newly Launched</option>
        </select>

        {isPending && <Loader2 className="size-4 text-orange animate-spin ml-2 shrink-0" />}
      </div>
    </div>
  )
}