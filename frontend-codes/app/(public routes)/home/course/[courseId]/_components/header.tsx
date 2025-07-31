"use client"

import { useState } from "react"
import { ChevronDown, Phone, Globe } from "lucide-react"

export default function Header() {
  const [isCompanyOpen, setIsCompanyOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#00BFA6] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-xl text-[#0F1D2F]">analytix</span>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#" className="text-[#0F1D2F] hover:underline">
              Why Analytix
            </a>
            <a href="#" className="text-[#0F1D2F] hover:underline">
              Solutions
            </a>
            <a href="#" className="text-[#0F1D2F] hover:underline">
              Pricing
            </a>
            <a href="#" className="text-[#0F1D2F] hover:underline">
              Resources
            </a>
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center space-x-6">
            <a href="#" className="text-[#0F1D2F] hover:underline">
              Become a Partner
            </a>

            <div className="relative">
              <button
                onClick={() => setIsCompanyOpen(!isCompanyOpen)}
                className="flex items-center space-x-1 text-[#0F1D2F] hover:underline"
              >
                <span>Company</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <a href="#" className="text-[#0F1D2F] hover:underline">
              Contact Us
            </a>

            <button className="flex items-center space-x-2 text-[#0F1D2F] hover:underline">
              <Phone className="w-4 h-4" />
              <span>+234 808-240-6800</span>
            </button>

            <a href="#" className="text-[#0F1D2F] hover:underline">
              Login
            </a>

            <button className="flex items-center space-x-1 text-[#0F1D2F]">
              <Globe className="w-4 h-4" />
              <span>EN</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
