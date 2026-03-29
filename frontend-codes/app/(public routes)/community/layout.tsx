"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, Users, Calendar, Bell, Search, MessageSquareText } from "lucide-react"

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [showNotifications, setShowNotifications] = useState(false)

  const navItems = [
    { label: "Home", href: "/community", icon: Home },
    { label: "Squads", href: "/community/groups", icon: Users },
    { label: "Ops & Events", href: "/community/events", icon: Calendar },
    { label: "Messaging", href: "/community/messages", icon: MessageSquareText },
  ]

  return (
    <div className="min-h-screen bg-muted/20">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-[1280px] mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Logo & Global Search */}
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <Link href="/community" className="font-bold text-xl tracking-tighter flex items-center gap-2">
              <span className="size-8 rounded-md bg-foreground flex items-center justify-center">
                <span className="text-background text-sm font-black">N</span>
              </span>
              <span className="hidden md:block">NextHive</span>
            </Link>

            <div className="relative w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search peers, squads, or events..."
                className="pl-9 h-10 bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:ring-orange/30 rounded-full"
              />
            </div>
          </div>

          {/* Central Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Button key={item.href} asChild variant="ghost" className={`h-16 rounded-none border-b-2 px-4 ${
                  isActive ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}>
                  <Link href={item.href} className="flex flex-col items-center justify-center gap-1">
                    <Icon className="size-5" />
                    <span className="text-[10px] font-medium hidden lg:block">{item.label}</span>
                  </Link>
                </Button>
              )
            })}
          </nav>

          {/* Right Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-full relative" onClick={() => setShowNotifications(!showNotifications)}>
                <Bell className="size-5" />
                <span className="absolute top-1.5 right-1.5 size-2 bg-orange rounded-full border-2 border-card" />
              </Button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg p-4 space-y-3 z-50">
                  <p className="text-sm font-semibold">Notifications</p>
                  <div className="p-2 hover:bg-muted/50 rounded-lg cursor-pointer">
                    <p className="text-sm text-foreground">Sarah Jenkins mentioned you</p>
                    <p className="text-xs text-muted-foreground mt-1">10m ago</p>
                  </div>
                </div>
              )}
            </div>

            <div className="h-8 w-px bg-border hidden sm:block" />

            <Avatar className="size-8 cursor-pointer border border-border">
              <AvatarImage src="/ai.png" />
              <AvatarFallback>KO</AvatarFallback>
            </Avatar>
          </div>

        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 py-6">
        {children}
      </main>

    </div>
  )
}