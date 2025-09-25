"use client"

import { Star, User, Users, Clock, Search } from "lucide-react"
import Image from "next/image"
import { CheckoutButton } from "@/components/lms/checkout-button"

import { Course } from "@/types/course"

interface HeroSectionProps {
  course: Course
}

export default function HeroSection({ course }: HeroSectionProps) {
  return (
    <div className="relative">
      {/* Breadcrumb */}
      <div className="container mx-auto pb-4">
        <nav className="text-sm text-[#6B7280]">
          <span>Home</span>
          <span className="mx-2">{">"}</span>
          <span>Courses</span>
          <span className="mx-2">{">"}</span>
          <span>{course.category}</span>
          <span className="mx-2">{">"}</span>
          <span>{course.title}</span>
        </nav>
      </div>

      {/* Hero Banner */}
      <div className="relative h-[380px] bg-gradient-to-r from-[#0F1D2F]/80 to-[#0F1D2F]/60">
        <Image src={course.image || "/placeholder.svg"} alt="Course background" fill className="object-cover -z-10" />

        <div className="container mx-auto h-full">
          <div className="grid lg:grid-cols-2 gap-8 h-full items-center">
            {/* Left content */}
            <div className="text-white space-y-6">
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, index) => (
                  <span key={index} className="text-yellow underline text-sm">
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">{course.title}</h1>

              <p className="text-lg text-white/80 max-w-lg">
                {course.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{course.students}+ Learners</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow text-yellow" />
                  <span className="font-medium">{course.rating}</span>
                </div>
                <span className="text-white/80">({course.students} students) • {course.lessons} lessons</span>
              </div>
            </div>

            {/* Right card */}
            <div className="lg:justify-self-end">
              <div className="bg-white rounded-2xl p-6 shadow-lg max-w-sm w-full">
                {/* Price */}
                <div className="mb-4">
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
                  <p className="text-sm text-gray-600">Level: {course.level}</p>
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

                {/* Course Info */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lessons:</span>
                    <span>{course.lessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Students:</span>
                    <span>{course.students}</span>
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
