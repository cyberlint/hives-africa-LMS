"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

import HeroSection from "./_components/hero-section"
import TabsNavigation from "./_components/tabs-navigation"
import AboutCourse from "./_components/about-course"
import CourseCurriculum from "./_components/course-curriculum"
import EntryRequirements from "./_components/entry-requirements"
import CourseFees from "./_components/course-fees"
import Reviews from "./_components/reviews"

import { useCourseData } from "@/hooks/useCourseData"

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const [activeTab, setActiveTab] = useState("about")
  
  // Fetch course data from API
  const { courseData, loading, error } = useCourseData(courseId)

  // Update active tab based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["about", "curriculum", "requirements", "fees", "reviews"]
      const headerHeight = 80 + 60

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= headerHeight && rect.bottom > headerHeight) {
            setActiveTab(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    const element = document.getElementById(tabId)
    if (element) {
      const headerHeight = 80 + 60 // header + tabs height
      const elementPosition = element.offsetTop - headerHeight
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      })
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Course</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-yellow text-white rounded-md hover:bg-yellow/90"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Course not found state
  if (!courseData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h1>
          <p className="text-gray-600">The course you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <HeroSection course={courseData} />
      <TabsNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="w-full">
        <div id="about">
          <AboutCourse course={courseData} />
        </div>
        <div id="curriculum">
          <CourseCurriculum course={courseData} />
        </div>
        <div id="requirements">
          <EntryRequirements course={courseData} />
        </div>
        <div id="fees">
          <CourseFees course={courseData} />
        </div>
        <div id="reviews">
          <Reviews course={courseData} />
        </div>
      </main>
    </div>
  )
}
