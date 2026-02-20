"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Users, BookOpen, Award, X } from "lucide-react"
import Image from "next/image"
import type { Course } from "@/types/course"
import { CheckoutButton } from "@/components/lms/checkout-button"
import { RichTextRenderer } from "@/components/lms/RichTextRenderer"

interface CourseModalProps {
  course: Course
  isOpen: boolean
  onClose: () => void
}

export function CourseModal({ course, isOpen, onClose }: CourseModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-2xl font-bold text-[#2c3e50] pr-8">{course.title}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-[#f8f9fa]">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Image and Basic Info */}
          <div>
            <div className="relative mb-4">
              <Image
                src={course.image || "/placeholder.jpg"}
                alt={course.title}
                width={500}
                height={300}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute top-3 left-3 bg-[#1a2332] text-white px-3 py-1 rounded text-sm font-medium">
                {course.category}
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded">
                <Star className="w-4 h-4 fill-[#ff6b35] text-[#ff6b35]" />
                <span className="text-sm font-medium">{course.rating}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#2c3e50] mb-2">Course Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {course.tags?.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="bg-[#f8f9fa] text-[#6c757d] hover:bg-[#e9ecef]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#2c3e50] mb-2">Description</h3>
                <div className="text-[#6c757d] leading-relaxed">
                  <RichTextRenderer contentJsonString={course.description} className="prose prose-sm dark:prose-invert max-w-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details and Actions */}
          <div>
            <div className="bg-[#f8f9fa] rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {course.originalPrice && (
                    <span className="text-lg text-[#6c757d] line-through">{course.originalPrice}</span>
                  )}
                  <span
                    className={`text-3xl font-bold ${course.price === 0 ? "text-[#28a745]" : "text-[#2c3e50]"}`}
                  >
                    {course.price === 0 ? "Free" : `₦${course.price.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <CheckoutButton
                courseId={course.id}
                price={course.price}
                title={course.title}
                thumbnail={course.image}
                instructor={course.instructor}
                label={course.price === 0 ? "Enroll Free" : "Add to Cart"}
                autoNavigate={false}
                className="w-full mb-4"
              />

              <Button
                variant="outline"
                className="w-full border-[#ff6b35] text-[#ff6b35] hover:bg-yellow hover:text-white bg-transparent"
              >
                Add to Wishlist
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#2c3e50] mb-3">Course Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[#ff6b35]" />
                    <span className="text-[#6c757d]">Instructor:</span>
                    <span className="font-medium text-[#2c3e50]">{course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#ff6b35]" />
                    <span className="text-[#6c757d]">Duration:</span>
                    <span className="font-medium text-[#2c3e50]">{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-[#ff6b35]" />
                    <span className="text-[#6c757d]">Lessons:</span>
                    <span className="font-medium text-[#2c3e50]">{course.lessons} Lessons</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-[#ff6b35]" />
                    <span className="text-[#6c757d]">Level:</span>
                    <span className="font-medium text-[#2c3e50]">{course.level}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[#ff6b35]" />
                    <span className="text-[#6c757d]">Students:</span>
                    <span className="font-medium text-[#2c3e50]">{course.students} enrolled</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#2c3e50] mb-3">What you&apos;ll learn</h3>
                <ul className="space-y-2 text-[#6c757d]">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow rounded-full mt-2 shrink-0"></div>
                    <span>Master the fundamentals and advanced concepts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow rounded-full mt-2 shrink-0"></div>
                    <span>Build real-world projects and applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow rounded-full mt-2 shrink-0"></div>
                    <span>Get hands-on experience with industry tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow rounded-full mt-2 shrink-0"></div>
                    <span>Receive certificate upon completion</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
