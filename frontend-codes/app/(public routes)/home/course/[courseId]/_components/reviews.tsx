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
    <section id="reviews" className="py-12">
      <div className="container">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content - Left side */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-[#0F1D2F] mb-8">Reviews</h2>

            {/* Reviews Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {getCurrentReviews().map((review) => (
                <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  {/* Reviewer Info */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-[#00BFA6] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {review.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-[#0F1D2F]">{review.name}</div>
                      <div className="text-sm text-[#6B7280]">{review.role}</div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-[#0F1D2F] leading-relaxed">{review.review}</p>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="w-5 h-5 text-[#6B7280]" />
              </button>

              {/* Pagination Dots */}
              <div className="flex space-x-2">
                {[...Array(totalSlides)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i === currentSlide ? "bg-[#00BFA6]" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                disabled={currentSlide === totalSlides - 1}
              >
                <ChevronRight className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>
          </div>

          {/* Right side - Empty space to maintain layout */}
          <div className="lg:col-span-1"></div>
        </div>
      </div>
    </section>
  )
}
