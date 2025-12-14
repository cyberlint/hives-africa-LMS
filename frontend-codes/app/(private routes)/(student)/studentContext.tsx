// context/DashboardContext.tsx
"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { useEnrolledCourses, type EnrolledCourse } from "@/hooks/useEnrolledCourses"
import { useAllCourses, type CourseListItem } from "@/hooks/useAllCourses"
import { useAuth } from "@/contexts/AuthContext"

// Transform enrolled course to match old Course type
interface TransformedCourse {
  id: string
  title: string
  description: string
  instructor: {
    name: string
    avatar: string
  }
  thumbnail: string
  fileKey: string
  duration: number
  lectures: any[]
  rating: number
  price: number
  category: string
  level: string
  language: string
}

interface CourseProgress {
  courseId: string
  progress: number
  lastAccessed: string
}

interface User {
  id: string
  name: string
  email: string
  avatar: string
  enrolledCourses: string[]
  wishlist: string[]
  progress: CourseProgress[]
  achievements: string[]
  preferences: {
    language: string
    autoplay: boolean
    quality: string
  }
}

interface DashboardContextProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  user: User
  handleTabChange: (tab: string) => void
  handleCartClick: () => void
  courses: TransformedCourse[]
  enrolledCourses: TransformedCourse[]
  wishlistCourses: TransformedCourse[]
  loading: boolean
  error: string | null
  refetch: () => void
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined)

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (!context) throw new Error("useDashboard must be used within a DashboardProvider")
  return context
}

export const DashboardProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { user: authUser } = useAuth()
  
  // Fetch enrolled courses from API
  const { 
    courses: enrolledCoursesData, 
    loading: enrolledLoading, 
    error: enrolledError,
    refetch: refetchEnrolled 
  } = useEnrolledCourses()
  
  // Fetch all courses from API
  const { 
    courses: allCoursesData, 
    loading: allCoursesLoading, 
    error: allCoursesError,
    refetch: refetchAll 
  } = useAllCourses()

  // Transform enrolled courses to match old format
  const enrolledCourses: TransformedCourse[] = enrolledCoursesData.map((course) => ({
    id: course.courseId,
    title: course.title,
    description: course.description,
    instructor: {
      name: course.instructor,
      avatar: "", // TODO: Add instructor avatar to API
    },
    thumbnail: course.image || course.thumbnail || "/ai.png",
    fileKey: course.image || course.thumbnail || "",
    duration: course.duration * 60, // Convert hours to minutes
    lectures: [], // TODO: Fetch lectures if needed
    rating: 4.5, // TODO: Add ratings to API
    price: 0, // Already enrolled
    category: course.category,
    level: course.level,
    language: "English", // TODO: Add to API
  }))

  // Transform all courses to match old format
  const courses: TransformedCourse[] = allCoursesData.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    instructor: {
      name: course.instructor,
      avatar: course.instructorAvatar || "",
    },
    thumbnail: course.thumbnail || "/ai.png",
    fileKey: course.thumbnail || "",
    duration: course.duration * 60, // Convert hours to minutes
    lectures: [], // TODO: Fetch lectures if needed
    rating: course.rating,
    price: course.price,
    category: course.category,
    level: course.level,
    language: course.language,
  }))

  // Create user object from auth and enrolled courses
  const user: User = {
    id: authUser?.id || "guest",
    name: authUser?.full_name || authUser?.first_name || "Guest User",
    email: authUser?.email || "guest@example.com",
    avatar: authUser?.profile_picture || "",
    enrolledCourses: enrolledCoursesData.map((c) => c.courseId),
    wishlist: [], // TODO: Implement wishlist API
    progress: enrolledCoursesData.map((c) => ({
      courseId: c.courseId,
      progress: c.progress,
      lastAccessed: c.enrolledAt, // Use enrolledAt as lastAccessed for now
    })),
    achievements: [], // TODO: Implement achievements API
    preferences: {
      language: "en",
      autoplay: true,
      quality: "auto",
    },
  }

  const wishlistCourses: TransformedCourse[] = [] // TODO: Implement wishlist

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const handleCartClick = () => {
    setActiveTab("cart")
  }

  const refetch = () => {
    refetchEnrolled()
    refetchAll()
  }

  const loading = enrolledLoading || allCoursesLoading
  const error = enrolledError || allCoursesError

  return (
    <DashboardContext.Provider
      value={{ 
        activeTab, 
        setActiveTab, 
        user, 
        enrolledCourses, 
        wishlistCourses, 
        courses, 
        handleCartClick, 
        handleTabChange,
        loading,
        error,
        refetch
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}
