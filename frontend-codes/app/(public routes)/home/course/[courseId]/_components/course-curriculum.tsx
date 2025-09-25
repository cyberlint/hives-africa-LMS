"use client"

import { useState } from "react"
import { BookOpen, Clock, ChevronDown, ChevronUp } from "lucide-react"

const curriculumData = [
  {
    id: 1,
    title: "Introduction to Business",
    description:
      "This subject provides a foundational overview of the business environment, introducing key concepts, structures, and functions of organisations.",
  },
  {
    id: 2,
    title: "Principles of Management",
    description:
      "Learn the fundamental principles of management including planning, organizing, leading, and controlling organizational resources.",
  },
  {
    id: 3,
    title: "Marketing Strategies",
    description:
      "Explore modern marketing concepts, consumer behavior, and strategic marketing planning in today's digital landscape.",
  },
  {
    id: 4,
    title: "Financial Accounting",
    description:
      "Understand the basics of financial accounting, including financial statements, budgeting, and financial analysis.",
  },
  {
    id: 5,
    title: "Organizational Behavior",
    description:
      "Study human behavior in organizational settings, including motivation, leadership, and team dynamics.",
  },
  {
    id: 6,
    title: "Business Ethics and Corporate Social Responsibility",
    description:
      "Examine ethical decision-making in business and the role of corporate social responsibility in modern organizations.",
  },
]

import { Course } from "@/types/course"

interface CourseCurriculumProps {
  course: Course
}

export default function CourseCurriculum({ course }: CourseCurriculumProps) {
  const [expandedItems, setExpandedItems] = useState<number[]>([1])

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <section id="curriculum" className="py-8 sm:py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F1D2F]">Course Curriculum</h2>
              <button className="text-yellow border border-yellow px-4 py-2 rounded-lg hover:bg-yellow hover:text-white transition-colors text-sm font-medium self-start sm:self-auto">
                Financial Aid →
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 sm:mb-8 text-[#6B7280]">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm sm:text-base">{course.lessons} lessons</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm sm:text-base">{course.duration} duration</span>
              </div>
            </div>

            {/* Curriculum List */}
            <div className="bg-[#F5F7FA] rounded-2xl p-4 sm:p-6 lg:p-8">
              <div className="space-y-2">
                {curriculumData.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-[#0F1D2F] text-sm sm:text-base pr-4">{item.title}</span>
                      {expandedItems.includes(item.id) ? (
                        <ChevronUp className="w-5 h-5 text-[#6B7280] flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#6B7280] flex-shrink-0" />
                      )}
                    </button>

                    {expandedItems.includes(item.id) && (
                      <div className="px-3 sm:px-4 pb-3 sm:pb-4 bg-[#EFF4FB]">
                        <p className="text-[#0F1D2F] leading-relaxed text-sm sm:text-base">{item.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
