"use client"

import { useState } from "react"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

const reviewsData = [
  {
    id: 1,
    name: "John Doe",
    role: "Software Engineer",
    rating: 5,
    review:
      "The (Hons) Business and Management course provided me with a well-rounded understanding of business fundamentals.",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Marketing Manager",
    rating: 5,
    review:
      "The curriculum of this course is thoughtfully designed, covering everything from marketing to strategic management.",
  },
  {
    id: 3,
    name: "Mike Johnson",
    role: "Business Analyst",
    rating: 4,
    review:
      "Excellent course structure and knowledgeable instructors. Highly recommend for anyone looking to advance their business career.",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    role: "Project Manager",
    rating: 5,
    review:
      "This course helped me develop critical thinking skills and practical knowledge that I use daily in my work.",
  },
]

import { Course } from "@/types/course"

interface ReviewsProps {
  course: Course
}

export default function Reviews({ course }: ReviewsProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const reviewsPerPage = 2

  const totalSlides = Math.ceil(reviewsData.length / reviewsPerPage)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const getCurrentReviews = () => {
    const start = currentSlide * reviewsPerPage
    return reviewsData.slice(start, start + reviewsPerPage)
  }

  return (
    <section id="reviews" className="py-8 sm:py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F1D2F]">Student Reviews</h2>
              <div className="flex items-center space-x-2 text-sm text-[#6B7280]">
                <Star className="w-4 h-4 fill-yellow text-yellow" />
                <span className="font-medium text-[#0F1D2F]">{course.rating || 4.5}</span>
                <span>({course.students || 0} reviews)</span>
              </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 mb-6 sm:mb-8">
              {getCurrentReviews().map((review) => (
                <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                  {/* Reviewer Info */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm sm:text-base">
                        {review.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-[#0F1D2F] text-sm sm:text-base truncate">{review.name}</div>
                      <div className="text-xs sm:text-sm text-[#6B7280] truncate">{review.role}</div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${i < review.rating ? "fill-yellow text-yellow" : "text-gray-300"}`}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-[#0F1D2F] leading-relaxed text-sm sm:text-base">{review.review}</p>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#6B7280]" />
              </button>

              {/* Pagination Dots */}
              <div className="flex space-x-2">
                {[...Array(totalSlides)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                      i === currentSlide ? "bg-yellow" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentSlide === totalSlides - 1}
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#6B7280]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
