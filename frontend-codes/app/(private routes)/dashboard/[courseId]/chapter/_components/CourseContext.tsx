"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { CourseData, Lecture } from '@/types/course';
import { useCourseData } from '@/hooks/useCourseData';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { toast } from "sonner";

interface CourseContextType {
  activeLectureId: string;
  completedLectures: string[];
  currentTime: number;
  courseData: CourseData | null;
  loading: boolean;
  error: string | null;
  setCompletedLectures: (lectures: string[]) => void;
  setCurrentTime: (time: number) => void;
  handleLectureSelect: (lectureId: string) => void;
  handleMarkComplete: (lectureId: string) => void;
  goToNextLecture: () => void;
  goToPreviousLecture: () => void;
  allLectures: Lecture[];
  currentIndex: number;
  activeLecture?: Lecture;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const params = useParams();
  
  // Get courseId and chapterId from URL params (now both are route params)
  const courseId = params?.courseId as string;
  const chapterIdFromUrl = params?.chapterId as string;
  
  // Fetch course data from API
  const { courseData, loading, error } = useCourseData(courseId);
  const { markComplete, updateCurrentTime } = useLessonProgress(courseId);
  
  const [completedLectures, setCompletedLectures] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(0);

  // Update completed lectures when course data loads
  useEffect(() => {
    if (courseData) {
      const completed = courseData.lectures
        .filter(lecture => lecture.completed)
        .map(lecture => lecture.id);
      setCompletedLectures(completed);
    }
  }, [courseData]);

  const allLectures = courseData?.lectures || [];
  
  // Use URL param as the source of truth for active lecture
  const activeLectureId = chapterIdFromUrl;
  const currentIndex = allLectures.findIndex(lecture => lecture.id === activeLectureId);
  const activeLecture = allLectures.find(lecture => lecture.id === activeLectureId);

  // Navigate to a specific lecture by updating the URL
  const handleLectureSelect = (lectureId: string) => {
    router.push(`/dashboard/${courseId}/chapter/${lectureId}`);
  };

  const handleMarkComplete = async (lectureId: string) => {
    if (!completedLectures.includes(lectureId)) {
      // Optimistic update
      setCompletedLectures(prev => [...prev, lectureId]);
      toast.success("Lesson marked as completed");

      try {
        await markComplete(lectureId);
        
        // Update course data object locally if needed, though invalidation handles fetch
        if (courseData) {
          courseData.completedLectures = (courseData.completedLectures || 0) + 1;
        }
      } catch (error) {
        console.error('Failed to mark lecture as complete:', error);
        // Revert on failure
        setCompletedLectures(prev => prev.filter(id => id !== lectureId));
        toast.error("Failed to mark lesson as complete");
      }
    }
  };

  const goToNextLecture = () => {
    if (currentIndex < allLectures.length - 1) {
      const nextLecture = allLectures[currentIndex + 1];
      handleLectureSelect(nextLecture.id);
      if (activeLecture) {
        handleMarkComplete(activeLecture.id);
      }
    }
  };

  const goToPreviousLecture = () => {
    if (currentIndex > 0) {
      const prevLecture = allLectures[currentIndex - 1];
      handleLectureSelect(prevLecture.id);
    }
  };

  // Update current time periodically for video progress
  useEffect(() => {
    if (activeLecture && currentTime > 0) {
      const timeoutId = setTimeout(() => {
        updateCurrentTime(activeLecture.id, currentTime).catch(console.error);
      }, 5000); // Update every 5 seconds

      return () => clearTimeout(timeoutId);
    }
  }, [activeLecture, currentTime, updateCurrentTime]);

  const value: CourseContextType = {
    activeLectureId,
    completedLectures,
    currentTime,
    courseData,
    loading,
    error,
    setCompletedLectures,
    setCurrentTime,
    handleLectureSelect,
    handleMarkComplete,
    goToNextLecture,
    goToPreviousLecture,
    allLectures,
    currentIndex,
    activeLecture
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};
