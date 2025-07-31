"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function CourseFees() {
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

          {/* Right side - Empty space to maintain layout */}
          <div className="lg:col-span-1"></div>
        </div>
      </div>
    </section>
  )
}
