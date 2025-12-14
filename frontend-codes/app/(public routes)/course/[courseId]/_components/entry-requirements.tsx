"use client"

import { Course } from "@/types/course"

interface EntryRequirementsProps {
  course: Course
}

export default function EntryRequirements({ course }: EntryRequirementsProps) {
  return (
    <section id="requirements" className="py-8 sm:py-12 dark:bg-[#1d2026] transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4k">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F1D2F] dark:text-gray-100 mb-6 sm:mb-8">Entry Requirements</h2>

            {/* Academic Requirement */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-[#0F1D2F] dark:text-gray-100 mb-4">Academic Requirement</h3>
              <p className="text-[#6B7280] dark:text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
                This course is designed for {course.level.toLowerCase()} learners. No specific academic requirements needed.
              </p>

              {/* English Requirement */}
              <h4 className="text-base sm:text-lg font-medium text-[#0F1D2F] dark:text-gray-100 mb-4">Language Requirement</h4>
              <div className="bg-white dark:bg-[#2a2f3a] border border-[#E2E8F0] dark:border-[#404854] rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 transition-colors duration-300">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-center">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">I</span>
                      </div>
                      <div>
                        <div className="font-medium text-[#0F1D2F] dark:text-gray-100">IELTS</div>
                        <div className="text-xl sm:text-2xl font-bold text-[#0F1D2F] dark:text-gray-100">6</div>
                      </div>
                    </div>
                    <button className="text-yellow border border-yellow px-3 py-1 rounded text-xs hover:bg-yellow hover:text-white transition-colors mt-2 sm:mt-0">
                      Schedule Test
                    </button>
                  </div>

                  <div className="flex items-center justify-center">
                    <span className="text-[#6B7280] dark:text-gray-400 font-medium">OR</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">T</span>
                    </div>
                    <div>
                      <div className="font-medium text-[#0F1D2F] dark:text-gray-100">TOEFL iBT</div>
                      <div className="text-xl sm:text-2xl font-bold text-[#0F1D2F] dark:text-gray-100">75</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Requirements */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#0F1D2F] dark:text-gray-100 mb-4">Course Prerequisites</h3>
              <div className="mb-4">
                <h4 className="font-medium text-[#0F1D2F] dark:text-gray-100 mb-2">General Requirements</h4>
                <p className="text-[#6B7280] dark:text-gray-400 text-sm sm:text-base mb-4">
                  To get the most out of this {course.level.toLowerCase()} course, you should have:
                </p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-[#0F1D2F] dark:text-gray-300 text-sm sm:text-base">Basic computer literacy and internet access</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-[#0F1D2F] dark:text-gray-300 text-sm sm:text-base">Enthusiasm to learn and practice new skills</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-[#0F1D2F] dark:text-gray-300 text-sm sm:text-base">
                    {course.level === "Beginner" ? "No prior experience required" : 
                     course.level === "Intermediate" ? "Basic understanding of the subject area" :
                     "Advanced knowledge and experience in the field"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
