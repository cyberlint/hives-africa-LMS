"use client";

import { ChevronDown, CalendarDays, Users, Globe2, Building2, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button"; // Adjust path if needed

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
    <div className="w-full bg-zinc-950 text-zinc-300 text-xs border-b border-white/10 relative z-50">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-2 flex flex-wrap items-center justify-center sm:justify-end gap-x-6 gap-y-2">

        {/* ================= The Ecosystem Dropdown ================= */}
        <div 
          ref={dropdownRef}
          className="relative group inline-block"
          onMouseEnter={() => setIsCommunityOpen(true)}
          onMouseLeave={() => setIsCommunityOpen(false)}
        >
          <button
            onClick={() => setIsCommunityOpen(!isCommunityOpen)}
            className="flex items-center gap-1.5 cursor-pointer select-none hover:text-white transition-colors py-1 outline-none"
            aria-expanded={isCommunityOpen}
          >
            <span className="font-semibold tracking-wide">The Ecosystem</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-300 ${isCommunityOpen ? "rotate-180 text-white" : ""}`}
            />
          </button>

          {/* Premium Glass Dropdown Menu */}
          <div
            className={`
              absolute left-0 sm:left-auto sm:right-0 top-full mt-1 w-52 z-50
              rounded-2xl border border-white/10
              bg-zinc-900/90 backdrop-blur-xl shadow-2xl
              transition-all duration-200 origin-top-right
              ${isCommunityOpen ? "opacity-100 scale-100 visible translate-y-0" : "opacity-0 scale-95 invisible -translate-y-2"}
            `}
          >
            <div className="p-1.5 space-y-0.5">
              <Button
                variant="ghost"
                className="w-full justify-start text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl h-10"
                asChild
              >
                <Link href="/community/hives" onClick={() => setIsCommunityOpen(false)}>
                  <Users size={14} className="mr-2.5 text-orange" />
                  Hives
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl h-10"
                asChild
              >
                <Link href="/community/events" onClick={() => setIsCommunityOpen(false)}>
                  <CalendarDays size={14} className="mr-2.5 text-green-500" />
                  Events
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ================= Enterprise Partners ================= */}
        <Link
          href="/partners"
          className="flex items-center gap-1.5 hover:text-white transition-colors py-1 font-semibold tracking-wide group"
        >
          <Building2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
          Enterprise Partners
        </Link>

        {/* ================= Support ================= */}
        <Link
          href="/support"
          className="flex items-center gap-1.5 hover:text-white transition-colors py-1 font-semibold tracking-wide group"
        >
          <HelpCircle className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
          Support
        </Link>

        {/* ================= Language ================= */}
        <button className="flex items-center gap-1.5 hover:text-white transition-colors py-1 font-semibold tracking-wide group outline-none">
          <Globe2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
          <span>EN</span>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
        </button>

      </div>
    </div>
  );
}