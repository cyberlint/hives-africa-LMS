"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Home,
  Users,
  Calendar,
  Bell,
  MessageSquareText,
  GraduationCap
} from "lucide-react"

import SearchBar from "./SearchBar"
import { UserButton } from "@/components/auth/user-button"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function SocialNavbar() {
  const pathname = usePathname()
  const [showNotifications, setShowNotifications] = useState(false)

  const navItems = [
    { label: "Home", href: "/community", icon: Home },
    { label: "Hives", href: "/community/hives", icon: Users },
    { label: "Events", href: "/community/events", icon: Calendar },
    { label: "Inbox", href: "/community/messages", icon: MessageSquareText },
  ]

  return (
    <>
      {/* ================= TOP NAV (DESKTOP + MOBILE HEADER) ================= */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* LEFT: Logo + Search */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <Link href="/community" className="hover:scale-[1.02] transition-transform">
              <Image
                src="/assets/NextHive Logo.png"
                alt="NextHive"
                width={110}
                height={32}
                className="h-7 w-auto object-contain dark:invert"
              />
            </Link>

            {/* Search (hidden on small mobile) */}
            <SearchBar />
          </div>

          {/* CENTER NAV (desktop only) */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-200 group
                    ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}
                  `}
                >
                  <Icon className="size-5" />

                  <span className="text-[10px] font-bold tracking-wide hidden lg:block">
                    {item.label}
                  </span>

                  <span
                    className={`absolute -bottom-[10px] h-[2px] w-6 rounded-full transition-all
                      ${isActive ? "bg-orange" : "bg-transparent group-hover:bg-border"}
                    `}
                  />
                </Link>
              )
            })}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3 sm:gap-5">

            {/* LEARNING CTA */}
            <Link
              href="/dashboard"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-orange text-white text-xs font-bold hover:scale-[1.03] transition-transform shadow-md shadow-orange/20"
            >
              <GraduationCap className="size-4" />
              Learn
            </Link>

            {/*THEME TOGGLE*/}
            <ThemeToggle />
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <Bell className="size-5" />
                <span className="absolute top-1 right-1 size-2 bg-orange rounded-full border-2 border-background animate-pulse" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-72 bg-card border border-border rounded-2xl shadow-xl p-4 space-y-3 z-[999]">
                  <p className="text-sm font-bold">Notifications</p>

                  <div className="p-3 hover:bg-muted/40 rounded-xl cursor-pointer">
                    <p className="text-sm text-foreground">
                      Chinedu mentioned you in a Yoruba AI session
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">10m ago</p>
                  </div>
                </div>
              )}
            </div>

            <div className="h-8 w-px bg-border hidden sm:block" />

            {/* Profile */}
            <UserButton />
          </div>
        </div>
      </header>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-[999] md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
        <div className="flex items-center justify-around h-16 relative">

          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center text-[10px] font-bold transition-all
                  ${isActive ? "text-orange" : "text-muted-foreground"}
                `}
              >
                <Icon className="size-5 mb-0.5" />
                {item.label}
              </Link>
            )
          })}

          {/* CENTER FLOAT (LEARNING) */}
          <Link
            href="/dashboard"
            className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center"
          >
            <div className="bg-orange text-white p-3 rounded-full shadow-lg shadow-orange/30">
              <GraduationCap className="size-5" />
            </div>
            <span className="text-[10px] font-bold mt-1 text-orange">
              Learn
            </span>
          </Link>
        </div>
      </nav>

      {/* IMPORTANT: prevents content from being hidden behind bottom nav */}
      <div className="h-20 md:hidden" />
    </>
  )
}