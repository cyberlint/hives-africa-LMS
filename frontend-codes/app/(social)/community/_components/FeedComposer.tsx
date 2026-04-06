"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
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
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
  }

  return (
    <>
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4 space-y-3">

          {/* INPUT ROW */}
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={user.image || undefined} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>

            <button
              onClick={() => setOpenComposer(true)}
              className="
                flex-1 h-11 px-4 rounded-full text-left
                bg-muted/30 border border-border/50
                text-sm text-muted-foreground
                transition-all
                hover:bg-muted/50 hover:border-border
                focus:outline-none
              "
            >
              Share your proof of work...
            </button>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-between pt-1">
            
            <div className="flex items-center gap-1">

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpenComposer(true)}
                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg px-3"
              >
                <ImageIcon className="mr-2 size-4 text-blue-500" />
                Media
              </Button>

              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg px-3"
              >
                <Link href="/community/events/create">
                  <CalendarPlus className="mr-2 size-4 text-orange" />
                  Event
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg px-3"
              >
                <Video className="mr-2 size-4 text-green-500" />
                Voice
              </Button>

            </div>
          </div>

        </CardContent>
      </Card>

      <PostComposerModal 
        open={openComposer} 
        onOpenChange={setOpenComposer} 
        user={user} 
      />
    </>
  )
}