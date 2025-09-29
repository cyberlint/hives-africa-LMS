import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface CourseCardProps {
  title: string
  category: string
  duration: string
  level: string
  provider: string
  badgeText: string
  imageUrl: string
}

export function CourseCard({ title, category, duration, level, provider, badgeText, imageUrl }: CourseCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group">
      <div className="relative">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          width={320}
          height={180}
          className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className="absolute top-3 right-3 bg-white text-gray-600 hover:bg-white shadow-sm">{badgeText}</Badge>
      </div>
      <div className="p-4">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>{category}</span>
          <span>{duration}</span>
        </div>
        <h3 className="font-bold text-gray-800 mb-2 group-hover:text-[#1a365d] transition-colors duration-200">
          {title}
        </h3>
        <div className="flex items-center text-xs">
          <Image
            src="/placeholder.svg?height=20&width=20"
            alt="Provider logo"
            width={16}
            height={16}
            className="mr-1"
          />
          <span className="text-gray-600">{provider}</span>
        </div>
      </div>
    </div>
  )
}
