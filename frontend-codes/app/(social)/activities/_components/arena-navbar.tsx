"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Trophy, Zap, Users, Menu, X } from "lucide-react"

const navItems = [
  { label: "Arena", href: "/activities", icon: Trophy },
  { label: "Hives", href: "/community/hives", icon: Users },
  { label: "Dashboard", href: "/dashboard", icon: Zap },
]

export default function ArenaNavbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* TOP NAV */}
      <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">

          {/* LEFT: Mobile Menu + Logo */}
          <div className="flex items-center gap-3">
            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition"
            >
              <Menu className="size-5" />
            </button>

            {/* LOGO */}
            <Link href="/community">
              <Image
                src="/assets/NextHive Logo.png"
                alt="NextHive"
                width={100}
                height={28}
                className="h-6 sm:h-7 w-auto object-contain dark:invert"
              />
            </Link>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all",
                    isActive
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* DESKTOP CTA */}
          <div className="hidden md:flex">
            <Button
              asChild
              size="sm"
              className="rounded-full bg-orange text-white hover:bg-orange/90 px-4"
            >
              <Link href="/community/hives">
                Join Squad
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      {open && (
        <div className="fixed inset-0 z-50 flex">

          {/* OVERLAY */}
          <div
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* SIDEBAR PANEL */}
          <div className="w-[80%] max-w-xs bg-background border-l border-border/40 p-5 flex flex-col">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
              <Image
                src="/assets/NextHive Logo.png"
                alt="NextHive"
                width={100}
                height={28}
                className="h-6 w-auto object-contain dark:invert"
              />
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* NAV ITEMS */}
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href)
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all",
                      isActive
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="size-5" />
                    {item.label}
                  </Link>
                )
              })}
            </div>

            {/* CTA */}
            <div className="mt-auto pt-6">
              <Button
                asChild
                className="w-full rounded-xl bg-orange text-white hover:bg-orange/90"
              >
                <Link href="/community/hives" onClick={() => setOpen(false)}>
                  Join Squad
                </Link>
              </Button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}