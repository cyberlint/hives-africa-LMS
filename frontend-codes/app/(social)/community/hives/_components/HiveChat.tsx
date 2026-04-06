"use client"

import { useState, useTransition, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Paperclip, Send, Loader2 } from "lucide-react"
import { sendHiveMessage } from "../../actions.hive-chat"

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

interface Message {
  id: string
  content: string
  createdAt: Date
  user: {
    id: string
    name: string
    image: string | null
  }
}

interface HiveChatProps {
  hiveId: string
  hiveName: string
  currentUserId: string
  disabled: boolean
  initialMessages: Message[]
}

export default function HiveChat({ hiveId, hiveName, currentUserId, disabled, initialMessages }: HiveChatProps) {
  const [content, setContent] = useState("")
  const [isPending, startTransition] = useTransition()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [initialMessages])

  const handleSend = () => {
    if (!content.trim() || disabled) return

    const messageToSend = content
    setContent("") // Optimistically clear input

    startTransition(async () => {
      const res = await sendHiveMessage(hiveId, messageToSend)
      if (res?.error) {
        setContent(messageToSend) // Restore if failed
        console.error(res.error)
      }
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* MESSAGES AREA */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-thumb-border">
        {initialMessages.length === 0 ? (
          <div className="text-center text-xs text-muted-foreground mt-10">
            Welcome to the {hiveName} workspace! <br/> Start the conversation here.
          </div>
        ) : (
          initialMessages.map((msg) => {
            const isMe = msg.user.id === currentUserId

            return (
              <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                <Avatar className="size-8 border border-border/50 shadow-sm shrink-0">
                  <AvatarImage src={msg.user.image || undefined} />
                  <AvatarFallback className="text-[10px] font-bold bg-muted">{getInitials(msg.user.name)}</AvatarFallback>
                </Avatar>
                
                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[80%]`}>
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    {isMe ? "You" : msg.user.name}
                  </p>
                  <div className={`mt-1 text-sm px-3 py-2 rounded-xl shadow-sm border border-border/40 ${
                    isMe 
                      ? "bg-orange/10 text-foreground rounded-tr-sm" 
                      : "bg-muted/30 text-foreground/90 rounded-tl-sm"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* IN-LINE INPUT AREA */}
      <div className="p-3 border-t border-border/50 bg-card">
        <div className="relative flex items-center">
          <Button variant="ghost" size="icon" className="absolute left-1 hover:bg-muted/50 z-10" disabled={disabled}>
            <Paperclip className="size-4 text-muted-foreground" />
          </Button>

          <Input 
            className="pl-10 pr-12 h-11 rounded-xl bg-muted/20 border-border/50 focus-visible:ring-orange/30" 
            placeholder={disabled ? "You must be a member to chat." : `Message ${hiveName}...`} 
            disabled={disabled || isPending}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />

          <Button 
            disabled={disabled || isPending || !content.trim()} 
            onClick={handleSend}
            className="absolute right-1 size-9 bg-orange text-white hover:bg-orange/90 rounded-lg shadow-sm z-10"
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </Button>
        </div>
      </div>
    </>
  )
}