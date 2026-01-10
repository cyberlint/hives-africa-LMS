"use client"

import { ReactNode } from "react"
import { DashboardProvider } from "@/app/(private routes)/dashboard/studentContext"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardProvider>{children}</DashboardProvider>
}
