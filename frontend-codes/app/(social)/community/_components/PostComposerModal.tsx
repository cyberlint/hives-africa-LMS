"use client"

import { useState, useTransition, useRef } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ImageIcon, Link as LinkIcon, Trophy, Briefcase, Loader2, X } from "lucide-react"

import { createSignal } from "../actions.community"
import { CreateSignalSchema } from "@/lib/zodSchemas"
import { z } from "zod"

import { ComposerUserContext } from "./FeedComposer"

type SignalPayload = z.infer<typeof CreateSignalSchema>

const SIGNAL_OPTIONS: { value: SignalPayload["type"]; label: string }[] = [
  { value: "DISCUSSION", label: "Discussion" },
  { value: "SHOWCASE", label: "Showcase" },
  { value: "MILESTONE", label: "Milestone" },
  { value: "FIELD_NOTES", label: "Field Notes" },
  { value: "HELP_NEEDED", label: "Ask for Help" },
]

const getInitials = (name: string) =>
  name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()

export default function PostComposerModal({ open, onOpenChange, user }: {
  open: boolean
  onOpenChange: (v: boolean) => void
  user: ComposerUserContext
}) {
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [signalType, setSignalType] = useState<SignalPayload["type"]>("DISCUSSION")
  const [content, setContent] = useState("")
  const [bountyStake, setBountyStake] = useState<number | "">("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [showProofSelector, setShowProofSelector] = useState(false)
  const [selectedProofId, setSelectedProofId] = useState<string | null>(null)

  const [isUploading, setIsUploading] = useState(false)
  const [mediaKey, setMediaKey] = useState<string | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      setErrors({ media: "File must be under 10MB." })
      return
    }

    setIsUploading(true)
    try {
      const isImage = file.type.startsWith("image/")
      const res = await fetch("/api/s3/upload-public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage,
        }),
      })

      const { presignedUrl, key } = await res.json()

      await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      })

      setMediaKey(key)
      setMediaType(isImage ? "image" : "video")
      setMediaPreview(URL.createObjectURL(file))
    } catch (e: any) {
      setErrors({ media: "Upload failed." })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = () => {
    const payload = {
      content,
      type: signalType,
      portfolioItemId: selectedProofId || undefined,
      bountyStake: signalType === "HELP_NEEDED" ? Number(bountyStake) : undefined,
      mediaKey: mediaKey || undefined,
    }

    const validated = CreateSignalSchema.safeParse(payload)
    if (!validated.success) return

    startTransition(async () => {
      await createSignal(validated.data)
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 gap-0 border-0 bg-card rounded-3xl shadow-2xl">

        <DialogTitle className="sr-only">Create Signal</DialogTitle>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,video/*"
          onChange={handleFileUpload}
        />

        {/* HEADER */}
        <div className="px-5 pt-5 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>

            <div>
              <p className="text-sm font-semibold">{user.name}</p>
              <select
                value={signalType}
                onChange={(e) => setSignalType(e.target.value as SignalPayload["type"])}
                className="text-xs text-muted-foreground bg-transparent outline-none"
              >
                {SIGNAL_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="size-4" />
          </Button>
        </div>

        {/* BODY */}
        <div className="px-5 pb-4 space-y-4">

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your work..."
            className="w-full min-h-[120px] text-base bg-transparent outline-none placeholder:text-muted-foreground/50"
          />

          {/* MEDIA */}
          {isUploading && (
            <div className="h-32 flex items-center justify-center bg-muted/30 rounded-xl">
              <Loader2 className="animate-spin" />
            </div>
          )}

          {mediaPreview && (
            <div className="relative rounded-xl overflow-hidden">
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 z-10"
                onClick={() => setMediaPreview(null)}
              >
                <X className="size-4" />
              </Button>

              {mediaType === "image" ? (
                <img src={mediaPreview} className="w-full max-h-[300px] object-cover" />
              ) : (
                <video src={mediaPreview} controls className="w-full max-h-[300px]" />
              )}
            </div>
          )}

          {/* BOUNTY */}
          {signalType === "HELP_NEEDED" && (
            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl">
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="size-4 text-yellow-500" />
                <span>{user.totalRep} Rep</span>
              </div>

              <Input
                type="number"
                placeholder="Stake"
                value={bountyStake}
                onChange={(e) => setBountyStake(Number(e.target.value))}
                className="w-24"
              />
            </div>
          )}

          {/* PROOF */}
          {selectedProofId && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-orange/10">
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="size-4 text-orange" />
                Attached proof
              </div>
              <Button size="sm" variant="ghost" onClick={() => setSelectedProofId(null)}>
                Remove
              </Button>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t bg-muted/10">

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
              <ImageIcon className="size-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProofSelector(true)}
            >
              <LinkIcon className="size-4 mr-1" />
              Attach
            </Button>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full sm:w-auto rounded-full px-6 bg-orange text-white"
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Publish"}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  )
}