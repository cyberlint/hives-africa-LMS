"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ImageIcon, CalendarPlus, Video } from "lucide-react"
import Link from "next/link"

import PostComposerModal from "./PostComposerModal"

export interface ComposerUserContext {
  id: string
  name: string
  image: string | null
  totalRep: number
  portfolioItems: any[]
}

export default function FeedComposer({ user }: { user: ComposerUserContext }) {
  const [openComposer, setOpenComposer] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <>
      <div className="bg-background border border-border/40 rounded-2xl px-4 py-3 shadow-sm">
        
        {/* INPUT ROW */}
        <div className="flex items-center gap-3">
          <Avatar className="size-10 shrink-0">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>

          <button
            onClick={() => setOpenComposer(true)}
            className="
              flex-1 text-left
              px-4 py-2.5
              rounded-full
              bg-muted/40
              text-sm text-muted-foreground
              transition-all
              hover:bg-muted/60
              focus:outline-none
            "
          >
            Share something with the community...
          </button>
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-border/40 my-3" />

        {/* ACTIONS */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenComposer(true)}
              className="
                flex items-center gap-2
                text-muted-foreground
                hover:text-foreground
                hover:bg-muted/50
                rounded-lg px-3 py-2
              "
            >
              <ImageIcon className="size-4 text-blue-500" />
              <span className="hidden sm:inline">Media</span>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="
                flex items-center gap-2
                text-muted-foreground
                hover:text-foreground
                hover:bg-muted/50
                rounded-lg px-3 py-2
              "
            >
              <Link href="/events/create">
                <CalendarPlus className="size-4 text-orange-500" />
                <span className="hidden sm:inline">Event</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="
                hidden sm:flex items-center gap-2
                text-muted-foreground
                hover:text-foreground
                hover:bg-muted/50
                rounded-lg px-3 py-2
              "
            >
              <Video className="size-4 text-green-500" />
              Voice
            </Button>
          </div>
        </div>
      </div>

      <PostComposerModal 
        open={openComposer} 
        onOpenChange={setOpenComposer} 
        user={user} 
      />
    </>
  )
}