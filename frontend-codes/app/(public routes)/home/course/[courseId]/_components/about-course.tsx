import { CheckoutButton } from "@/components/lms/checkout-button"
import { Course } from "@/types/course"

interface AboutCourseProps {
  course: Course
}

export default function AboutCourse({ course }: AboutCourseProps) {
  return (
    <section id="about" className="py-12">
      <div className="container">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content - Left side */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-[#0F1D2F] mb-6">About Course</h2>

            <div className="max-w-4xl">
              <p className="text-[#0F1D2F] text-lg leading-relaxed mb-6">
                {course.description}
              </p>

              <div className="mb-6">
                <h3 className="font-semibold text-[#0F1D2F] mb-3">Course Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, index) => (
                    <span key={index} className="bg-yellow/10 text-yellow px-3 py-1 rounded-full text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p><strong>Instructor:</strong> {course.instructor}</p>
                <p><strong>Level:</strong> {course.level}</p>
                <p><strong>Category:</strong> {course.category}</p>
              </div>
            </div>
          </div>

          {/* Course Info Card - Right side */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-32">
              {/* Price Section */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`text-3xl font-bold ${course.price === "Free" ? "text-[#28a745]" : "text-[#0F1D2F]"}`}>
                    {course.price}
                  </span>
                  {course.originalPrice && (
                    <>
                      <span className="text-lg text-[#6B7280] line-through">{course.originalPrice}</span>
                      <span className="bg-yellow text-white text-xs px-2 py-1 rounded">Special Offer</span>
                    </>
                  )}
                </div>
              </div>

              {/* This Course Includes */}
              <div className="mb-6">
                <h3 className="font-semibold text-[#0F1D2F] mb-4">This Course Includes :</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs">▶</span>
                    </div>
                    <span className="text-[#0F1D2F]">{course.lessons} lessons</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs">⏱</span>
                    </div>
                    <span className="text-[#0F1D2F]">Duration: {course.duration}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs">∞</span>
                    </div>
                    <span className="text-[#0F1D2F]">Full lifetime access</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs">🏆</span>
                    </div>
                    <span className="text-[#0F1D2F]">Certificate of completion</span>
                  </li>
                </ul>
              </div>

              {/* CTA Button */}
              <CheckoutButton
                courseId={course.id}
                price={course.price}
                size="lg"
                label={course.price === "Free" ? "Enroll Free" : "Enroll Now"}
                title={course.title}
                thumbnail={course.image}
                instructor={course.instructor}
                className="w-full mb-4"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
