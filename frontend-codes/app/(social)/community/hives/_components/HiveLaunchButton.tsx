"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShieldPlus } from "lucide-react"
import CreateHiveModal from "./CreateHiveModal"

export default function HiveLaunchButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="w-full sm:w-auto h-11 px-6 rounded-full font-semibold border-orange text-orange hover:bg-orange/10 transition-colors"
      >
        <ShieldPlus className="size-4 mr-2" />
        Launch a Hive (-500 Rep)
      </Button>

      {/* Renders the modal only when open is true */}
      <CreateHiveModal open={open} onOpenChange={setOpen} />
    </>
  )
}