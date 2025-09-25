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
    <section id="fees" className="py-8 sm:py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F1D2F] mb-6 sm:mb-8">Course Fees</h2>

            {/* Country Selector */}
            <div className="mb-6 sm:mb-8">
              <p className="text-[#6B7280] text-sm mb-4">To always see correct tuition fees, specify nationality</p>
              <div className="relative inline-block">
                <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm sm:text-base">
                  <div className="w-6 h-4 bg-green-500 rounded-sm flex-shrink-0"></div>
                  <span className="text-[#0F1D2F]">{selectedCountry === "nigeria" ? "Nigeria" : "United States"}</span>
                  <ChevronDown className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
                </button>
              </div>
            </div>

            {/* Fees Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden w-full max-w-lg">
              <div className="divide-y divide-gray-200">
                <div className="flex justify-between items-center p-4">
                  <span className="text-[#0F1D2F] font-medium text-sm sm:text-base">Reg Fee</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[#0F1D2F] font-semibold text-sm sm:text-base">{currentFees.regFee.current}</span>
                    <span className="text-[#6B7280] line-through text-xs sm:text-sm">{currentFees.regFee.original}</span>
                    <span className="bg-yellow text-white text-xs px-2 py-1 rounded">50% off</span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4">
                  <span className="text-[#0F1D2F] font-medium text-sm sm:text-base">Tuition Fee</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[#0F1D2F] font-semibold text-sm sm:text-base">{currentFees.tuitionFee.current}</span>
                    <span className="text-[#6B7280] line-through text-xs sm:text-sm">{currentFees.tuitionFee.original}</span>
                    <span className="bg-yellow text-white text-xs px-2 py-1 rounded">50% off</span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50">
                  <span className="text-[#0F1D2F] font-bold text-sm sm:text-base">Total</span>
                  <span className="text-[#0F1D2F] font-bold text-lg sm:text-xl">{currentFees.total}</span>
                </div>
              </div>
            </div>

            {/* Mobile CTA Section */}
            <div className="mt-6 sm:mt-8 lg:hidden">
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 shadow-sm space-y-4">
                <h3 className="text-lg font-semibold text-[#0F1D2F]">Get Started Now</h3>
                <p className="text-sm text-gray-600">Secure your seat and unlock full course materials.</p>
                <ul className="text-xs sm:text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow flex-shrink-0"></span>
                    <span>Immediate access after payment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow flex-shrink-0"></span>
                    <span>Certificate on completion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow flex-shrink-0"></span>
                    <span>Interactive community access</span>
                  </li>
                </ul>
                <CheckoutButton 
                  courseId={course.id} 
                  price={course.price} 
                  title={course.title}
                  thumbnail={course.image}
                  instructor={course.instructor}
                  label={course.price === "Free" ? "Enroll Free" : "Enroll Now"} 
                  className="w-full" 
                />
                <p className="text-xs text-gray-500 text-center">Secured payment. Discounts applied automatically.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
