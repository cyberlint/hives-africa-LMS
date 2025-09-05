"use client"

import { VideoPlayer } from "@/components/lms/VideoPlayer"
import { CourseSidebar } from "@/components/lms/CourseSidebar"
import { NavigationArrows } from "@/components/lms/NavigationArrows"
import { SidebarTabs } from "@/components/lms/SidebarTabs"
import { useEffect, useState } from "react"

interface PageProps {
  params: Promise<{
    courseId: string
    chapterId: string
  }>
}

export default function ChapterPage({ params }: PageProps) {
  const [courseId, setCourseId] = useState<string>("")
  const [chapterId, setChapterId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("curriculum")

  useEffect(() => {
    async function loadParams() {
      try {
        const resolvedParams = await params
        setCourseId(resolvedParams.courseId)
        setChapterId(resolvedParams.chapterId)
      } catch (error) {
        console.error("Error loading params:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadParams()
  }, [params])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <VideoPlayer 
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
        />
        <NavigationArrows 
          canGoPrevious={true}
          canGoNext={true}
          onPrevious={() => console.log("Go to previous chapter")}
          onNext={() => console.log("Go to next chapter")}
          previousTitle="Previous Chapter"
          nextTitle="Next Chapter"
        />
      </div>

      <div className="w-80 border-l">
        <SidebarTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  )
}