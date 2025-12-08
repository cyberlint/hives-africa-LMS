"use client";
import React, { useEffect } from 'react';
import { ThreeColumnLayout } from '@/components/lms/three-column-layout';
import { useCourse, CourseProvider } from './_components/CourseContext';

const ChapterLayoutContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    activeLectureId,
    activeLecture,
    completedLectures,
    courseData,
    loading,
    error,
    handleLectureSelect,
    handleMarkComplete,
    goToNextLecture,
    goToPreviousLecture,
    setCurrentTime,
  } = useCourse();

  // Keyboard navigation for lecture switching - MUST be before conditional returns
  useEffect(() => {
    if (loading || error || !courseData) return;
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.target && (e.target as HTMLElement).tagName === 'TEXTAREA') return;
      
      switch (e.code) {
        case 'ArrowLeft':
          if (e.altKey) {
            e.preventDefault();
            goToPreviousLecture();
          }
          break;
        case 'ArrowRight':
          if (e.altKey) {
            e.preventDefault();
            goToNextLecture();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [goToNextLecture, goToPreviousLecture, loading, error, courseData]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">Unable to load course</h2>
          <p className="text-muted-foreground mb-4">{error || 'Course not found'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const handleVideoEnd = () => {
    if (activeLecture) {
      handleMarkComplete(activeLecture.id);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="">
        <ThreeColumnLayout
          courseData={courseData}
          activeLecture={activeLecture}
          activeLectureId={activeLectureId}
          completedLectures={completedLectures}
          onLectureSelect={handleLectureSelect}
          onMarkComplete={handleMarkComplete}
          onTimeUpdate={setCurrentTime}
          onVideoEnd={handleVideoEnd}
          onNext={goToNextLecture}
          onPrevious={goToPreviousLecture}
        />
      </div>
    </div>
  );
};

const ChapterLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <CourseProvider>
      <ChapterLayoutContent>
        {children}
      </ChapterLayoutContent>
    </CourseProvider>
  );
};

export default ChapterLayout;
