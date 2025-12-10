"use client"

import { Star, User, Users, Clock } from "lucide-react"
import Image from "next/image"
import { CheckoutButton } from "@/components/lms/checkout-button"
import { constructUrl } from "@/lib/construct-url"

import { Course } from "@/types/course"

interface HeroSectionProps {
  course: Course
}

export default function HeroSection({ course }: HeroSectionProps) {
  return (
    <div className="relative">
      {/* Breadcrumb */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto pb-4">
          <nav className="text-sm text-[#6B7280] overflow-x-auto">
            <div className="flex items-center space-x-2 whitespace-nowrap">
              <span>Home</span>
              <span>{">"}</span>
              <span>Courses</span>
              <span>{">"}</span>
              <span className="hidden sm:inline">{course.category}</span>
              <span className="hidden sm:inline">{">"}</span>
              <span className="truncate max-w-[200px] sm:max-w-none">{course.title}</span>
            </div>
          </nav>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative min-h-[480px] sm:h-[380px] bg-gradient-to-r from-[#0F1D2F]/80 to-[#0F1D2F]/60">
        <Image src={course.image ? constructUrl(course.image) : "/placeholder.svg"} alt="Course background" fill className="object-cover -z-10" />

        <div className="w-full px-4 sm:px-6 lg:px-8 h-full">
          <div className="max-w-7xl mx-auto h-full">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 h-full items-center py-8 lg:py-0">
              {/* Left content */}
              <div className="text-white space-y-4 lg:space-y-6">
                <div className="flex flex-wrap gap-2">
                  {course.tags && course.tags.length > 0 ? (
                    course.tags.map((tag, index) => (
                      <span key={index} className="text-yellow underline text-sm">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-yellow underline text-sm">
                      {course.category}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">{course.title}</h1>

                <p className="text-base lg:text-lg text-white/80 max-w-lg">
                  {course.description}
                </p>

                {/* Stats */}
                <section className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-4 lg:gap-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{course.instructor}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span>{course.students || 0}+ Learners</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>{course.duration}</span>
                  </div>
                </div>
                 {/* Rating */}
                <div className="flex items-center space-x-2 text-sm">

                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow text-yellow" />
                    <span className="font-medium">{course.rating || 4.5}</span>
                  </div>
                  <span className="text-white/80">({course.students || 0} students) • {course.lessons || course.totalLectures || 0} lessons</span>
                </div>
                </section>

             

              </div>

              {/* Right card */}
              <div className="lg:justify-self-end w-full max-w-md">
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg w-full   mx-auto lg:mx-0">
                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2 flex-wrap">
                      <span className={`text-2xl sm:text-3xl font-bold ${course.price === 0 ? "text-[#28a745]" : "text-[#0F1D2F]"}`}>
                        {course.price === 0 ? "Free" : `₦${course.price.toLocaleString()}`}
                      </span>
                      {course.originalPrice && course.originalPrice > 0 && (
                        <>
                          <span className="text-base sm:text-lg text-[#6B7280] line-through">₦{course.originalPrice.toLocaleString()}</span>
                          <span className="bg-yellow text-white text-xs px-2 py-1 rounded">Special Offer</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Level: {course.level}</p>
                  </div>

                  <CheckoutButton
                    courseId={course.id}
                    price={course.price}
                    size="lg"
                    label={course.isEnrolled ? "Continue Learning" : (course.price === 0 ? "Enroll Free" : "Enroll Now")}
                    title={course.title}
                    thumbnail={course.image ? constructUrl(course.image) : undefined}
                    instructor={course.instructor}
                    isEnrolled={course.isEnrolled}
                    className="w-full mb-4"
                  />

                  {/* Course Info */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lessons:</span>
                      <span>{course.lessons || course.totalLectures || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Students:</span>
                      <span>{course.students || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
