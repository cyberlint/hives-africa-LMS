"use client"

import type React from "react"

import { useState } from "react"
import { Bell, Search, ShoppingCart, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDashboard } from "@/app/(private routes)/(student)/studentContext"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/CartContext"
import Image from "next/image"



export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)

  const { activeTab, handleTabChange, handleCartClick } = useDashboard()
  const { data: session } = authClient.useSession() // Use Better Auth
  const router = useRouter()
  const { items: cartItems } = useCart()
  
  // Use session data or fallback
  const user = session?.user || {
    name: "Guest User",
    email: "guest@example.com",
    image: "/ai.png",
  }

  const handleNotificationClick = (notification: string) => {
    console.log("Notification clicked:", notification)
    // Add toast notification here if needed
  }

  const handleCartNavigate = () => {
    router.push("/cart")
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery)
      // Implement search functionality here
    }
  }

  return (
    <header className="bg-white dark:bg-[#1d2026] border-b border-gray-200 dark:border-[#0a0f19] sticky top-0 z-40 shadow-sm transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image
              src="/assets/Analytix Hive Logo(transparent).png"
              alt="Analytix Hive Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden sm:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-600 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-white dark:bg-[#0a0f19] text-gray-900 dark:text-white border-gray-300 dark:border-[#2a3547] focus:border-[#fdb606] focus:ring-[#fdb606] dark:focus:border-[#fdb606] dark:focus:ring-[#fdb606]/50 transition-colors"
              />
            </form>
          </div>

          {/* Mobile Search Toggle */}
          <div className="sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="relative hover:bg-gray-100 dark:hover:bg-[#0a0f19] transition-colors"
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* <Link href="/signin">
              <Button variant="ghost" className="text-sm font-medium">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#FDB606] hover:bg-[#fd9a06] text-white text-sm font-medium">
                Sign Up
              </Button>
            </Link> */}
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-gray-100 dark:hover:bg-[#0a0f19] transition-colors"
                  aria-label="View notifications"
                >
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white dark:bg-[#1d2026] border-gray-200 dark:border-[#2a3547]">
                <div className="p-4 border-b border-gray-200 dark:border-[#2a3547]">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                </div>
                <DropdownMenuItem
                  className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#0a0f19] text-gray-900 dark:text-gray-300 transition-colors"
                  onClick={() => handleNotificationClick("course-available")}
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">New course available</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Advanced React Patterns is now live</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#0a0f19] text-gray-900 dark:text-gray-300 transition-colors"
                  onClick={() => handleNotificationClick("course-completed")}
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Course completed</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Congratulations on finishing UI/UX Design</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#0a0f19] text-gray-900 dark:text-gray-300 transition-colors"
                  onClick={() => handleNotificationClick("price-drop")}
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Price drop alert</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Python for Data Science is now 50% off</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Shopping Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-gray-100 dark:hover:bg-[#0a0f19] transition-colors"
              onClick={handleCartNavigate}
              aria-label="View shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItems.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#fdb606] text-white text-xs">
                  {cartItems.length}
                </Badge>
              )}
            </Button>

            {/* User Profile with Navigation */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-[#0a0f19] transition-colors"
                  aria-label="User menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block font-medium text-gray-900 dark:text-white">{user.name}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-[#1d2026] border-gray-200 dark:border-[#2a3547]">
                {/* User Info */}
                <div className="px-3 py-2 border-b border-gray-200 dark:border-[#2a3547]">
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-600">{user.email}</p>
                </div>

                {/* Main Navigation */}
                <div className="py-1">
                  <DropdownMenuItem
                    className={cn(
                      "cursor-pointer",
                      activeTab === "dashboard" ? "bg-[#fdb606]/10 text-[#fdb606]" : "hover:bg-gray-50 dark:hover:bg-[#0a0f19] text-gray-900 dark:text-gray-300",
                    )}
                    asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className={cn(
                      "cursor-pointer",
                      activeTab === "learning" ? "bg-[#fdb606]/10 text-[#fdb606]" : "hover:bg-gray-50 dark:hover:bg-[#0a0f19] text-gray-900 dark:text-gray-300",
                    )}
                    asChild>
                    <Link href="/learning" className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      My Learning
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className={cn(
                      "cursor-pointer",
                      activeTab === "wishlist" ? "bg-[#fdb606]/10 text-[#fdb606]" : "hover:bg-gray-50 dark:hover:bg-[#0a0f19] text-gray-900 dark:text-gray-300",
                    )}
                    asChild>
                    <Link href="/wishlist" className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Wishlist
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className={cn(
                      "cursor-pointer",
                      activeTab === "courses" ? "bg-[#fdb606]/10 text-[#fdb606]" : "hover:bg-gray-50 dark:hover:bg-[#0a0f19] text-gray-900 dark:text-gray-300",
                    )}
                    asChild>
                    <Link href="/courses" className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View All Courses
                    </Link>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#2a3547]" />

                {/* Account Section */}
                <div className="py-1">
                  <DropdownMenuItem
                    className={cn(
                      "cursor-pointer",
                      activeTab === "purchases" ? "bg-[#fdb606]/10 text-[#fdb606]" : "hover:bg-gray-50 dark:hover:bg-[#0a0f19] text-gray-900 dark:text-gray-300",
                    )}
                    asChild>
                    <Link href="/purchases" className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Purchase History
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className={cn(
                      "cursor-pointer",
                      activeTab === "achievements" ? "bg-[#fdb606]/10 text-[#fdb606]" : "hover:bg-gray-50 dark:hover:bg-[#0a0f19] text-gray-900 dark:text-gray-300",
                    )}
                    asChild>
                    <Link href="/achievements" className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      Achievements
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className={cn(
                      "cursor-pointer",
                      activeTab === "analytics" ? "bg-[#fdb606]/10 text-[#fdb606]" : "hover:bg-gray-50 dark:hover:bg-[#0a0f19] text-gray-900 dark:text-gray-300",
                    )}
                    asChild>
                    <Link href="/analytics" className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Analytics
                    </Link>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="bg-gray-200 dark:bg-slate-700" />

                {/* Settings & Help */}
                <div className="py-1">
                  <DropdownMenuItem
                    className={cn(
                      "cursor-pointer",
                      activeTab === "settings" ? "bg-[#fdb606]/10 text-[#fdb606]" : "hover:bg-gray-50 dark:hover:bg-[#0a0f19] text-gray-900 dark:text-gray-300",
                    )}
                    asChild>
                    <Link href="/settings" className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className={cn(
                      "cursor-pointer",
                      activeTab === "help" ? "bg-[#fdb606]/10 text-[#fdb606]" : "hover:bg-gray-50 dark:hover:bg-[#0a0f19] text-gray-900 dark:text-gray-300",
                    )}
                    asChild>
                    <Link href="/help" className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Help & Support
                    </Link>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator />

                {/* Sign Out */}
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer hover:bg-red-50"
                  asChild>
                  <Link href="/signout" className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchExpanded && (
          <div className="sm:hidden mt-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-[#fdb606] focus:ring-[#fdb606]"
                autoFocus
              />
            </form>
          </div>
        )}
      </div>
    </header>
  )
}
