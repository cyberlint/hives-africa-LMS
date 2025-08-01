"use client"

import Image from "next/image"
import { Star } from "lucide-react"
export interface Course {
  id: number
  title: string
  instructor: string
  category: string
  duration: string
  students: number
  lessons: number
  level: string
  price: string
  originalPrice?: string
  rating: number
  image: string
  description: string
  tags: string[]
}


interface CourseListProps {
  courses: Course[]
  onCourseSelect: (course: Course) => void
  isMobile: boolean
}

export function CourseList({ courses, onCourseSelect, isMobile }: CourseListProps) {
  return (
   <div className="space-y-4 mb-8">
      {courses.map((course) => (
        <div
          key={course.id}
          className={`bg-white rounded-xl shadow-sm border border-[#e9ecef] overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group ${
            isMobile ? "min-h-auto" : "h-44"
          }`}
          onClick={() => onCourseSelect(course)}
        >
          <div className={`flex ${isMobile ? "flex-col" : ""} ${isMobile ? "" : "h-full"}`}>
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

            <div
              className={`flex-1 ${isMobile ? "p-4" : "p-5"} ${isMobile ? "space-y-3" : "flex flex-col justify-between min-h-0"}`}
            >
              <div className={isMobile ? "space-y-2" : ""}>
                <p className="text-xs text-[#6c757d] mb-2">by {course.instructor}</p>
                <h3
                  className={`font-bold text-[#2c3e50] ${isMobile ? "text-base" : "text-lg"} mb-3 group-hover:text-[#ff6b35] transition-colors line-clamp-2`}
                >
                  {course.title}
                </h3>

                <p className={`text-sm text-[#6c757d] mb-4 line-clamp-2 ${isMobile ? "hidden" : "flex-shrink-0"}`}>
                  {course.description}
                </p>
              </div>

              <div
                className={`flex items-center gap-3 mb-4 text-xs text-[#6c757d] flex-wrap ${isMobile ? "gap-2" : "gap-4 flex-shrink-0"}`}
              >
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-[#ff6b35] rounded-full"></div>
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-[#ff6b35] rounded-full"></div>
                  <span>{course.students} Students</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-[#ff6b35] rounded-full"></div>
                  <span>{course.level}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-[#ff6b35] rounded-full"></div>
                  <span>{course.lessons} Lessons</span>
                </div>
              </div>

              <div className={`flex items-center justify-between ${isMobile ? "" : "mt-auto flex-shrink-0"}`}>
                <div className="flex items-center gap-2">
                  {course.originalPrice && (
                    <span className={`text-[#6c757d] line-through ${isMobile ? "text-sm" : "text-base"}`}>
                      {course.originalPrice}
                    </span>
                  )}
                  <span
                    className={`font-bold ${course.price === "Free" ? "text-[#28a745]" : "text-[#2c3e50]"} ${
                      isMobile ? "text-lg" : "text-xl"
                    }`}
                  >
                    {course.price}
                  </span>
                </div>
                <button
                  className="text-[#ff6b35] hover:underline font-medium group-hover:text-[#ff6b35]/80 transition-colors text-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onCourseSelect(course)
                  }}
                >
                  View More
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
