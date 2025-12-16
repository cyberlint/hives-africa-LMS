"use client"

import Link from "next/link"
import { useState } from "react"

export function Navigation() {
  const [activeItem, setActiveItem] = useState("My Learnings")

  const navItems = [
    { name: "Explore Courses", href: "#" },
    { name: "Communities", href: "#" },
    { name: "My Learnings", href: "#" },
  ]

  return (
    <nav className="bg-white py-4 px-6 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="h-8 w-8 bg-[#1a365d] text-white flex items-center justify-center transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-bold text-lg text-[#1a365d]">ANALYTIX</span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setActiveItem(item.name)}
              className={`text-gray-700 hover:text-[#1a365d] transition-colors duration-200 relative ${
                activeItem === item.name ? "text-[#1a365d] font-medium" : ""
              }`}
            >
              {item.name}
              {activeItem === item.name && (
                <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[#1a365d] rounded-full" />
              )}
            </Link>
          ))}
          <button className="h-8 w-8 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-200" />
        </div>
      </div>
    </nav>
  )
}
