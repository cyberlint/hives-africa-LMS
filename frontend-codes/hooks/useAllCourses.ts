import { useQuery } from '@tanstack/react-query';

export interface CourseListItem {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  instructor: string;
  instructorId: string;
  instructorAvatar?: string;
  thumbnail: string;
  image: string;
  duration: number;
  totalLessons: number;
  rating: number;
  students: number;
  price: number;
  category: string;
  level: string;
  language: string;
  slug: string;
  status: string;
  isEnrolled: boolean;
  enrollmentId?: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

interface UseAllCoursesOptions {
  category?: string;
  level?: string;
  search?: string;
}

interface CoursesResponse {
  courses: CourseListItem[];
}

// Fetch function
async function fetchCourses(options: UseAllCoursesOptions): Promise<CourseListItem[]> {
  // Build query params
  const params = new URLSearchParams();
  if (options.category) params.append('category', options.category);
  if (options.level) params.append('level', options.level);
  if (options.search) params.append('search', options.search);

  const response = await fetch(`/api/courses?${params.toString()}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch courses');
  }

  const data: CoursesResponse = await response.json();
  return data.courses || [];
}

export function useAllCourses(options: UseAllCoursesOptions = {}) {
  const {
    data: courses = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['allCourses', options],
    queryFn: () => fetchCourses(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  return {
    courses,
    loading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}
