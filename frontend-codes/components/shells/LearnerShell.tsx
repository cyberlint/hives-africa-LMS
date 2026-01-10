"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { DashboardProvider } from "@/app/(private routes)/dashboard/studentContext";
import { usePathname } from "next/navigation";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import Image from "next/image";

interface LearnerShellProps {
  children: ReactNode;
  sidebarRoutes?: string[]; // optional custom routes for sidebar visibility
}

export default function LearnerShell({ children, sidebarRoutes }: LearnerShellProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && isMobileMenuOpen) setIsMobileMenuOpen(false);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [isMobileMenuOpen]);

  const handleMobileMenuToggle = () => setIsMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const defaultSidebarRoutes = [
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

  const routesToUse = sidebarRoutes ?? defaultSidebarRoutes;
  const isSidebarRoute = routesToUse.some(route => pathname.startsWith(route)) || pathname === '/' || pathname === '/profile';

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-white dark:bg-[#1d2026] transition-colors duration-300">
        <Header />

        <div className="flex relative">
          {isMobile && (
            <Button
              variant="outline"
              size="icon"
              className={cn("fixed top-20 left-4 z-50 md:hidden")}
              onClick={handleMobileMenuToggle}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          )}

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetContent
              side="left"
              className="p-0 w-72 sm:w-80 bg-white dark:bg-[#1d2026] border-r border-gray-200 dark:border-[#0a0f19] shadow-xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#0a0f19] sticky top-0 z-10 bg-white dark:bg-[#1d2026]">
                <div className="text-xl font-bold text-[#fdb606]">NextHive
                </div>
                <Button variant="ghost" size="icon" onClick={closeMobileMenu} aria-label="Close menu">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="h-full overflow-y-auto">
                <Sidebar />
              </div>
            </SheetContent>
          </Sheet>

          <main className={cn("flex-1 transition-all duration-300 max-w-[1440px] mx-auto w-full p-4 md:p-6", isMobile ? "pt-20" : "pt-0")}>
            {children}
          </main>

          {isMobile && isMobileMenuOpen && <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={closeMobileMenu} aria-hidden="true" />}
        </div>
      </div>
    </DashboardProvider>
  );
}
