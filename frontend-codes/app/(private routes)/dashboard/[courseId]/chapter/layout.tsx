"use client";
import React, { useEffect } from 'react';
import { ThreeColumnLayout } from '@/components/lms/three-column-layout';
import { useCourse, CourseProvider } from './_components/CourseContext';

import { useRouter } from 'next/navigation';

const ChapterLayoutContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
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

  // Redirect to first lecture if none selected
  useEffect(() => {
    if (!loading && courseData && !activeLectureId) {
      // Find first lecture
      let firstLectureId = null;
      
      if (courseData.sections && courseData.sections.length > 0) {
        // Find first section with lectures
        const firstSection = courseData.sections.find(s => s.lectures && s.lectures.length > 0);
        if (firstSection) {
          firstLectureId = firstSection.lectures[0].id;
        }
      } 
      
      if (!firstLectureId && courseData.lectures && courseData.lectures.length > 0) {
        firstLectureId = courseData.lectures[0].id;
      }

        if (firstLectureId) {
          router.replace(`/dashboard/${courseData.id}/chapter/${firstLectureId}`);
        }
    }
  }, [courseData, loading, activeLectureId, router]);

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
      <div className="min-h-screen  flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          {/* Using the consistent Loader from lucide-react with brand color */}
          <div className="h-8 w-8 animate-spin text-[#fdb606]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-loader"
            >
              <line x1="12" x2="12" y1="2" y2="6" />
              <line x1="12" x2="12" y1="18" y2="22" />
              <line x1="4.93" x2="7.76" y1="4.93" y2="7.76" />
              <line x1="16.24" x2="19.07" y1="16.24" y2="19.07" />
              <line x1="2" x2="6" y1="12" y2="12" />
              <line x1="18" x2="22" y1="12" y2="12" />
              <line x1="4.93" x2="7.76" y1="19.07" y2="16.24" />
              <line x1="16.24" x2="19.07" y1="4.93" y2="7.76" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <h2 className="text-2xl font-bold mb-2 text-foreground">Unable to load course</h2>
          <p className="text-muted-foreground mb-4">{error || 'Course not found'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#fdb606] text-white rounded-md hover:bg-[#f39c12] transition-colors font-medium"
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
    <div className="min-h-screen bg-background text-foreground">
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
