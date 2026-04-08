"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Zap, CheckCircle2, Lock, Users, Loader2 } from "lucide-react"
import ActivityRegistrationModal from "./ActivityRegistrationModal"
import { joinActivity } from "../../community/actions.activity"
import { toast } from "sonner"

interface JoinArenaTriggerProps {
  activity: {
    id: string
    title: string
    slug: string
    allowSolo: boolean
    allowHive: boolean
    minHiveSize: number | null
    maxHiveSize: number | null
  }
  eligibleHives: any[]
  myParticipation: any      
  myCommittedHives: any[]
}

export default function JoinArenaTrigger({ 
  activity, 
  eligibleHives, 
  myParticipation,
  myCommittedHives
}: JoinArenaTriggerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // ================= 1. ALREADY JOINED =================
  if (myParticipation) {
    const isSolo = !myParticipation.hiveId

    return (
      <div className="space-y-2">
        <Button 
          disabled 
          className="w-full h-auto py-2.5 flex-col gap-1 rounded-xl bg-green-500/10 text-green-600 border border-green-500/20 cursor-default opacity-100"
        >
          <div className="flex items-center font-semibold">
            <CheckCircle2 className="mr-2 size-4" />
            You're in
          </div>
          <span className="text-[10px] font-medium opacity-80">
            {isSolo ? "Participating Solo" : `Participating with ${myParticipation.hive?.name}`}
          </span>
        </Button>

        <p className="text-[11px] text-center text-muted-foreground">
          Head to your workspace to continue
        </p>
      </div>
    )
  }

  // ================= 2. OPT-IN FLOW =================
  // If user is not participating, but their team is registered
  if (myCommittedHives?.length > 0) {
    const targetHive = myCommittedHives[0]

    const handleOptIn = () => {
      startTransition(async () => {
        const res = await joinActivity(activity.slug, targetHive.slug)
        if (res.success) {
          toast.success(`You joined ${targetHive.name}'s roster!`)
        } else {
          toast.error(res.error || "Failed to join team.")
        }
      })
    }

    return (
      <div className="space-y-2">
        <Button 
          disabled={isPending}
          onClick={handleOptIn}
          className="w-full h-12 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
        >
          {isPending ? <Loader2 className="size-5 animate-spin" /> : (
            <>
              <Users className="mr-2 size-4" />
              Opt-in to Team
            </>
          )}
        </Button>
        <p className="text-[11px] text-center text-muted-foreground">
          {targetHive.name} is waiting for you
        </p>
      </div>
    )
  }

  // ================= 3. DEFAULT STATE =================
  return (
    <>
      <div className="space-y-3">
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="w-full h-12 rounded-xl bg-orange text-white hover:bg-orange/90 font-semibold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
        >
          Join Activity
          <Zap className="ml-2 size-4 opacity-80" />
        </Button>

        {/* Constraint hint */}
        {!activity.allowSolo && (
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <Lock className="size-3" />
            Team participation required
          </div>
        )}
      </div>

      {/* Modal */}
      <ActivityRegistrationModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        activity={activity}
        eligibleHives={eligibleHives}
      />
    </>
  )
}