"use client"

import { useState, useTransition, useRef } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ImageIcon, Link as LinkIcon, Trophy, Briefcase, Loader2, X, FileVideo } from "lucide-react"

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

interface PostComposerModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  user: ComposerUserContext
}

export default function PostComposerModal({ open, onOpenChange, user }: PostComposerModalProps) {
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form State
  const [signalType, setSignalType] = useState<SignalPayload["type"]>("DISCUSSION")
  const [content, setContent] = useState("")
  const [bountyStake, setBountyStake] = useState<number | "">("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Proof State
  const [showProofSelector, setShowProofSelector] = useState(false)
  const [selectedProofId, setSelectedProofId] = useState<string | null>(null)

  // Media Upload State
  const [isUploading, setIsUploading] = useState(false)
  const [mediaKey, setMediaKey] = useState<string | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null)

  // --- HANDLERS ---

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Pre-validate file size (e.g., max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors({ media: "File size must be under 10MB." })
      return
    }

    setIsUploading(true)
    setErrors(prev => ({ ...prev, media: "" }))

    try {
      // 1. Get Presigned URL from your API
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

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to get upload URL")
      }

      const { presignedUrl, key } = await res.json()

      // 2. Upload directly to S3
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      })

      if (!uploadRes.ok) throw new Error("Failed to upload to S3")

      // 3. Save to state
      setMediaKey(key)
      setMediaType(isImage ? "image" : "video")
      // Create a local object URL for instant preview without waiting for S3 propagation
      setMediaPreview(URL.createObjectURL(file))
      
    } catch (error: any) {
      console.error("Upload error:", error)
      setErrors({ media: error.message || "Failed to upload file." })
    } finally {
      setIsUploading(false)
      // Reset input so the user can select the same file again if they delete it
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleRemoveMedia = async () => {
    if (!mediaKey) return

    // Optimistically clear the UI
    const keyToDelete = mediaKey
    setMediaKey(null)
    setMediaPreview(null)
    setMediaType(null)

    // Fire and forget the delete request to your API
    try {
      await fetch("/api/s3/delete-public", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: keyToDelete }),
      })
    } catch (error) {
      console.error("Failed to delete media from S3:", error)
    }
  }

  const handleClose = () => {
    // Optional: Clean up orphaned S3 files if they close the modal without publishing
    if (mediaKey && !isPending) {
      handleRemoveMedia()
    }
    // Reset states
    setContent("")
    setSelectedProofId(null)
    setShowProofSelector(false)
    setSignalType("DISCUSSION")
    setBountyStake("")
    setErrors({})
    onOpenChange(false)
  }

  const handleSubmit = () => {
    setErrors({})

    if (signalType === "HELP_NEEDED" && Number(bountyStake) > user.totalRep) {
      setErrors({ bountyStake: `You only have ${user.totalRep} Rep.` })
      return
    }

    // Build payload including the media key!
    const payload = {
      content,
      type: signalType,
      portfolioItemId: selectedProofId || undefined,
      bountyStake: signalType === "HELP_NEEDED" ? Number(bountyStake) : undefined,
      mediaKey: mediaKey || undefined, // Ensure your Zod schema accepts this!
    }

    const validated = CreateSignalSchema.safeParse(payload)
    if (!validated.success) {
      const formatted: Record<string, string> = {}
      validated.error.issues.forEach(i => {
        formatted[i.path[0]] = i.message
      })
      setErrors(formatted)
      return
    }

    startTransition(async () => {
      const result = await createSignal(validated.data)

      if (result?.error) {
        setErrors({ server: result.error })
      } else {
        // Success cleanup
        setMediaKey(null)
        setMediaPreview(null)
        setMediaType(null)
        setContent("")
        setSelectedProofId(null)
        setShowProofSelector(false)
        setSignalType("DISCUSSION")
        setBountyStake("")
        onOpenChange(false)
      }
    })
  }

  const selectedProofTitle =
    user.portfolioItems?.find(p => p.id === selectedProofId)?.title || "Attached Output"

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose()
      else onOpenChange(true)
    }}>
      <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden border border-border rounded-2xl bg-card shadow-xl">
        <DialogTitle className="sr-only">Create Signal</DialogTitle>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*,video/mp4,video/webm" 
          onChange={handleFileUpload} 
        />

        {/* ================= HEADER ================= */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-border/50">
          <div className="flex items-center gap-3">
            <Avatar className="size-11">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>

            <div>
              <p className="text-sm font-semibold text-foreground">{user.name}</p>
              <select
                value={signalType}
                onChange={(e) => setSignalType(e.target.value as SignalPayload["type"])}
                disabled={isPending || isUploading}
                className="mt-1 text-xs bg-transparent text-muted-foreground font-medium outline-none cursor-pointer hover:text-foreground"
              >
                {SIGNAL_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ================= ERRORS ================= */}
        {errors.server && (
          <div className="mx-5 mt-3 text-xs text-red-500 font-medium">
            {errors.server}
          </div>
        )}
        {errors.media && (
          <div className="mx-5 mt-3 p-2 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-lg">
            {errors.media}
          </div>
        )}

        {/* ================= BODY ================= */}
        <div className="px-5 py-4 flex flex-col gap-4">
          <textarea
            autoFocus
            disabled={isPending || isUploading}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              signalType === "HELP_NEEDED"
                ? "What are you stuck on?"
                : signalType === "SHOWCASE"
                ? "What did you build?"
                : "Share proof of work..."
            }
            className="w-full min-h-[100px] resize-none bg-transparent text-base outline-none placeholder:text-muted-foreground/60"
          />
          {errors.content && (
            <p className="text-xs text-red-500">{errors.content}</p>
          )}

          {/* MEDIA PREVIEW */}
          {isUploading && (
            <div className="w-full h-32 rounded-xl bg-muted/30 flex flex-col items-center justify-center border border-dashed border-border text-muted-foreground">
              <Loader2 className="size-6 animate-spin mb-2" />
              <span className="text-xs font-semibold">Uploading media...</span>
            </div>
          )}

          {mediaPreview && !isUploading && (
            <div className="relative w-full rounded-xl overflow-hidden border border-border bg-muted/10 group">
              <Button 
                variant="destructive" 
                size="icon" 
                className="absolute top-2 right-2 size-7 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={handleRemoveMedia}
                disabled={isPending}
              >
                <X className="size-4" />
              </Button>
              
              {mediaType === "image" ? (
                <img src={mediaPreview} alt="Upload preview" className="w-full max-h-80 object-contain" />
              ) : (
                <div className="relative w-full max-h-80 bg-black flex items-center justify-center">
                  <video src={mediaPreview} controls className="w-full max-h-80" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================= BOUNTY ================= */}
        {signalType === "HELP_NEEDED" && (
          <div className="mx-5 mb-4 p-4 rounded-xl bg-muted/20 border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="size-5 text-yellow-500" />
              <div>
                <p className="text-xs font-semibold text-foreground">Bounty</p>
                <p className="text-[10px] text-muted-foreground">
                  Balance: {user.totalRep.toLocaleString()} Rep
                </p>
                {errors.bountyStake && (
                  <p className="text-[10px] text-red-500">{errors.bountyStake}</p>
                )}
              </div>
            </div>

            <Input
              type="number"
              placeholder="50"
              value={bountyStake}
              onChange={(e) =>
                setBountyStake(e.target.value ? Number(e.target.value) : "")
              }
              className="w-24 h-9 text-sm"
              disabled={isPending || isUploading}
            />
          </div>
        )}

        {/* ================= PROOF SELECTOR ================= */}
        {showProofSelector && !selectedProofId && (
          <div className="mx-5 mb-4 p-4 rounded-xl border border-border bg-muted/20">
            <div className="flex justify-between mb-2">
              <p className="text-xs font-semibold">Attach Proof</p>
              <Button variant="ghost" size="icon" className="size-6" onClick={() => setShowProofSelector(false)}>
                <X className="size-4" />
              </Button>
            </div>

            <select
              className="w-full text-sm bg-card border border-border rounded-md p-2"
              onChange={(e) => setSelectedProofId(e.target.value)}
              defaultValue=""
              disabled={isPending || isUploading}
            >
              <option value="" disabled>Select item</option>
              {user.portfolioItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.title || "Untitled"}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ================= ATTACHED PROOF ================= */}
        {selectedProofId && (
          <div className="mx-5 mb-4 flex items-center justify-between p-3 rounded-xl bg-orange/5 border border-orange/30">
            <div className="flex items-center gap-2">
              <Briefcase className="size-4 text-orange" />
              <span className="text-xs font-semibold">{selectedProofTitle}</span>
            </div>

            <Button size="sm" variant="ghost" onClick={() => setSelectedProofId(null)} disabled={isPending || isUploading}>
              Remove
            </Button>
          </div>
        )}

        {/* ================= FOOTER ================= */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-muted/5">
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending || isUploading || mediaKey !== null}
              className={mediaKey ? "opacity-50" : ""}
            >
              <ImageIcon className="size-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              disabled={selectedProofId !== null || isPending || isUploading}
              onClick={() => setShowProofSelector(true)}
              className="text-xs"
            >
              <LinkIcon className="size-3.5 mr-1" />
              Attach
            </Button>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isPending || isUploading}
            className="rounded-full px-6 font-semibold bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Publishing
              </>
            ) : (
              "Publish"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}