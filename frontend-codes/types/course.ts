export interface Course {
  id: string
  title: string
  instructor: string
  instructorId: string
  category: string
  duration: number // in hours
  students?: number
  lessons?: number
  totalLectures?: number // from API
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  price: number
  originalPrice?: number
  rating?: number
  image: string
  description: string
  shortDescription: string
  tags?: string[]
  slug: string
  status: 'Draft' | 'InReview' | 'Published' | 'Archived'
  createdAt: string
  updatedAt: string
  isEnrolled?: boolean
  enrollmentId?: string
  sections?: CourseSection[] // from API
  lectures?: Lecture[] // from API
  completedLectures?: number
  progress?: number
}

export interface FilterState {
  categories: string[]
  instructors: string[]
  priceTypes: string[]
  ratings: number[]
  levels: string[]
}

export interface Attachment {
  id: string
  title: string
  description?: string
  type: string
  url: string
  fileSize?: string
}

export interface Lecture {
  id: string
  title: string
  type: 'video' | 'document' | 'resource' | 'quiz'
  content?: string
  videoUrl?: string
  videoKey?: string
  thumbnailKey?: string
  duration?: number // in seconds
  completed?: boolean
  description?: string
  position: number
  attachments?: Attachment[]
  currentTime?: number
  documentKey?: string
  quizConfig?: any
}

export interface CourseSection {
  id: string
  title: string
  position: number
  lectures: Lecture[]
}

export interface CourseData {
  id: string
  title: string
  description: string
  shortDescription: string
  instructor: string
  instructorId: string
  price: number
  duration: number
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  image: string
  slug: string
  status: 'Draft' | 'InReview' | 'Published' | 'Archived'
  lectures: Lecture[]
  sections: CourseSection[]
  completedLectures?: number
  totalLectures?: number
  progress?: number
  isEnrolled?: boolean
  enrollmentId?: string
  createdAt: string
  updatedAt: string
}

export interface EnrollmentData {
  id: string
  userId: string
  courseId: string
  enrolledAt: string
  completedAt?: string
  progress: number
  paymentReference?: string
  paymentStatus: 'Pending' | 'Completed' | 'Failed' | 'Refunded'
  paymentAmount?: number
  paidAt?: string
}

export interface LessonProgressData {
  id: string
  userId: string
  lessonId: string
  completed: boolean
  completedAt?: string
  currentTime?: number
}