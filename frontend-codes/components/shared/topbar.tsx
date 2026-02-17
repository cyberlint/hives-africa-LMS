"use client";

import { ChevronDown, CalendarDays, Users, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";

export default function Topbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full bg-darkBlue-500 dark:bg-[#0f1419] text-white text-xs sm:text-sm transition-colors duration-300">
      <div className="mx-auto px-4 md:px-16 py-2 flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2">

        {/* ================= Community ================= */}
        <div className="relative group inline-block">

          {/* Trigger */}
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 cursor-pointer select-none"
          >
            <span className="font-medium text-white group-hover:text-yellow transition-colors">
              Community
            </span>

            <ChevronDown
              className={`
                w-4 h-4 text-white transition-transform duration-300
                ${open ? "rotate-180" : ""}
                group-hover:rotate-180
              `}
            />
          </div>

          {/* Dropdown */}
          <div
            className={`
              absolute left-0 top-full mt-3 w-60 z-50
              rounded-2xl
              border border-neutral-200 dark:border-neutral-800
              bg-white dark:bg-neutral-950
              shadow-2xl
              transition-all duration-200
              ${open 
                ? "opacity-100 visible translate-y-0" 
                : "opacity-0 invisible translate-y-2"}
              md:group-hover:opacity-100
              md:group-hover:visible
              md:group-hover:translate-y-0
            `}
          >
            <div className="p-2 space-y-1">

              {/* Events */}
              <Link href="/community/events">
                <Button
                  variant="ghost"
                  className="
                    w-full justify-start text-sm font-medium 
                    text-foreground
                    hover:bg-neutral-100 dark:hover:bg-neutral-900
                    rounded-lg
                  "
                >
                  <CalendarDays size={18} className="mr-3 text-yellow-500" />
                  Events
                </Button>
              </Link>

              {/* Village Square */}
              <Link href="/community/village-square">
                <Button
                  variant="ghost"
                  className="
                    w-full justify-start text-sm font-medium 
                    text-foreground
                    hover:bg-neutral-100 dark:hover:bg-neutral-900
                    rounded-lg
                  "
                >
                  <Users size={18} className="mr-3 text-blue-500" />
                  Village Square
                </Button>
              </Link>

            </div>
          </div>
        </div>

        {/* ================= Partner ================= */}
        <div className="flex items-center gap-1 cursor-pointer group transition">
          <Link
            href="/posts/instructors"
            className="hover:text-yellow transition-colors"
          >
            Become a partner
          </Link>
          <ChevronDown className="w-4 h-4 text-[#384957] group-hover:text-yellow transition-colors" />
        </div>

        {/* ================= Contact ================= */}
        <Link
          href="/home"
          className="hover:text-yellow transition-colors"
        >
          Contact Us
        </Link>

        {/* ================= Language ================= */}
        <div className="flex items-center gap-1 cursor-pointer group transition">
          <span className="hover:text-yellow transition-colors">EN</span>
          <ChevronDown className="w-4 h-4 text-[#384957] group-hover:text-yellow transition-colors" />
        </div>

      </div>
    </div>
  );
}