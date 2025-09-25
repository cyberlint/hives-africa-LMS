"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { CheckoutButton } from "@/components/lms/checkout-button"

import { Course } from "@/types/course"

interface CourseFeesProps {
  course: Course
}

export default function CourseFees({ course }: CourseFeesProps) {
  const [selectedCountry, setSelectedCountry] = useState("nigeria")

  const feeData = {
    nigeria: {
      regFee: { current: "₦1,500", original: "₦3,000" },
      tuitionFee: { current: "₦3,500", original: "₦7,000" },
      total: "₦5,000",
    },
    us: {
      regFee: { current: "$15", original: "$30" },
      tuitionFee: { current: "$35", original: "$70" },
      total: "$50",
    },
  }

  const currentFees = feeData[selectedCountry as keyof typeof feeData]

  return (
    <section id="fees" className="py-12">
      <div className="container">
  <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content - Left side */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-[#0F1D2F] mb-8">Course Fees</h2>

            {/* Country Selector */}
            <div className="mb-8">
              <p className="text-[#6B7280] text-sm mb-4">To always see correct tuition fees, specify nationality</p>
              <div className="relative inline-block">
                <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2">
                  <div className="w-6 h-4 bg-green-500 rounded-sm"></div>
                  <span className="text-[#0F1D2F]">{selectedCountry === "nigeria" ? "Nigeria" : "United States"}</span>
                  <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                </button>
              </div>
            </div>

            {/* Fees Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-md">
              <div className="divide-y divide-gray-200">
                <div className="flex justify-between items-center p-4">
                  <span className="text-[#0F1D2F] font-medium">Reg Fee</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[#0F1D2F] font-semibold">{currentFees.regFee.current}</span>
                    <span className="text-[#6B7280] line-through text-sm">{currentFees.regFee.original}</span>
                    <span className="bg-[#00BFA6] text-white text-xs px-2 py-1 rounded">50% off</span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4">
                  <span className="text-[#0F1D2F] font-medium">Tuition Fee</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[#0F1D2F] font-semibold">{currentFees.tuitionFee.current}</span>
                    <span className="text-[#6B7280] line-through text-sm">{currentFees.tuitionFee.original}</span>
                    <span className="bg-[#00BFA6] text-white text-xs px-2 py-1 rounded">50% off</span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50">
                  <span className="text-[#0F1D2F] font-bold">Total</span>
                  <span className="text-[#0F1D2F] font-bold text-lg">{currentFees.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Purchase summary / CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold text-[#0F1D2F]">Get Started Now</h3>
              <p className="text-sm text-gray-600">Secure your seat and unlock full course materials.</p>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow"></span>Immediate access after payment</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow"></span>Certificate on completion</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow"></span>Interactive community</li>
              </ul>
              {/* TODO: Wire actual course id & metadata from parent context/provider */}
              <CheckoutButton courseId={""} price={currentFees.total} label="Add to Cart" autoNavigate={false} className="w-full" />
              <p className="text-[11px] text-gray-500 text-center">Secured payment. Discounts applied automatically.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
