import Link from "next/link"
import { CourseCard } from "./course-card"

interface Course {
  id: string
  title: string
  category: string
  duration: string
  level: string
  provider: string
  badgeText: string
  imageUrl: string
}

interface CourseSectionProps {
  title: string
  courses: Course[]
  showSeeMore?: boolean
}

export function CourseSection({ title, courses, showSeeMore = true }: CourseSectionProps) {
  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#374151]">{title}</h2>
        {/* {showSeeMore && (
          <Link
            href="#"
            className="text-orange-600 hover:text-blue-800 hover:underline transition-colors duration-200 hidden sm:block"
          >
            See more
          </Link>
        )} */}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {courses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
      {showSeeMore && (
        <div className="mt-4 flex justify-end">
          <Link href="#" className="text-yellow-600 hover:text-orange-800 hover:underline transition-colors duration-200 border rounded-none px-4 py-2">
            See more
          </Link>
        </div>
      )}
    </section>
  )
}
