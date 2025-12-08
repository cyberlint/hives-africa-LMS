import { useQuery } from '@tanstack/react-query';
import { CourseData } from '@/types/course';

// Fetch function
async function fetchCourse(courseId: string): Promise<CourseData> {
  const response = await fetch(`/api/courses/${courseId}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch course');
  }

  return response.json();
}

export function useCourseData(courseId: string) {
  const {
    data: courseData = null,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourse(courseId),
    enabled: !!courseId, // Only fetch if courseId exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    courseData,
    loading,
    error: error ? (error as Error).message : null,
  };
}
