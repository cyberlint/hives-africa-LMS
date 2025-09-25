export interface Course {
  id: number
  title: string
  instructor: string
  category: string
  duration: string
  students: number
  lessons: number
  level: string
  price: string
  originalPrice?: string
  rating: number
  image: string
  description: string
  tags: string[]
}

export interface FilterState {
  categories: string[]
  instructors: string[]
  priceTypes: string[]
  ratings: number[]
  levels: string[]
}

export interface Lecture {
  id: number
  title: string
  type: 'video' | 'document' | 'resource' | 'quiz'
  content?: string
  videoUrl?: string
  duration?: number
  completed?: boolean
  description?: string
  resources?: Array<{
    id: string
    title: string
    type: string
    url: string
  }>
  attachments?: Array<{
    id: string
    title: string
    description?: string
    type: string
    url: string
    fileSize?: string
  }>
}

export interface CourseSection {
  id: number
  title: string
  lectures: Lecture[]
}

export interface CourseData {
  id: string
  title: string
  description: string
  instructor: string
  lectures: Lecture[]
  sections: CourseSection[]
  completedLectures?: number
  totalLectures?: number
}