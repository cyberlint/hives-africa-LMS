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

export default function CourseCurriculum() {
  const [expandedItems, setExpandedItems] = useState<number[]>([1])

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <>
        <main className="flex flex-col gap-2" >
            <div className="flex justify-between items-center">
                      <h2 className="text-3xl font-bold text-[#0F1D2F]">Course Curriculum</h2>
                      <button className="text-[#00BFA6] border border-[#00BFA6] px-4 py-2 rounded-lg hover:bg-[#00BFA6] hover:text-white transition-colors">
                        Financial Aid →
                      </button>
                    </div>
  {/* Stats */}
            <div className="flex items-center space-x-6 mb-6 text-[#6B7280]">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>47 lectures</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>10.4h duration</span>
              </div>
            </div>

        </main>

    <section id="curriculum" className="py-12 px-8 max-w-[821px] rounded-2xl bg-[#F5F7FA]">
      <div className="container">
        
        <div className="flex flex-col gap-8">
          {/* Main content - Left side */}
          <div className="">
          

          

            {/* Curriculum List */}
            <div className="space-y-2">
              {curriculumData.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-[#0F1D2F]">{item.title}</span>
                    {expandedItems.includes(item.id) ? (
                      <ChevronUp className="w-5 h-5 text-[#6B7280]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#6B7280]" />
                    )}
                  </button>

                  {expandedItems.includes(item.id) && (
                    <div className="px-4 pb-4 bg-[#EFF4FB]">
                      <p className="text-[#0F1D2F] leading-relaxed">{item.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
    </>
  )
}
