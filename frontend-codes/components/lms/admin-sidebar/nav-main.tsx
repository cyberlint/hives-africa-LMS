"use client"

import { useState } from "react"
import Link from "next/link"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { Icon } from "@tabler/icons-react"
import { IconCirclePlusFilled } from "@tabler/icons-react"

import CreateHiveModal from "@/app/(social)/community/hives/_components/CreateHiveModal"

export function NavMain({
  orgSlug,
  items,
}: {
  orgSlug?: string
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">

          {/* ================= CREATE HIVE BUTTON ================= */}
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                onClick={() => setOpen(true)}
                tooltip="Create Hive"
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              >
                <IconCirclePlusFilled />
                <span>Create Hive</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* ================= NAV ITEMS ================= */}
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild>
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

        </SidebarGroupContent>
      </SidebarGroup>

      {/* ================= HIVE MODAL ================= */}
      <CreateHiveModal
        open={open}
        onOpenChange={setOpen}
        predefinedOrgSlug={orgSlug}
      />
    </>
  )
}