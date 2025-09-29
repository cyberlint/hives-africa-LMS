"use client"

import Image from "next/image"
import { Star } from "lucide-react"
import { CheckoutButton } from "@/components/lms/checkout-button"
import { useRouter } from "next/navigation"
import { Course } from "@/types/course"


interface CourseListProps {
  courses: Course[]
  isMobile: boolean
}

export function CourseList({ courses, isMobile }: CourseListProps) {
  const router = useRouter()

  const handleCourseClick = (courseId: number) => {
    router.push(`/course/${courseId}`)
  }

  return (
    <div className="space-y-4 mb-8">
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-white rounded-xl shadow-sm border border-[#e9ecef] overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group min-h-44"
          onClick={() => handleCourseClick(course.id)}
        >
          <div className={`flex ${isMobile ? "flex-col" : ""} h-full`}>
            <div className={`relative ${isMobile ? "w-full h-48" : "w-44 h-44"} flex-shrink-0`}>
              <Image
                src={course.image || "/placeholder.svg"}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute top-3 left-3 bg-[#1a2332] text-white px-2 py-1 rounded text-xs font-medium">
                {course.category}
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded">
                <Star className="w-3 h-3 fill-[#ff6b35] text-[#ff6b35]" />
                <span className="text-xs font-medium">{course.rating}</span>
              </div>
            </div>

            <div className="flex-1 p-5 flex flex-col justify-between">
              <div className="flex-1">
                <p className="text-xs text-[#6c757d] mb-2">by {course.instructor}</p>
                <h3 className="font-bold text-[#2c3e50] text-lg mb-3 group-hover:text-[#ff6b35] transition-colors">
                  {course.title}
                </h3>

                <p className="text-sm text-[#6c757d] mb-4 line-clamp-2">{course.description}</p>

                <div className="flex items-center gap-4 mb-4 text-xs text-[#6c757d] flex-wrap">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-yellow rounded-full"></div>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-yellow rounded-full"></div>
                    <span>{course.students} Students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-yellow rounded-full"></div>
                    <span>{course.level}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-yellow rounded-full"></div>
                    <span>{course.lessons} Lessons</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  {course.originalPrice && (
                    <span className="text-base text-[#6c757d] line-through">{course.originalPrice}</span>
                  )}
                  <span
                    className={`text-xl font-bold ${course.price === "Free" ? "text-[#28a745]" : "text-[#2c3e50]"}`}
                  >
                    {course.price}
                  </span>
                </div>
                <CheckoutButton
                  courseId={course.id}
                  price={course.price}
                  size="sm"
                  label={course.price === "Free" ? "Enroll" : "Add to Cart"}
                  title={course.title}
                  thumbnail={course.image}
                  instructor={course.instructor}
                  autoNavigate={false}
                  className="shrink-0 whitespace-nowrap"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
