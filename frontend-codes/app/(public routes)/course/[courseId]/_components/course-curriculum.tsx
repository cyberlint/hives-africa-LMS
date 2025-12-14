"use client"

import { useState } from "react"
import { BookOpen, Clock, ChevronDown, ChevronUp, PlayCircle, FileText, HelpCircle, File } from "lucide-react"
import { Course } from "@/types/course"

interface CourseCurriculumProps {
  course: Course
}

export default function CourseCurriculum({ course }: CourseCurriculumProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  // Use real course sections/modules from API
  const curriculumData = course.sections || []
  const totalLessons = Array.isArray(course.lectures) ? course.lectures.length : (course.totalLectures || 0)

  // Helper function to get icon based on lesson type
  const getLessonIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return <PlayCircle className="w-4 h-4" />
      case 'document':
        return <FileText className="w-4 h-4" />
      case 'quiz':
        return <HelpCircle className="w-4 h-4" />
      default:
        return <File className="w-4 h-4" />
    }
  }

  // Helper function to format duration
  const formatDuration = (seconds?: number) => {
    if (!seconds) return ''
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <section id="curriculum" className="py-8 sm:py-12 dark:bg-[#1d2026] transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F1D2F] dark:text-gray-100">Course Curriculum</h2>
              <button className="text-yellow border border-yellow px-4 py-2 rounded-lg hover:bg-yellow hover:text-white transition-colors text-sm font-medium self-start sm:self-auto">
                Financial Aid →
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 sm:mb-8 text-[#6B7280] dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm sm:text-base">{totalLessons} lessons</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm sm:text-base">{course.duration} duration</span>
              </div>
            </div>

            {/* Curriculum List */}
            <div className="bg-[#F5F7FA] dark:bg-[#2a2f3a] rounded-2xl p-4 sm:p-6 lg:p-8 transition-colors duration-300">
              {curriculumData.length > 0 ? (
                <div className="space-y-2">
                  {curriculumData.map((section) => (
                    <div key={section.id} className="bg-white dark:bg-[#1d2026] border border-gray-200 dark:border-[#404854] rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleItem(section.id)}
                        className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-gray-50 dark:hover:bg-[#2a2f3a] transition-colors"
                      >
                        <div className="flex-1 pr-4">
                          <span className="font-medium text-[#0F1D2F] dark:text-gray-100 text-sm sm:text-base block">
                            {section.title}
                          </span>
                          <span className="text-xs text-[#6B7280] dark:text-gray-400 mt-1 block">
                            {section.lectures.length} lessons
                          </span>
                        </div>
                        {expandedItems.includes(section.id) ? (
                          <ChevronUp className="w-5 h-5 text-[#6B7280] flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[#6B7280] flex-shrink-0" />
                        )}
                      </button>

                      {expandedItems.includes(section.id) && (
                        <div className="px-3 sm:px-4 pb-3 sm:pb-4 bg-[#EFF4FB] dark:bg-[#1d2026] transition-colors duration-300">
                          <div className="space-y-2">
                            {section.lectures.map((lecture, index) => (
                              <div 
                                key={lecture.id} 
                                className="flex items-center justify-between py-2 px-3 bg-white dark:bg-[#2a2f3a] rounded-md hover:bg-gray-50 dark:hover:bg-[#1d2026] transition-colors"
                              >
                                <div className="flex items-center space-x-3 flex-1">
                                  <span className="text-[#6B7280] dark:text-gray-400">{getLessonIcon(lecture.type)}</span>
                                  <div className="flex-1">
                                    <p className="text-sm text-[#0F1D2F] dark:text-gray-300">{lecture.title}</p>
                                    {lecture.description && (
                                      <p className="text-xs text-[#6B7280] mt-1">{lecture.description}</p>
                                    )}
                                  </div>
                                </div>
                                {lecture.duration && (
                                  <span className="text-xs text-[#6B7280] ml-2">{formatDuration(lecture.duration)}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#6B7280]">No curriculum available yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
