import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface EnrolledCourse {
  enrollmentId: string;
  courseId: string;
  title: string;
  description: string;
  instructor: string;
  instructorId: string;
  image: string;
  progress: number;
  totalLessons: number;
  duration: number;
  level: string;
  category: string;
  enrolledAt: string;
  completedAt?: string;
  thumbnail?: string;
  rating?: number;
  price?: number;
}

interface EnrollmentsResponse {
  enrollments: EnrolledCourse[];
}

// Fetch function
async function fetchEnrolledCourses(): Promise<EnrolledCourse[]> {
  const response = await fetch('/api/enrollments');
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch enrolled courses');
  }

  const data: EnrollmentsResponse = await response.json();
  return data.enrollments || [];
}

// Enroll in course mutation
async function enrollInCourse(courseId: string): Promise<void> {
  const response = await fetch('/api/enrollments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ courseId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to enroll in course');
  }
}

export function useEnrolledCourses() {
  const queryClient = useQueryClient();

  const {
    data: courses = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['enrolledCourses'],
    queryFn: fetchEnrolledCourses,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  // Mutation for enrolling in a course
  const enrollMutation = useMutation({
    mutationFn: enrollInCourse,
    onSuccess: () => {
      // Invalidate and refetch enrolled courses
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] });
      // Also invalidate all courses to update enrollment status
      queryClient.invalidateQueries({ queryKey: ['allCourses'] });
    },
  });

  return {
    courses,
    loading,
    error: error ? (error as Error).message : null,
    refetch,
    enroll: enrollMutation.mutate,
    isEnrolling: enrollMutation.isPending,
  };
}
