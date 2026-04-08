"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Zap, MessageSquare, LucideShare2, Loader2, Check, Send } from "lucide-react"
import { z } from "zod"
import { CreateThreadSchema } from "@/lib/zodSchemas"

// Import your server actions
import { toggleSpark, createThread } from "../actions.community"
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

interface Thread {
  id: string
  content: string
  createdAt: Date
  author: { name: string, image: string | null }
}

interface SignalActionsProps {
  signalId: string
  currentUserId: string
  currentUserImage: string | null
  currentUserName: string
  initialSparks: number
  hasSparked: boolean
  threads: Thread[]
}

export default function SignalActions({
  signalId,
  currentUserId,
  currentUserImage,
  currentUserName,
  initialSparks,
  hasSparked: initialHasSparked,
  threads
}: SignalActionsProps) {
  const [isPending, startTransition] = useTransition()
  
  // Optimistic UI for Sparks
  const [hasSparked, setHasSparked] = useState(initialHasSparked)
  const [sparkCount, setSparkCount] = useState(initialSparks)
  
  // UI States
  const [showThreads, setShowThreads] = useState(false)
  const [copied, setCopied] = useState(false)
  
  // Thread Form
  const [replyText, setReplyText] = useState("")

  // --- HANDLERS ---

  const handleSpark = () => {
    // Optimistic update for instant UI feedback
    setHasSparked(!hasSparked)
    setSparkCount(prev => hasSparked ? prev - 1 : prev + 1)
    
    startTransition(async () => {
      await toggleSpark(signalId)
    })
  }

  const handleLucideShare2 = async () => {
    // Generates a link to this specific signal
    const link = `${window.location.origin}/community/signal/${signalId}`
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePostThread = () => {
    if (!replyText.trim()) return

    startTransition(async () => {
      const res = await createThread({ signalId, content: replyText })
      if (res.success) {
        setReplyText("") // Clear input on success
      }
    })
  }

  return (
  <div className="w-full">
    
    {/* ACTION BUTTONS */}
    <div className="flex items-center justify-between px-2 pt-2 border-t border-border/40 mt-3">
      
      <div className="flex items-center gap-1">

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSpark}
          className={`
            px-3 py-1.5 rounded-lg text-sm transition
            ${hasSparked 
              ? "text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20" 
              : "text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10"}
          `}
        >
          <Zap className={`size-4 mr-1 ${hasSparked ? "fill-yellow-500" : ""}`} /> 
          {sparkCount}
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowThreads(!showThreads)}
          className={`
            px-3 py-1.5 rounded-lg text-sm transition
            ${showThreads 
              ? "bg-muted text-foreground" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}
          `}
        >
          <MessageSquare className="size-4 mr-1" /> 
          {threads.length}
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLucideShare2}
          className="
            px-3 py-1.5 rounded-lg text-sm
            text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 transition
          "
        >
          {copied 
            ? <Check className="size-4 mr-1 text-green-500" /> 
            : <LucideShare2 className="size-4 mr-1" />
          }
        </Button>

      </div>
    </div>

    {/* THREAD SECTION */}
    {showThreads && (
      <div className="mt-3 space-y-4 px-2 pb-2">
        
        {/* COMMENTS */}
        {threads.length > 0 ? (
          <div className="space-y-3">
            {threads.map((thread) => (
              <div key={thread.id} className="flex gap-2.5">
                
                <Avatar className="size-8 shrink-0">
                  <AvatarImage src={thread.author.image || undefined} />
                  <AvatarFallback className="text-[10px]">
                    {getInitials(thread.author.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="
                    bg-muted/40 
                    rounded-2xl rounded-tl-sm 
                    px-3 py-2 
                    text-sm
                  ">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-xs">
                        {thread.author.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(thread.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <p className="leading-relaxed whitespace-pre-wrap">
                      {thread.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xs text-muted-foreground py-4">
            No replies yet. Be the first 👀
          </p>
        )}

        {/* INPUT */}
        <div className="flex gap-2.5 items-end pt-1">
          <Avatar className="size-8 shrink-0 mb-1">
            <AvatarImage src={currentUserImage || undefined} />
            <AvatarFallback className="text-[10px]">
              {getInitials(currentUserName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 relative">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              disabled={isPending}
              className="
                w-full min-h-[40px] max-h-28
                text-sm
                bg-muted/40
                rounded-xl
                px-3 py-2.5 pr-10
                outline-none
                focus:ring-1 focus:ring-primary/30
                resize-none
              "
            />

            <Button 
              size="icon" 
              onClick={handlePostThread}
              disabled={isPending || !replyText.trim()}
              className="
                absolute right-1.5 bottom-1.5
                size-7 rounded-md
                flex items-center justify-center
                bg-primary text-white
                hover:opacity-90
                disabled:opacity-40
              "
            >
              {isPending 
                ? <Loader2 className="size-3 animate-spin" /> 
                : <Send className="size-3 text-orange" />
              }
            </Button>
          </div>
        </div>

      </div>
    )}
  </div>
)
}