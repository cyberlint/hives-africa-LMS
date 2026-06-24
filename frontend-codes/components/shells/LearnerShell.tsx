"use client";

import React, { ReactNode } from "react";
import { DashboardProvider } from "@/app/(private routes)/dashboard/studentContext";
import { usePathname } from "next/navigation";
import Header from "@/components/header";
import { cn } from "@/lib/utils";

interface LearnerShellProps {
  children: ReactNode;
  sidebarRoutes?: string[]; 
}

export default function LearnerShell({ children, sidebarRoutes }: LearnerShellProps) {
  const pathname = usePathname();

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
          {/* REMOVED: 
              - Mobile Toggle Button
              - Sheet/Sidebar Component
              - Mobile Overlay
          */}

          <main className={cn(
            "flex-1 transition-all duration-300 max-w-[1440px] mx-auto w-full p-4 md:p-6",
            // Removed the extra pt-20 padding that was making room for the toggle
            "pt-6" 
          )}>
            {children}
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}