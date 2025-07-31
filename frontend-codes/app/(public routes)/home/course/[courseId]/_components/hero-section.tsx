"use client"

import { Star, User, Users, Clock, Search } from "lucide-react"
import Image from "next/image"

export default function HeroSection() {
  return (
    <div className="relative">
      {/* Breadcrumb */}
      <div className="container mx-auto pb-4">
        <nav className="text-sm text-[#6B7280]">
          <span>Home</span>
          <span className="mx-2">{">"}</span>
          <span>Education</span>
          <span className="mx-2">{">"}</span>
          <span>(Hons) Business and Management</span>
        </nav>
      </div>

      {/* Hero Banner */}
      <div className="relative h-[380px] bg-gradient-to-r from-[#0F1D2F]/80 to-[#0F1D2F]/60">
        <Image src="/placeholder.svg" alt="Course background" fill className="object-cover -z-10" />

        <div className="container mx-auto h-full">
          <div className="grid lg:grid-cols-2 gap-8 h-full items-center">
            {/* Left content */}
            <div className="text-white space-y-6">
              <a href="#" className="text-[#00BFA6] underline text-sm">
                University of Essex Online
              </a>

              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">Business and Management</h1>

              <p className="text-lg text-white/80 max-w-lg">
                This (Hons) Business and Management BSc course from University of Essex Online will help you adapt to
                the ever-changing world of business. We will examine a range of real-world business examples and use them
                to develop the broad skillset that a good manager should be able to draw from.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>John Doe</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>20,000+ Learners</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>3 months</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.8</span>
                </div>
                <span className="text-white/80">(1,219 ratings) • 2,945 students</span>
              </div>
            </div>

            {/* Right card */}
            <div className="lg:justify-self-end">
              <div className="bg-white rounded-2xl p-6 shadow-lg max-w-sm w-full">
                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-3xl font-bold text-[#0F1D2F]">₦5,000</span>
                    <span className="text-lg text-[#6B7280] line-through">₦10,000</span>
                    <span className="bg-[#00BFA6] text-white text-xs px-2 py-1 rounded">50% off</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full bg-[#247BA0] text-white py-3 rounded-lg font-medium hover:bg-[#00A693] transition-colors mb-4">
                  Enroll Now →
                </button>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                  <input
                    type="text"
                    placeholder="Search courses"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BFA6]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
