"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProgressCard } from "./progress-card"

interface ProgressItem {
  id: string
  title: string
  duration: string
  progress: number
  imageUrl: string
}

const progressItems: ProgressItem[] = [
  {
    id: "1",
    title: "ChatGPT Prompt Engineering for Developers",
    duration: "10Hrs 30Mins",
    progress: 30,
    imageUrl: "/placeholder.jpg?height=96&width=128",
  },
  {
    id: "2",
    title: "ChatGPT Prompt Engineering for Developers",
    duration: "10Hrs 30Mins",
    progress: 30,
    imageUrl: "/placeholder.jpg?height=96&width=128",
  },
  {
    id: "3",
    title: "ChatGPT Prompt Engineering for Developers",
    duration: "10Hrs 30Mins",
    progress: 30,
    imageUrl: "/placeholder.jpg?height=96&width=128",
  },
  {
    id: "4",
    title: "ChatGPT Prompt Engineering for Developers",
    duration: "10Hrs 30Mins",
    progress: 30,
    imageUrl: "/placeholder.jpg?height=96&width=128",
  },
  {
    id: "5",
    title: "ChatGPT Prompt Engineering for Developers",
    duration: "10Hrs 30Mins",
    progress: 30,
    imageUrl: "/placeholder.jpg?height=96&width=128",
  },
]

export function ProgressSection() {
  const [activeTab, setActiveTab] = useState("in-progress")

  return (
    <section className="bg-[#f8f9fa] py-10 -mx-4 px-4">
      <div className="container mx-auto max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="border-b border-gray-200 w-full justify-start bg-transparent p-0 h-auto">
            <TabsTrigger
              value="in-progress"
              className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none px-4 py-2 text-base font-medium data-[state=active]:shadow-none bg-transparent hover:bg-gray-50 transition-colors duration-200"
            >
              In Progress
              <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded-full text-sm transition-colors duration-200">
                5
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none px-4 py-2 text-base font-medium data-[state=active]:shadow-none bg-transparent hover:bg-gray-50 transition-colors duration-200"
            >
              Completed
              <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded-full text-sm transition-colors duration-200">
                2
              </span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="in-progress" className="mt-6 space-y-4">
            {progressItems.map((item) => (
              <ProgressCard key={item.id} {...item} />
            ))}
          </TabsContent>
          <TabsContent value="completed" className="mt-6 space-y-4">
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">You have 2 completed courses.</p>
              <p className="text-sm mt-2">Great job on your learning journey!</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
