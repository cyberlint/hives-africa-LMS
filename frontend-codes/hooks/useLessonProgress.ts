import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateProgressData {
  lessonId: string;
  completed?: boolean;
  currentTime?: number;
}

// Mutation function
async function updateLessonProgress(
  courseId: string,
  data: UpdateProgressData
): Promise<any> {
  const response = await fetch(`/api/courses/${courseId}/progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update progress');
  }

  return response.json();
}

export function useLessonProgress(courseId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateProgressData) => updateLessonProgress(courseId, data),
    onSuccess: () => {
      // Invalidate course data to refetch with updated progress
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      // Also invalidate enrolled courses to update progress there
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] });
    },
  });

  const updateProgress = async (
    lessonId: string,
    data: { completed?: boolean; currentTime?: number }
  ) => {
    return mutation.mutateAsync({ lessonId, ...data });
  };

  const markComplete = async (lessonId: string) => {
    return mutation.mutateAsync({ lessonId, completed: true });
  };

  const updateCurrentTime = async (lessonId: string, currentTime: number) => {
    return mutation.mutateAsync({ lessonId, currentTime });
  };

  return {
    updateProgress,
    markComplete,
    updateCurrentTime,
    updating: mutation.isPending,
  };
}
