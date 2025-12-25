"use client"

import { CheckoutButton } from "@/components/lms/checkout-button"
import { constructUrl } from "@/lib/construct-url"
import { Course } from "@/types/course"

interface CourseFeesProps {
  course: Course
}

export default function CourseFees({ course }: CourseFeesProps) {
  // Format currency with Naira symbol
  const formatNaira = (amount: number) => {
    if (amount === 0) return "Free";
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('NGN', '₦');
  }

  // Price data from course
  const total = course.price;
  
  // Registration and Tuition splits
  // Use registrationFee if available, otherwise default to 30% of total
  const regFeeCurrent = course.registrationFee || Math.round(total * 0.3);
  const tuitionFeeCurrent = total - regFeeCurrent;

  // Handle original price for discounts
  const hasOriginalPrice = !!course.originalPrice && course.originalPrice > total;
  const originalTotal = hasOriginalPrice ? course.originalPrice! : total;
  
  // We apply the same 30/70 split ratio for original prices if registrationFee is just a number
  // but if we have a real registration fee, we use it.
  const originalRegFee = hasOriginalPrice ? Math.round(originalTotal * 0.3) : regFeeCurrent;
  const originalTuitionFee = originalTotal - originalRegFee;
  
  // Calculate discount percentage
  const discountPercentage = hasOriginalPrice 
    ? Math.round(((originalTotal - total) / originalTotal) * 100) 
    : 0;

  return (
    <section id="fees" className="py-8 sm:py-12 dark:bg-[#1d2026] transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F1D2F] dark:text-gray-100 mb-6 sm:mb-8">Course Fees</h2>

            {/* Country Display (Fixed to Nigeria as per requirements) */}
            <div className="mb-6 sm:mb-8">
              <p className="text-[#6B7280] dark:text-gray-400 text-sm mb-4">Currency based on nationality</p>
              <div className="inline-flex items-center space-x-3 bg-white dark:bg-[#2a2f3a] border border-gray-300 dark:border-[#404854] rounded-lg px-4 py-2.5 transition-colors duration-300 shadow-sm">
                <div className="flex overflow-hidden rounded-sm flex-shrink-0 w-7 h-5 border border-gray-100 dark:border-gray-800">
                  <div className="w-1/3 bg-[#008751]"></div>
                  <div className="w-1/3 bg-white"></div>
                  <div className="w-1/3 bg-[#008751]"></div>
                </div>
                <span className="text-[#0F1D2F] dark:text-gray-100 font-medium">Nigeria (NGN)</span>
              </div>
            </div>

            {/* Fees Table */}
            <div className="bg-white dark:bg-[#2a2f3a] rounded-lg border border-gray-200 dark:border-[#404854] overflow-hidden w-full max-w-lg transition-colors duration-300 shadow-sm mb-8">
              <div className="divide-y divide-gray-200 dark:divide-[#404854]">
                <div className="flex justify-between items-center p-4 h-16">
                  <span className="text-[#0F1D2F] dark:text-gray-100 font-medium text-sm sm:text-base">Reg Fee</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[#0F1D2F] dark:text-gray-100 font-semibold text-sm sm:text-base">{formatNaira(regFeeCurrent)}</span>
                    {hasOriginalPrice && discountPercentage > 0 && (
                      <>
                        <span className="text-[#6B7280] line-through text-xs sm:text-sm">{formatNaira(originalRegFee)}</span>
                        <span className="bg-yellow text-white text-[10px] px-1.5 py-0.5 rounded font-medium">{discountPercentage}% off</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 h-16">
                  <span className="text-[#0F1D2F] dark:text-gray-100 font-medium text-sm sm:text-base">Tuition Fee</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[#0F1D2F] dark:text-gray-100 font-semibold text-sm sm:text-base">{formatNaira(tuitionFeeCurrent)}</span>
                    {hasOriginalPrice && discountPercentage > 0 && (
                      <>
                        <span className="text-[#6B7280] dark:text-gray-400 line-through text-xs sm:text-sm">{formatNaira(originalTuitionFee)}</span>
                        <span className="bg-yellow text-white text-[10px] px-1.5 py-0.5 rounded font-medium">{discountPercentage}% off</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-[#1d2026] transition-colors duration-300 h-16">
                  <span className="text-[#0F1D2F] dark:text-gray-100 font-bold text-sm sm:text-base">Total</span>
                  <span className="text-[#0F1D2F] dark:text-gray-100 font-bold text-lg sm:text-xl">{formatNaira(total)}</span>
                </div>
              </div>
            </div>

            {/* Mobile CTA Section */}
            <div className="mt-6 sm:mt-8 lg:hidden">
              <div className="bg-white dark:bg-[#2a2f3a] border border-gray-200 dark:border-[#404854] rounded-xl p-5 sm:p-6 shadow-md space-y-4 transition-colors duration-300">
                <h3 className="text-lg font-semibold text-[#0F1D2F] dark:text-gray-100">Get Started Now</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Secure your seat and unlock full course materials immediately.</p>
                <ul className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-yellow flex-shrink-0"></span>
                    <span>Immediate access after payment</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-yellow flex-shrink-0"></span>
                    <span>Certificate of completion included</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-yellow flex-shrink-0"></span>
                    <span>Lifetime access to course community</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <CheckoutButton 
                    courseId={course.id} 
                    price={course.price} 
                    title={course.title}
                    thumbnail={course.image ? constructUrl(course.image) : undefined}
                    instructor={course.instructor}
                    label={course.isEnrolled ? "Continue Learning" : (course.price === 0 ? "Enroll Free" : "Enroll Now")} 
                    className="w-full py-6 text-base font-bold shadow-lg shadow-yellow/20" 
                  />
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center uppercase tracking-wider font-medium">Secured Payment • Instant Activation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
