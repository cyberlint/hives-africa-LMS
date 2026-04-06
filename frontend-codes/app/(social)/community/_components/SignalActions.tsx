"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Zap, MessageSquare, Send, Loader2, Check } from "lucide-react"
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

  const handleShare = async () => {
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
      <div className="flex gap-2 pt-2 border-t border-border mt-3 p-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSpark}
          className={`flex-1 font-bold ${hasSparked ? "text-yellow bg-yellow/10 hover:bg-yellow/20" : "text-muted-foreground hover:text-yellow hover:bg-yellow/10"}`}
        >
          <Zap className={`size-4 mr-2 ${hasSparked ? "fill-yellow" : ""}`} /> 
          Spark ({sparkCount})
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowThreads(!showThreads)}
          className={`flex-1 font-bold ${showThreads ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <MessageSquare className="size-4 mr-2" /> 
          Thread ({threads.length})
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleShare}
          className="flex-1 font-bold text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
        >
          {copied ? <Check className="size-4 mr-2 text-green-500" /> : <Send className="size-4 mr-2" />} 
          {copied ? "Copied!" : "Share"}
        </Button>
      </div>

      {/* EXPANDABLE THREAD SECTION */}
      {showThreads && (
        <div className="px-4 pb-4 pt-2 bg-muted/10 border-t border-border/50 space-y-4">
          
          {/* Mapped Comments */}
          {threads.length > 0 ? (
            <div className="space-y-4 pt-2">
              {threads.map((thread) => (
                <div key={thread.id} className="flex gap-3">
                  <Avatar className="size-8 shrink-0">
                    <AvatarImage src={thread.author.image || undefined} />
                    <AvatarFallback className="text-[10px]">{getInitials(thread.author.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-background border border-border p-3 rounded-2xl rounded-tl-sm text-sm text-foreground shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs">{thread.author.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(thread.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{thread.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-xs text-muted-foreground py-4">No threads yet. Start the conversation!</p>
          )}

          {/* Comment Input */}
          <div className="flex gap-3 items-end pt-2">
            <Avatar className="size-8 shrink-0 mb-1">
              <AvatarImage src={currentUserImage || undefined} />
              <AvatarFallback className="text-[10px]">{getInitials(currentUserName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 relative">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Add to the thread..."
                disabled={isPending}
                className="w-full min-h-[44px] max-h-32 text-sm bg-background border border-border rounded-xl p-3 pr-12 outline-none focus:ring-1 focus:ring-orange resize-none scrollbar-thin"
              />
              <Button 
                size="icon" 
                onClick={handlePostThread}
                disabled={isPending || !replyText.trim()}
                className="absolute right-1.5 bottom-1.5 size-8 rounded-lg bg-orange text-white hover:bg-orange/90 disabled:opacity-50"
              >
                {isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-3" />}
              </Button>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}