"use client";

import { ChevronDown, CalendarDays, Users } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button"; // Adjust path if needed

export default function Topbar() {
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCommunityOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-[#061c2d] text-white/80 text-xs sm:text-sm border-b border-white/5 relative z-50">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-2.5 flex flex-wrap items-center justify-center sm:justify-end gap-x-6 gap-y-3">

        {/* ================= Community Dropdown ================= */}
        <div 
          ref={dropdownRef}
          className="relative group inline-block"
          onMouseEnter={() => setIsCommunityOpen(true)}
          onMouseLeave={() => setIsCommunityOpen(false)}
        >
          {/* Trigger */}
          <button
            onClick={() => setIsCommunityOpen(!isCommunityOpen)}
            className="flex items-center gap-1.5 cursor-pointer select-none hover:text-white transition-colors py-1"
            aria-expanded={isCommunityOpen}
          >
            <span className="font-medium">Community</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-white/60 transition-transform duration-300 ${isCommunityOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          <div
            className={`
              absolute left-0 sm:left-auto sm:right-0 top-full mt-1 w-56 z-50
              rounded-xl border border-border/50
              bg-background text-foreground shadow-xl
              transition-all duration-200 origin-top
              ${isCommunityOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}
            `}
          >
            <div className="p-1.5 space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-medium hover:bg-muted rounded-lg"
                asChild
              >
                <Link href="/community/events" onClick={() => setIsCommunityOpen(false)}>
                  <CalendarDays size={16} className="mr-3 text-orange" />
                  Events
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-medium hover:bg-muted rounded-lg"
                asChild
              >
                <Link href="/community/village-square" onClick={() => setIsCommunityOpen(false)}>
                  <Users size={16} className="mr-3 text-blue-500" />
                  Village Square
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ================= Partner ================= */}
        <Link
          href="/posts/instructors"
          className="flex items-center gap-1.5 hover:text-white transition-colors py-1 font-medium"
        >
          Become a partner
          <ChevronDown className="w-3.5 h-3.5 text-white/60" />
        </Link>

        {/* ================= Contact ================= */}
        <Link
          href="/home"
          className="hover:text-white transition-colors py-1 font-medium"
        >
          Contact Us
        </Link>

        {/* ================= Language ================= */}
        <button className="flex items-center gap-1.5 hover:text-white transition-colors py-1 font-medium">
          <span>EN</span>
          <ChevronDown className="w-3.5 h-3.5 text-white/60" />
        </button>

      </div>
    </div>
  );
}