import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

// Enroll mutation function
async function enrollInCourse(courseId: string): Promise<any> {
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

  return response.json();
}

// Check enrollment function
async function checkEnrollmentStatus(courseId: string) {
  const response = await fetch(`/api/courses/${courseId}`);
  
  if (!response.ok) {
    throw new Error('Failed to check enrollment status');
  }

  const data = await response.json();
  return {
    isEnrolled: data.isEnrolled,
    enrollmentId: data.enrollmentId,
  };
}

export function useEnrollment() {
  const queryClient = useQueryClient();

  const enrollMutation = useMutation({
    mutationFn: enrollInCourse,
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] });
      queryClient.invalidateQueries({ queryKey: ['allCourses'] });
    },
  });

  const enrollInFreeCourse = async (courseId: string) => {
    return enrollMutation.mutateAsync(courseId);
  };

  const checkEnrollment = async (courseId: string) => {
    return checkEnrollmentStatus(courseId);
  };

  return {
    enrollInFreeCourse,
    checkEnrollment,
    enrolling: enrollMutation.isPending,
  };
}

// Hook to check enrollment status with caching
export function useEnrollmentStatus(courseId: string) {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['enrollmentStatus', courseId],
    queryFn: () => checkEnrollmentStatus(courseId),
    enabled: !!courseId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    isEnrolled: data?.isEnrolled ?? false,
    enrollmentId: data?.enrollmentId,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
