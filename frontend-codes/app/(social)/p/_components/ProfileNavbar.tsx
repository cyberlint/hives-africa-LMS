"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  User,
  Briefcase,
  Award,
  Users,
  Bell,
  MessageSquareText,
  GraduationCap,
  ArrowLeft
} from "lucide-react"

import SearchBar from "../../community/_components/SearchBar"
import { UserButton } from "@/components/auth/user-button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProfileNavbarProps {
  userName: string;
  userImage?: string | null;
  userTier?: string;
}

export default function ProfileNavbar({ userName, userImage, userTier }: ProfileNavbarProps) {
  const pathname = usePathname()
  const [showNotifications, setShowNotifications] = useState(false)

  // Contextual items for a Profile Page
  const navItems = [
    { label: "Overview", href: "#overview", icon: User },
    { label: "Portfolio", href: "#portfolio", icon: Briefcase },
    { label: "Reputation", href: "#reputation", icon: Award },
    { label: "Hives", href: "#hives", icon: Users },
  ]

  return (
    <>
      {/* ================= TOP NAV ================= */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* LEFT: Back Button + User Identity */}
          <div className="flex items-center gap-3 flex-1">
            <Link 
              href="/community" 
              className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-5" />
            </Link>
            
            <div className="flex items-center gap-3">
               <Avatar className="size-8 border border-border sm:hidden">
                <AvatarImage src={userImage || undefined} />
                <AvatarFallback>{userName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-bold truncate max-w-[120px] sm:max-w-none">
                  {userName}
                </span>
                <span className="text-[10px] text-orange font-black uppercase tracking-tighter">
                  {userTier || "NextHive Builder"}
                </span>
              </div>
            </div>
          </div>

          {/* CENTER NAV (Desktop Profile Sections) */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 group"
                >
                  <Icon className="size-4" />
                  <span className="text-xs font-bold tracking-wide">
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {/* SEARCH (Now more compact for profile view) */}
            <div className="hidden lg:block">
               <SearchBar />
            </div>

            <ThemeToggle />
            
            {/* Notifications (Global context preserved) */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <Bell className="size-5" />
              </button>
              {/* Notification dropdown remains same as your original */}
            </div>

            <div className="h-6 w-px bg-border hidden sm:block" />
            <UserButton />
          </div>
        </div>
      </header>

      {/* ================= MOBILE BOTTOM NAV (Profile Specific) ================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-[999] md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
        <div className="flex items-center justify-around h-16 relative">

          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center text-[10px] font-bold text-muted-foreground hover:text-orange transition-all"
              >
                <Icon className="size-5 mb-0.5" />
                {item.label}
              </Link>
            )
          })}

          {/* CENTER FLOAT (Direct Message / Interaction) */}
          <Link
            href="/community/messages"
            className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center"
          >
            <div className="bg-foreground text-background p-3 rounded-full shadow-lg">
              <MessageSquareText className="size-5" />
            </div>
            <span className="text-[10px] font-bold mt-1 text-foreground">
              Contact
            </span>
          </Link>
        </div>
      </nav>
    </>
  )
}