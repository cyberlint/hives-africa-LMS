"use client"

import Link from "next/link"
import { useEffect, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Loader2, PlusCircle, Search } from "lucide-react"

export default function ActivityFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("q") || ""
  )

  const currentType = searchParams.get("type") || ""
  const currentDifficulty = searchParams.get("difficulty") || ""

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (searchQuery) params.set("q", searchQuery)
      else params.delete("q")

      const newUrl = `?${params.toString()}`

      if (`?${searchParams.toString()}` !== newUrl) {
        startTransition(() =>
          router.push(newUrl, { scroll: false })
        )
      }
    }, 400)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, searchParams, router])

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) params.set(key, value)
    else params.delete(key)

    startTransition(() =>
      router.push(`?${params.toString()}`, {
        scroll: false,
      })
    )
  }

  return (
  <div className="rounded-2xl border border-border bg-card p-4">

    {/* Search */}

    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        placeholder="Search challenges..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="h-11 pl-9"
      />
    </div>

    {/* Filters */}

    <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

      <div className="flex flex-col gap-3 sm:flex-row">

        <Select
          value={currentType || "all"}
          onValueChange={(value) =>
            updateFilter("type", value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="h-10 w-full sm:w-[190px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Hackathon">Hackathon</SelectItem>
            <SelectItem value="Datathon">Datathon</SelectItem>
            <SelectItem value="Open_Source_Contribution">
              Open Source
            </SelectItem>
            <SelectItem value="Challenge">
              Challenge
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={currentDifficulty || "all"}
          onValueChange={(value) =>
            updateFilter(
              "difficulty",
              value === "all" ? "" : value
            )
          }
        >
          <SelectTrigger className="h-10 w-full sm:w-[190px]">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">
              Intermediate
            </SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
            <SelectItem value="Expert">Expert</SelectItem>
          </SelectContent>
        </Select>

      </div>

      <Button
        asChild
        className="h-10 w-full lg:w-auto"
      >
        <Link href="/activities/create">
          <PlusCircle className="mr-2 size-4" />
          Host Challenge
        </Link>
      </Button>

    </div>

    {isPending && (
      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Updating results...
      </div>
    )}

  </div>
)
}