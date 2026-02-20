import { Header } from "./_components/header"
import { Navigation } from "./_components/navigation"
import { CourseSection } from "./_components/course-section"
import { ProgressSection } from "./_components/progress-section"
import { Footer } from "./_components/footer"

const recentCourses = [
  {
    id: "1",
    title: "Course Title",
    category: "Category",
    duration: "Duration",
    level: "Starter",
    provider: "Hive Africa/Stanford",
    badgeText: "Tag",
    imageUrl: "/placeholder.jpg?height=180&width=320",
  },
  {
    id: "2",
    title: "AI Python for Beginners",
    category: "Starter",
    duration: "21Hrs 30Min",
    level: "Starter",
    provider: "Hive Africa/Stanford",
    badgeText: "Course",
    imageUrl: "/placeholder.jpg?height=180&width=320",
  },
  {
    id: "3",
    title: "AI Python for Beginners",
    category: "Starter",
    duration: "10Hrs 30Min",
    level: "Starter",
    provider: "Hive Africa/Stanford",
    badgeText: "Course",
    imageUrl: "/placeholder.jpg?height=180&width=320",
  },
  {
    id: "4",
    title: "Prompt Engineering for beginners",
    category: "Starter",
    duration: "21Hrs 30Min",
    level: "Starter",
    provider: "Hive Africa/Stanford",
    badgeText: "Course",
    imageUrl: "/placeholder.jpg?height=180&width=320",
  },
]

const popularCertificates = [
  {
    id: "1",
    title: "Course Title",
    category: "Category",
    duration: "Duration",
    level: "Starter",
    provider: "Hive Africa/Stanford",
    badgeText: "Cert",
    imageUrl: "/placeholder.jpg?height=180&width=320",
  },
  {
    id: "2",
    title: "Google Digital Marketing and E-commerce",
    category: "Starter",
    duration: "21Hrs 30Min",
    level: "Starter",
    provider: "Hive Africa/Stanford",
    badgeText: "Cert",
    imageUrl: "/placeholder.jpg?height=180&width=320",
  },
  {
    id: "3",
    title: "Language Model",
    category: "Starter",
    duration: "10Hrs 30Min",
    level: "Starter",
    provider: "Hive Africa/Stanford",
    badgeText: "Cert",
    imageUrl: "/placeholder.jpg?height=180&width=320",
  },
  {
    id: "4",
    title: "Prompt Engineering for beginners",
    category: "Starter",
    duration: "21Hrs 30Min",
    level: "Starter",
    provider: "Hive Africa/Stanford",
    badgeText: "Cert",
    imageUrl: "/placeholder.jpg?height=180&width=320",
  },
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* <Header />
      <Navigation /> */}

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <CourseSection title="Recently Viewed Courses" courses={recentCourses} />

          <CourseSection title="Most Popular Certificates" courses={popularCertificates} />
        </div>

        <ProgressSection />
      </main>

      {/* <Footer /> */}
    </div>
  )
}
