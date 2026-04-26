"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useTransition, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Search,
  SlidersHorizontal,
  Trophy,
  Users,
  Sparkles,
  Loader2,
  Briefcase,
} from "lucide-react"

export default function HiveFiltersInline() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [open, setOpen] = useState(false)

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [ksbQuery, setKsbQuery] = useState(searchParams.get("ksb") || "")

  const isRecruitingActive = searchParams.get("recruiting") === "true"
  const currentSort = searchParams.get("sort") || "treasury"

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())

      searchQuery ? params.set("q", searchQuery) : params.delete("q")
      ksbQuery ? params.set("ksb", ksbQuery) : params.delete("ksb")

      const url = `?${params.toString()}`
      if (`?${searchParams.toString()}` !== url) {
        startTransition(() => router.push(url, { scroll: false }))
      }
    }, 400)

    return () => clearTimeout(t)
  }, [searchQuery, ksbQuery])

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    value ? params.set(key, value) : params.delete(key)

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="space-y-3">

      {/* ================= COMPACT COMMAND BAR ================= */}
      <div className="flex items-center justify-between gap-2">

        {/* LEFT: search only (icon-driven) */}
        <div className="flex items-center gap-2 flex-1">

          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hives..."
              className="pl-9 h-10 rounded-xl bg-background/70 border border-orange/10"
            />
          </div>

          {/* expand button */}
          <Button
            variant="outline"
            onClick={() => setOpen(!open)}
            className="h-10 w-10 p-0 rounded-xl border-orange/20"
          >
            <SlidersHorizontal className="size-4" />
          </Button>
        </div>

        {/* RIGHT: quick toggle */}
        <Button
          onClick={() => update("recruiting", isRecruitingActive ? "" : "true")}
          disabled={isPending}
          className={`h-10 px-3 rounded-xl text-xs font-semibold ${
            isRecruitingActive
              ? "bg-orange text-black"
              : "bg-transparent border border-border"
          }`}
        >
          <Briefcase className="size-4 mr-1" />
          Hiring
        </Button>

        {isPending && (
          <Loader2 className="size-4 text-orange animate-spin" />
        )}
      </div>

      {/* ================= EXPANDABLE PANEL ================= */}
      {open && (
        <div className="p-4 rounded-2xl border bg-background space-y-4 animate-in fade-in-0">

          {/* secondary filter */}
          <div className="relative">
            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={ksbQuery}
              onChange={(e) => setKsbQuery(e.target.value)}
              placeholder="Skill (e.g. Python)"
              className="pl-9 h-10 rounded-xl"
            />
          </div>

          {/* sort */}
          <div className="flex flex-wrap gap-2">

            <button
              onClick={() => update("sort", "treasury")}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 ${
                currentSort === "treasury"
                  ? "bg-orange text-black"
                  : "border border-border"
              }`}
            >
              <Trophy className="size-4" />
              Top
            </button>

            <button
              onClick={() => update("sort", "members")}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 ${
                currentSort === "members"
                  ? "bg-orange text-black"
                  : "border border-border"
              }`}
            >
              <Users className="size-4" />
              Members
            </button>

            <button
              onClick={() => update("sort", "newest")}
              className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                currentSort === "newest"
                  ? "bg-orange text-black"
                  : "border border-border"
              }`}
            >
              New
            </button>

          </div>
        </div>
      )}
    </div>
  )
}