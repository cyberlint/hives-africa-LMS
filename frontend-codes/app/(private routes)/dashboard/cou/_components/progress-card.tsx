import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ProgressCardProps {
  title: string
  duration: string
  progress: number
  imageUrl: string
}

export function ProgressCard({ title, duration, progress, imageUrl }: ProgressCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row transition-all duration-300 hover:shadow-md group">
      <div className="sm:w-32 sm:h-24 mb-4 sm:mb-0 flex-shrink-0">
        <Image
          src={imageUrl || "/placeholder.jpg"}
          alt={title}
          width={128}
          height={96}
          className="w-full h-full object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex-1 sm:ml-4 flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <Badge variant="outline" className="text-gray-500 bg-white mb-1">
            Certificate
          </Badge>
          <span className="text-xs text-gray-500">{duration}</span>
        </div>
        <h3 className="font-bold text-gray-800 mb-2 group-hover:text-[#1a365d] transition-colors duration-200">
          {title}
        </h3>
        <div className="mt-auto flex items-center justify-between">
          <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-[#fbbf24] h-2.5 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="ml-2 text-gray-500 text-sm font-medium">{progress}%</span>
          <Link
            href="#"
            className="ml-4 text-blue-600 hover:text-blue-800 hover:underline flex items-center text-sm whitespace-nowrap transition-colors duration-200 group/link"
          >
            View Syllabus
            <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}
