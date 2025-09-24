"use client"

import { useState, useEffect } from "react"

import HeroSection from "./_components/hero-section"
import TabsNavigation from "./_components/tabs-navigation"
import AboutCourse from "./_components/about-course"
import CourseCurriculum from "./_components/course-curriculum"
import EntryRequirements from "./_components/entry-requirements"
import CourseFees from "./_components/course-fees"
import Reviews from "./_components/reviews"


export default function CourseDetailPage() {
  const [activeTab, setActiveTab] = useState("about")

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

  return (
    <div className="min-h-screen  bg-white">
      <HeroSection />
      <TabsNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="container mx-auto">
        <div id="about">
          <AboutCourse />
        </div>
        <div id="curriculum">
          <CourseCurriculum />
        </div>
        <div id="requirements">
          <EntryRequirements />
        </div>
        <div id="fees">
          <CourseFees />
        </div>
        <div id="reviews">
          <Reviews />
        </div>
      </main>

    </div>
  )
}
