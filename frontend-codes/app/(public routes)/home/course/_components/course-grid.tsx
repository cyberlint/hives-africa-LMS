"use client"

import Image from "next/image"
import { Star } from "lucide-react"
import { CheckoutButton } from "@/components/lms/checkout-button"
import { useRouter } from "next/navigation"
import { Course } from "@/types/course"


interface CourseGridProps {
  courses: Course[]
  isMobile: boolean
  isTablet: boolean
}

export function CourseGrid({ courses, isMobile, isTablet }: CourseGridProps) {
  const router = useRouter()

  const getGridCols = () => {
    if (isMobile) return "grid-cols-1"
    if (isTablet) return "grid-cols-2"
    return "grid-cols-2"
  }

  const handleCourseClick = (courseId: number) => {
    router.push(`/home/course/${courseId}`)
  }

  return (
    <div className={`grid ${getGridCols()} gap-6 mb-8`}>
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-white rounded-xl shadow-sm border border-[#e9ecef] overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
          onClick={() => handleCourseClick(course.id)}
        >
          <div className="relative">
            <Image
              src={course.image || "/placeholder.svg"}
              alt={course.title}
              width={360}
              height={200}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute top-3 left-3 bg-[#1a2332] text-white px-2 py-1 rounded text-xs font-medium">
              {course.category}
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded">
              <Star className="w-3 h-3 fill-yellow/90 text-yellow/90" />
              <span className="text-xs font-medium">{course.rating}</span>
            </div>
          </div>

          <div className="p-4">
            <p className="text-xs text-[#6c757d] mb-2">by {course.instructor}</p>
            <h3 className="font-bold text-[#2c3e50] text-base mb-3 line-clamp-2 leading-tight group-hover:text-yellow/90 transition-colors">
              {course.title}
            </h3>

            <div className="flex items-center gap-3 mb-4 text-xs text-[#6c757d] flex-wrap">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-yellow/90 rounded-full"></div>
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-yellow/90 rounded-full"></div>
                <span>{course.students} Students</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-yellow/90 rounded-full"></div>
                <span>{course.level}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-yellow/90 rounded-full"></div>
                <span>{course.lessons} Lessons</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  {course.originalPrice && (
                    <span className="text-sm text-[#6c757d] line-through">{course.originalPrice}</span>
                  )}
                  <span className={`text-lg font-bold ${course.price === "Free" ? "text-[#28a745]" : "text-[#2c3e50]"}`}>
                    {course.price}
                  </span>
                </div>
                <button
                  className="text-yellow/90 hover:underline text-xs font-medium text-left mt-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCourseClick(course.id);
                  }}
                >
                  View details
                </button>
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
                className="shrink-0"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
