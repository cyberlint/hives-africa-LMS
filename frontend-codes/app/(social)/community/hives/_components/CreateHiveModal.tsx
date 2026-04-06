"use client"

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Loader2, Users, Lock, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { CreateHiveSchema } from "@/lib/zodSchemas"

// Import your server action
import { createHive } from "../../actions.hive"

interface CreateHiveModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateHiveModal({ open, onOpenChange }: CreateHiveModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = () => {
    // 1. Reset previous errors
    setErrors({})
    
    // 2. Client-side validation payload
    const payload = { name, description, isPrivate }
    const validated = CreateHiveSchema.safeParse(payload)

    if (!validated.success) {
      const formatted: Record<string, string> = {}
      validated.error.issues.forEach(i => { formatted[i.path[0]] = i.message })
      setErrors(formatted)
      return
    }

    // 3. Fire the server action
    startTransition(async () => {
      const res = await createHive(validated.data)
      
      if (res.error) {
        setErrors({ server: res.error })
      } else if (res.success && res.slug) {
        // 4. Success! Close modal, clear state, and redirect
        onOpenChange(false)
        setName("")
        setDescription("")
        setIsPrivate(false)
        
        router.push(`/community/hives/${res.slug}`)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isPending) onOpenChange(isOpen) // Prevent closing while loading
    }}>
      <DialogContent className="max-w-md rounded-2xl p-6 border-border bg-card shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black flex items-center gap-2">
            <Users className="size-5 text-orange" />
            Launch a Hive
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Create an autonomous skill cluster. Stake your reputation and start building a legacy.
          </p>
        </DialogHeader>

        {/* Global Server Errors (e.g., "Name already taken") */}
        {errors.server && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-lg mt-2">
            {errors.server}
          </div>
        )}

        <div className="space-y-5 mt-4">
          
          {/* Hive Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Hive Name</label>
            <Input 
              placeholder="e.g., Lagos Data Ops" 
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors(p => ({...p, name: ""})) }}
              disabled={isPending}
              className="h-10"
            />
            {errors.name && <p className="text-[10px] font-bold text-red-500">{errors.name}</p>}
          </div>

          {/* HIVE DESCRIPTION */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Mission & Focus</label>
            <textarea 
              placeholder="What are we building? Who should join our ranks?" 
              value={description}
              onChange={(e) => { setDescription(e.target.value); setErrors(p => ({...p, description: ""})) }}
              disabled={isPending}
              className="w-full h-24 text-sm bg-background border border-border/50 rounded-md p-3 outline-none focus:ring-1 focus:ring-orange/50 transition-shadow resize-none"
            />
            {errors.description && <p className="text-[10px] font-bold text-red-500">{errors.description}</p>}
          </div>

          {/* PRIVACY TOGGLE */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/20">
            <div>
              <p className="text-sm font-bold flex items-center gap-2 text-foreground">
                {isPrivate ? <Lock className="size-4 text-muted-foreground" /> : <Globe className="size-4 text-orange" />}
                {isPrivate ? "Private Treasury" : "Public Hive"}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[200px] leading-tight">
                {isPrivate 
                  ? "Only invited members can view the cap table and join." 
                  : "Anyone in the community can view and join this Hive."}
              </p>
            </div>
            <Switch checked={isPrivate} onCheckedChange={setIsPrivate} disabled={isPending} />
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="mt-6 flex justify-end gap-3">
          <Button 
            variant="ghost" 
            disabled={isPending} 
            onClick={() => {
              // Clear errors if they cancel and reopen later
              setErrors({})
              onOpenChange(false)
            }}
          >
            Cancel
          </Button>
          
          <Button 
            onClick={handleSubmit} 
            disabled={isPending || !name.trim() || !description.trim()} 
            className="font-bold bg-foreground text-background hover:bg-foreground/90 rounded-full px-6"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" /> 
                Staking Rep...
              </>
            ) : (
              "Launch Hive"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}