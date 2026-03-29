"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageIcon, Video, FileText, Globe } from "lucide-react"

export default function PostComposerModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl p-0 gap-0 overflow-hidden border-border bg-card shadow-lg">
        
        {/* FIX: Use Tailwind's sr-only class instead of the missing Radix package */}
        <DialogTitle className="sr-only">
          Create a post
        </DialogTitle>

        <div className="p-5 flex items-start gap-4">
          <Avatar className="size-12">
            <AvatarImage src="/ai.png" />
            <AvatarFallback>KO</AvatarFallback>
          </Avatar>
          <div className="flex-1 mt-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-foreground leading-none">Kenneth O.</p>
            </div>
            {/* Visibility Toggle */}
            <button className="flex items-center gap-1.5 mt-1.5 border border-border rounded-full px-2.5 py-0.5 text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors">
              <Globe className="size-3" /> Anyone
            </button>
          </div>
        </div>

        <div className="px-5 pb-4">
          <textarea
            autoFocus
            placeholder="What do you want to talk about? Just start typing..."
            className="w-full min-h-[160px] resize-none outline-none text-base bg-transparent text-foreground placeholder:text-muted-foreground/70"
          />
        </div>

        {/* Media Attachments Strip */}
        <div className="px-5 py-3 flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-muted hover:text-blue-500">
            <ImageIcon className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-muted hover:text-green-500">
            <Video className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-muted hover:text-orange">
            <FileText className="size-5" />
          </Button>
        </div>

        <div className="p-4 border-t border-border flex justify-end bg-muted/10">
          <Button className="rounded-full px-6 font-semibold bg-foreground text-background hover:bg-foreground/90">
            Post
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  )
}