import { CheckoutButton } from "@/components/lms/checkout-button"
import { Course } from "@/types/course"
import { constructUrl } from "@/lib/construct-url"
import { RichTextRenderer } from "@/components/lms/RichTextRenderer"

interface AboutCourseProps {
  course: Course
}

export default function AboutCourse({ course }: AboutCourseProps) {
  return (
    <section id="about" className="py-8 sm:py-12 dark:bg-darkBlue-300 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main content - Left side */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F1D2F] dark:text-gray-100 mb-4 sm:mb-6">About Course</h2>

              <div className="max-w-4xl">
                <p className="text-[#0F1D2F] dark:text-gray-300 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                <RichTextRenderer contentJsonString={course.description} className="prose dark:prose-invert" />
                </p>

                {course.tags && course.tags.length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <h3 className="font-semibold text-[#0F1D2F] dark:text-gray-100 mb-3">Course Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag, index) => (
                        <span key={index} className="bg-yellow/10 text-yellow px-3 py-1 rounded-full text-sm font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p><strong className="text-[#0F1D2F] dark:text-gray-100">Instructor:</strong> <span className="text-[#6B7280] dark:text-gray-400">{course.instructor}</span></p>
                  <p><strong className="text-[#0F1D2F] dark:text-gray-100">Level:</strong> <span className="text-[#6B7280] dark:text-gray-400">{course.level}</span></p>
                  <p><strong className="text-[#0F1D2F] dark:text-gray-100">Category:</strong> <span className="text-[#6B7280] dark:text-gray-400">{course.category}</span></p>
                </div>
              </div>
            </div>

            {/* Course Info Card - Right side */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#2a2f3a] border border-gray-200 dark:border-[#404854] rounded-xl p-4 sm:p-6 shadow-sm lg:sticky lg:top-32 transition-colors duration-300">
                {/* Price Section */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2 mb-2 flex-wrap">
                    <span className={`text-2xl sm:text-3xl font-bold ${course.price === 0 ? "text-[#28a745]" : "text-[#0F1D2F] dark:text-gray-100"}`}>
                      {course.price === 0 ? "Free" : `₦${course.price.toLocaleString()}`}
                    </span>
                    {course.originalPrice && course.originalPrice > 0 && (
                      <>
                        <span className="text-base sm:text-lg text-[#6B7280] dark:text-gray-400 line-through">₦{course.originalPrice.toLocaleString()}</span>
                        <span className="bg-yellow text-white text-xs px-2 py-1 rounded">Special Offer</span>
                      </>
                    )}
                  </div>
                </div>

                {/* This Course Includes */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="font-semibold text-[#0F1D2F] dark:text-gray-100 mb-4">This Course Includes:</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-yellow rounded-sm flex items-center justify-center shrink-0">
                        <span className="text-white text-xs">▶</span>
                      </div>
                      <span className="text-[#0F1D2F] dark:text-gray-300">{course.lessons || course.totalLectures || 0} lessons</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-yellow rounded-sm flex items-center justify-center shrink-0">
                        <span className="text-white text-xs">⏱</span>
                      </div>
                      <span className="text-[#0F1D2F] dark:text-gray-300">Duration: {course.duration}</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-yellow rounded-sm flex items-center justify-center shrink-0">
                        <span className="text-white text-xs">∞</span>
                      </div>
                      <span className="text-[#0F1D2F] dark:text-gray-300">Full lifetime access</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-yellow rounded-sm flex items-center justify-center shrink-0">
                        <span className="text-white text-xs">🏆</span>
                      </div>
                      <span className="text-[#0F1D2F] dark:text-gray-300">Certificate of completion</span>
                    </li>
                  </ul>
                </div>

                {/* CTA Button */}
                <CheckoutButton
                  courseId={course.id}
                  price={course.price}
                  size="lg"
                  label={course.price === 0 ? "Enroll Free" : "Enroll Now"}
                  title={course.title}
                  thumbnail={course.image ? constructUrl(course.image) : undefined}
                  instructor={course.instructor}
                  className="w-full mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
