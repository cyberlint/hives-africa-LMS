"use client"

import { useState, useTransition, useEffect } from "react" // <-- Added useEffect
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  User, Users, Check,
  Loader2, ArrowRight, ChevronLeft
} from "lucide-react"
import { joinActivity, commitHiveToActivity } from "../../community/actions.activity"
import { toast } from "sonner"

interface HiveOption {
  slug: string
  name: string
  memberCount: number
  role: string
}

interface RegistrationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activity: {
    id: string
    title: string
    slug: string
    allowSolo: boolean
    allowHive: boolean
    minHiveSize: number | null
    maxHiveSize: number | null
  }
  eligibleHives: HiveOption[]
}

export default function ActivityRegistrationModal({
  open,
  onOpenChange,
  activity,
  eligibleHives
}: RegistrationModalProps) {

  const [step, setStep] = useState<"choice" | "hive-select">("choice")
  const [selectedHiveSlug, setSelectedHiveSlug] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // NEW: Auto-select the first eligible team to save the user a click
  useEffect(() => {
    if (step === "hive-select" && eligibleHives.length > 0 && !selectedHiveSlug) {
      const firstValidHive = eligibleHives.find(hive => {
        const tooSmall = !!(activity.minHiveSize && hive.memberCount < activity.minHiveSize)
        const tooLarge = !!(activity.maxHiveSize && hive.memberCount > activity.maxHiveSize)
        return !tooSmall && !tooLarge
      })
      
      if (firstValidHive) {
        setSelectedHiveSlug(firstValidHive.slug)
      }
    }
  }, [step, eligibleHives, activity, selectedHiveSlug])

  const handleSoloJoin = () => {
    startTransition(async () => {
      const res = await joinActivity(activity.slug)
      if (res.success) {
        toast.success("You're in the Arena.")
        onOpenChange(false)
      } else {
        toast.error(res.error || "Could not join.")
      }
    })
  }

  const handleHiveCommit = () => {
    if (!selectedHiveSlug) return
    startTransition(async () => {
      const res = await commitHiveToActivity(activity.id, selectedHiveSlug)
      if (res.success) {
        toast.success("Team registered successfully.")
        onOpenChange(false)
      } else {
        toast.error(res.error || "Could not register team.")
      }
    })
  }

  // If modal is closed, reset the step back to choice for the next time it opens
  useEffect(() => {
    if (!open) {
      setTimeout(() => setStep("choice"), 300) // wait for exit animation
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-2xl border border-border shadow-xl">

        {/* HEADER */}
        <div className="px-6 py-5 border-b bg-gradient-to-b from-muted/40 to-transparent">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">
              Enter the Arena
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              {activity.title}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* BODY */}
        <div className="p-6">

          {step === "choice" ? (
            <div className="space-y-3">

              {/* SOLO */}
              <button
                disabled={!activity.allowSolo}
                onClick={handleSoloJoin}
                className={`w-full group flex items-center justify-between p-4 rounded-xl border transition-all text-left
                  ${activity.allowSolo
                    ? "bg-card hover:bg-muted/50 hover:border-blue-500/40"
                    : "opacity-40 cursor-not-allowed border-dashed bg-muted/20"}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition">
                    <User className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Go solo</p>
                    <p className="text-xs text-muted-foreground">
                      Work independently and own your outcome
                    </p>
                  </div>
                </div>

                {activity.allowSolo && (
                  <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition" />
                )}
              </button>

              {/* TEAM */}
              <button
                disabled={!activity.allowHive || eligibleHives.length === 0}
                onClick={() => setStep("hive-select")}
                className={`w-full group flex items-center justify-between p-4 rounded-xl border transition-all text-left
                  ${activity.allowHive && eligibleHives.length > 0
                    ? "bg-card hover:bg-orange/5 hover:border-orange/40"
                    : "opacity-40 cursor-not-allowed border-dashed bg-muted/20"}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-orange/10 text-orange group-hover:bg-orange group-hover:text-white transition">
                    <Users className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Join with a team</p>
                    <p className="text-xs text-muted-foreground">
                      Participate with your group
                    </p>
                  </div>
                </div>

                {(activity.allowHive && eligibleHives.length > 0) && (
                  <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition" />
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">

              {/* TOP BAR */}
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Select a team
                </p>
                <Badge variant="outline" className="text-xs">
                  {activity.minHiveSize || 1}–{activity.maxHiveSize || "∞"} members
                </Badge>
              </div>

              {/* LIST */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {eligibleHives.map((hive) => {
                  const tooSmall = !!(activity.minHiveSize && hive.memberCount < activity.minHiveSize)
                  const tooLarge = !!(activity.maxHiveSize && hive.memberCount > activity.maxHiveSize)
                  const disabled = tooSmall || tooLarge

                  return (
                    <button
                      key={hive.slug}
                      disabled={disabled}
                      onClick={() => setSelectedHiveSlug(hive.slug)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left
                        ${selectedHiveSlug === hive.slug
                          ? "border-orange bg-orange/5 ring-1 ring-orange/30"
                          : "bg-muted/20 hover:bg-muted/40"}
                        ${disabled ? "opacity-40 cursor-not-allowed" : ""}
                      `}
                    >
                      <div>
                        <p className="text-sm font-semibold">{hive.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {hive.memberCount} members • {hive.role}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {tooSmall && (
                          <Badge variant="destructive" className="text-[10px]">Too small</Badge>
                        )}
                        {tooLarge && (
                          <Badge variant="destructive" className="text-[10px]">Too large</Badge>
                        )}
                        {selectedHiveSlug === hive.slug && (
                          <Check className="size-4 text-orange" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setStep("choice")}
                  className="flex-1"
                >
                  <ChevronLeft className="size-4 mr-1" />
                  Back
                </Button>

                <Button
                  disabled={!selectedHiveSlug || isPending}
                  onClick={handleHiveCommit}
                  className="flex-1 bg-orange text-white hover:bg-orange/90"
                >
                  {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Confirm"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-3 border-t bg-muted/20">
          <p className="text-[11px] text-muted-foreground">
            Your contribution and rewards will be tracked automatically.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}