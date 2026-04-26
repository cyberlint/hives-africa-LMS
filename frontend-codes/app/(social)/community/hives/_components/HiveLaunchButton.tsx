"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShieldPlus } from "lucide-react"
import CreateHiveModal from "./CreateHiveModal"

interface HiveLaunchButtonProps {
  orgSlug?: string; // Optional: used when launching from an Org dashboard
}

export default function HiveLaunchButton({ orgSlug }: HiveLaunchButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="w-full sm:w-auto h-11 px-6 rounded-full font-semibold border-orange text-orange hover:bg-orange/10 transition-colors shadow-sm"
      >
        <ShieldPlus className="size-4 mr-2" />
        Launch a Hive (-500 Rep)
      </Button>

      {/* Pass the orgSlug into the modal */}
      <CreateHiveModal
        open={open} 
        onOpenChange={setOpen} 
        predefinedOrgSlug={orgSlug} 
      />
    </>
  )
}