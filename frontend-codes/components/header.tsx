"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { 
  Search, ChevronDown, ShoppingCart, 
  LayoutDashboard, BookOpen, Heart, History, 
  Award, Settings, HelpCircle, LogOut, 
  MessagesSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/CartContext"
import Image from "next/image"
import { ThemeToggle } from "./ui/theme-toggle"
import NavLink from "@/components/shared/navlink"

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [mounted, setMounted] = useState(false);
  
  const { data: session } = authClient.useSession()
  const router = useRouter()
  const { items: cartItems } = useCart()

  useEffect(() => {
    setMounted(true);
  }, []); 

  const user = session?.user || {
    name: "Learner",
    email: "learner@example.com",
    image: "/ai.png",
  }

  const handleCartNavigate = () => {
    router.push("/dashboard/cart")
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery)
      // Implement search functionality here
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border/60 shadow-sm transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* 1. Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2 shrink-0">
            <Image
              src="/assets/NextHive Logo.png"
              alt="NextHive Logo"
              width={40}
              height={40}
              className="h-9 w-auto object-contain"
            />
          </Link>

          {/* 2. Search Bar - Desktop (Softened & Modernized) */}
          <div className="hidden sm:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full group">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-orange" strokeWidth={2} />
              <Input
                type="text"
                placeholder="Search courses, topics, or projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-muted/50 border-transparent text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-orange focus:ring-2 focus:ring-orange/20 transition-all rounded-full"
              />
            </form>
          </div>

          {/* 3. Mobile Search Toggle */}
          <div className="sm:hidden ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full"
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </Button>
          </div>

          {/* 4. Right Side Actions */}
          <div className="flex items-center space-x-1 sm:space-x-3 shrink-0">
            
            <Button variant="outline" className="hidden md:flex items-center space-x-2 text-sm font-medium border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full h-9 px-4" asChild>
              <Link href="/community/events">
                <MessagesSquare size={16} strokeWidth={2} />
                <span>Community</span>
              </Link>
            </Button>

            <div className="hidden sm:block">
               <ThemeToggle />
            </div>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 p-1.5 hover:bg-muted transition-colors rounded-full"
                  aria-label="User menu"
                >
                  <Avatar className="h-8 w-8 border border-border/50">
                    <AvatarImage src={user.image || "/placeholder.jpg"} alt={user.name} />
                    <AvatarFallback className="bg-orange/10 text-orange font-semibold text-xs">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block font-medium text-foreground text-sm pl-1">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="hidden sm:block h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-64 bg-card border-border shadow-lg rounded-2xl p-2">
                {/* User Info */}
                <div className="px-3 py-3 border-b border-border/50 mb-2">
                  <p className="font-semibold text-sm text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>

                {/* Main Navigation (Clean Lucide Icons) */}
                <div className="space-y-0.5">
                  <DropdownMenuItem asChild className="rounded-xl">
                    <NavLink 
                      href="/dashboard" 
                      className="cursor-pointer flex items-center gap-3 py-2 px-3 text-muted-foreground hover:text-foreground w-full transition-colors"
                      activeClassName="bg-orange/10 text-orange font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4" strokeWidth={2} />
                      Dashboard
                    </NavLink>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="rounded-xl">
                    <NavLink 
                      href="/dashboard/learning" 
                      className="cursor-pointer flex items-center gap-3 py-2 px-3 text-muted-foreground hover:text-foreground w-full transition-colors"
                      activeClassName="bg-orange/10 text-orange font-medium"
                    >
                      <BookOpen className="w-4 h-4" strokeWidth={2} />
                      My Learning
                    </NavLink>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="rounded-xl">
                    <NavLink 
                      href="/dashboard/wishlist" 
                      className="cursor-pointer flex items-center gap-3 py-2 px-3 text-muted-foreground hover:text-foreground w-full transition-colors"
                      activeClassName="bg-orange/10 text-orange font-medium"
                    >
                      <Heart className="w-4 h-4" strokeWidth={2} />
                      Wishlist
                    </NavLink>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="rounded-xl">
                    <NavLink 
                      href="/dashboard/cart" 
                      className="cursor-pointer flex items-center gap-3 py-2 px-3 text-muted-foreground hover:text-foreground w-full relative transition-colors"
                      activeClassName="bg-orange/10 text-orange font-medium"
                      onClick={handleCartNavigate}
                    >
                      <ShoppingCart className="w-4 h-4" strokeWidth={2} />
                      Pending Purchases
                      {cartItems.length > 0 && (
                        <Badge className="absolute right-2 h-5 min-w-[20px] flex items-center justify-center px-1.5 bg-orange text-white text-[10px] rounded-full border-none">
                          {cartItems.length}
                        </Badge>
                      )}
                    </NavLink>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="rounded-xl">
                    <NavLink 
                      href="/dashboard/courses" 
                      className="cursor-pointer flex items-center gap-3 py-2 px-3 text-muted-foreground hover:text-foreground w-full transition-colors"
                      activeClassName="bg-orange/10 text-orange font-medium"
                    >
                      <Search className="w-4 h-4" strokeWidth={2} />
                      View All Courses
                    </NavLink>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="bg-border/50 my-2" />

                {/* Account Section */}
                <div className="space-y-0.5">
                  <DropdownMenuItem asChild className="rounded-xl">
                    <NavLink 
                      href="/dashboard/purchases" 
                      className="cursor-pointer flex items-center gap-3 py-2 px-3 text-muted-foreground hover:text-foreground w-full transition-colors"
                      activeClassName="bg-orange/10 text-orange font-medium"
                    >
                      <History className="w-4 h-4" strokeWidth={2} />
                      Purchase History
                    </NavLink>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="rounded-xl">
                    <NavLink 
                      href="/dashboard/achievements" 
                      className="cursor-pointer flex items-center gap-3 py-2 px-3 text-muted-foreground hover:text-foreground w-full transition-colors"
                      activeClassName="bg-orange/10 text-orange font-medium"
                    >
                      <Award className="w-4 h-4" strokeWidth={2} />
                      Achievements
                    </NavLink>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="bg-border/50 my-2" />

                {/* Settings & Sign Out */}
                <div className="space-y-0.5 mb-1">
                  <DropdownMenuItem asChild className="rounded-xl">
                    <NavLink 
                      href="/dashboard/settings" 
                      className="cursor-pointer flex items-center gap-3 py-2 px-3 text-muted-foreground hover:text-foreground w-full transition-colors"
                      activeClassName="bg-orange/10 text-orange font-medium"
                    >
                      <Settings className="w-4 h-4" strokeWidth={2} />
                      Settings
                    </NavLink>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="rounded-xl">
                    <NavLink 
                      href="/dashboard/help" 
                      className="cursor-pointer flex items-center gap-3 py-2 px-3 text-muted-foreground hover:text-foreground w-full transition-colors"
                      activeClassName="bg-orange/10 text-orange font-medium"
                    >
                      <HelpCircle className="w-4 h-4" strokeWidth={2} />
                      Help & Support
                    </NavLink>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer flex items-center gap-3 py-2 px-3 mt-1"
                    onClick={async () => {
                      await authClient.signOut({
                        fetchOptions: {
                          onSuccess: () => {
                            router.push("/signin");
                          },
                        },
                      });
                    }}
                  >
                    <LogOut className="w-4 h-4" strokeWidth={2} />
                    Sign Out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 5. Mobile Search Bar (Theme Compliant) */}
        {isSearchExpanded && (
          <div className="sm:hidden mt-3 pb-1">
            <form onSubmit={handleSearchSubmit} className="relative group">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-orange" strokeWidth={2} />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-muted/50 border-transparent text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-orange focus:ring-2 focus:ring-orange/20 transition-all rounded-xl"
                autoFocus
              />
            </form>
          </div>
        )}
      </div>
    </header>
  )
}