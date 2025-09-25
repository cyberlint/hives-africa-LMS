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

import { Course } from "@/types/course"
import { courses } from "@/data/courses"

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = parseInt(params.courseId as string)
  const [activeTab, setActiveTab] = useState("about")
  const [course, setCourse] = useState<Course | null>(null)

  // Find the course by ID
  useEffect(() => {
    const foundCourse = courses.find(c => c.id === courseId)
    setCourse(foundCourse || null)
  }, [courseId])

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

  if (!course) {
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
      <HeroSection course={course} />
      <TabsNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="container mx-auto">
        <div id="about">
          <AboutCourse course={course} />
        </div>
        <div id="curriculum">
          <CourseCurriculum course={course} />
        </div>
        <div id="requirements">
          <EntryRequirements course={course} />
        </div>
        <div id="fees">
          <CourseFees course={course} />
        </div>
        <div id="reviews">
          <Reviews course={course} />
        </div>
      </main>
    </div>
  )
}
