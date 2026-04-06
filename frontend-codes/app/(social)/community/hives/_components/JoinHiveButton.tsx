"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Lock, ShieldAlert } from "lucide-react"
import { joinPublicHive } from "../../actions.hive"
import { toast } from "sonner";

interface JoinHiveButtonProps {
  hiveId: string
  isPrivate: boolean
  isRecruiting: boolean
}

export default function JoinHiveButton({ hiveId, isPrivate, isRecruiting }: JoinHiveButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleJoin = () => {
    startTransition(async () => {
      const res = await joinPublicHive(hiveId)
      if (res?.error) {
        toast.error(res.error)
        alert(res.error) 
      }
    })
  }

  // If Private, show disabled lock button
  if (isPrivate) {
    return (
      <Button disabled className="w-full font-bold bg-muted text-muted-foreground h-10 border border-border cursor-not-allowed">
        <Lock className="size-3.5 mr-2" /> Private (Invite Only)
      </Button>
    )
  }

  // If Not Recruiting, show disabled state
  if (!isRecruiting) {
    return (
      <Button disabled className="w-full font-bold bg-muted text-muted-foreground h-10 border border-border cursor-not-allowed">
        <ShieldAlert className="size-3.5 mr-2" /> Not Recruiting
      </Button>
    )
  }

  return (
    <Button 
      onClick={handleJoin} 
      disabled={isPending} 
      className="w-full font-bold bg-foreground text-background hover:bg-foreground/90 h-10 shadow-sm"
    >
      {isPending ? (
        <><Loader2 className="size-4 mr-2 animate-spin" /> Joining...</>
      ) : (
        "Join Hive Now"
      )}
    </Button>
  )
}