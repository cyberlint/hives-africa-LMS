import React, { createContext, useContext, useState, useEffect } from 'react';
import { courseData } from "@/data/courseData";
import type { CourseData, Lecture } from '@/types/course';

interface CourseContextType {
  activeLectureId: string;
  completedLectures: string[];
  currentTime: number;
  courseData: CourseData;
  setActiveLectureId: (id: string) => void;
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
  const [activeLectureId, setActiveLectureId] = useState("1");
  const [completedLectures, setCompletedLectures] = useState<string[]>(
    courseData.sections.flatMap(section => 
      section.lectures.filter(lecture => lecture.completed).map(lecture => lecture.id)
    )
  );
  const [currentTime, setCurrentTime] = useState(0);

  const allLectures = courseData.sections.flatMap(section => section.lectures);
  const currentIndex = allLectures.findIndex(lecture => lecture.id === activeLectureId);
  const activeLecture = allLectures.find(lecture => lecture.id === activeLectureId);

  const handleLectureSelect = (lectureId: string) => {
    setActiveLectureId(lectureId);
  };

  const handleMarkComplete = (lectureId: string) => {
    if (!completedLectures.includes(lectureId)) {
      setCompletedLectures(prev => [...prev, lectureId]);
      courseData.completedLectures = completedLectures.length + 1;
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
      handleLectureSelect(allLectures[currentIndex - 1].id);
    }
  };

  const value: CourseContextType = {
    activeLectureId,
    completedLectures,
    currentTime,
    courseData,
    setActiveLectureId,
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