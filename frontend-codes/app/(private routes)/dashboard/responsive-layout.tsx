"use client"

import React, { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { DashboardProvider } from "@/app/(private routes)/dashboard/studentContext"
import { usePathname } from "next/navigation"

import Header from "@/components/header"
import Sidebar from "@/components/sidebar"


interface ResponsiveLayoutProps {
  children: React.ReactNode
}

export default function ResponsiveLayout({ children,  }: ResponsiveLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Close mobile menu when switching to desktop
      if (!mobile && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    // Initial check
    checkScreenSize()

    // Add event listener
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [isMobileMenuOpen])

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Define the routes that should have the sidebar and standard layout
  const sidebarRoutes = [
    '/dashboard',
    '/dashboard/courses',
    '/dashboard/settings',
    '/dashboard/achievements',
    '/dashboard/analytics',
    '/dashboard/cart',
    '/dashboard/help',
    '/dashboard/learning',
    '/dashboard/purchases',
    '/dashboard/wishlist'
  ];
  
  // Check if current route is a sidebar route
  const isSidebarRoute = sidebarRoutes.some(route => pathname.startsWith(route)) || pathname === '/' || pathname === '/profile';

  // If it's not a sidebar route (i.e. it's a course ID root or chapter page), render full width
  if (!isSidebarRoute) {
    return (
      <DashboardProvider>
           {/* Header */}
      <Header   />
        {children}
      </DashboardProvider>
    )
  }

  return (
    <>
    <DashboardProvider>
       
    <div className="min-h-screen bg-white dark:bg-darkBlue-300 transition-colors duration-300">
      {/* Header */}
      <Header   />

      <div className="flex relative">
        {/* Desktop Sidebar - HIDDEN by default for clean UX */}
        {/* Navigation is now in the profile dropdown in Header */}

        {/* Mobile Menu Button - Only visible on mobile */}
        {isMobile && (
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "fixed top-20 left-4 z-50 md:hidden",
              "bg-white dark:bg-darkBlue-300 shadow-lg border-2 border-gray-200 dark:border-[#0a0f19]",
              "hover:bg-gray-50 dark:hover:bg-[#0a0f19] hover:border-yellow",
              "active:bg-gray-100 dark:active:bg-[#0a0f19] active:scale-95",
              "transition-all duration-200 ease-in-out",
              "w-12 h-12 rounded-full",
              "focus:outline-none focus:ring-2 focus:ring-yellow focus:ring-offset-2 dark:focus:ring-offset-darkBlue-300",
            )}
            onClick={handleMobileMenuToggle}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5 text-gray-700 dark:text-gray-300" /> : <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />}
          </Button>
        )}

        {/* Mobile Sidebar Sheet */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent
            side="left"
            className={cn("p-0 w-72 sm:w-80", "bg-white dark:bg-darkBlue-300 border-r border-gray-200 dark:border-[#0a0f19]", "shadow-xl")}
          >
            {/* Sheet Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#0a0f19] bg-white dark:bg-[#1d2026] sticky top-0 z-10 transition-colors">
              <div className="text-xl font-bold text-yellow">LearnHub</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMobileMenu}
                className="hover:bg-gray-100 dark:hover:bg-[#0a0f19] rounded-full transition-colors"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Sheet Content */}
            <div className="bg-white dark:bg-darkBlue-300 h-full overflow-y-auto transition-colors"><Sidebar/></div>
          </SheetContent>
        </Sheet>

        {/* Main Content - Full width without sidebar */}
        <main className={cn(
          "flex-1 transition-all duration-300", 
          "max-w-360 mx-auto w-full",
          "p-4 md:p-6", 
          isMobile ? "pt-20" : "pt-0"
        )}>
          {children}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={closeMobileMenu} aria-hidden="true" />
      )}
    </div>
     </DashboardProvider>
     </>
  )
}