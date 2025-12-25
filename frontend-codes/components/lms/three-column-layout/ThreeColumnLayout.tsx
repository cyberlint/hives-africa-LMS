"use client";
import React from 'react';
import { ChapterNavigationPanel } from './ChapterNavigationPanel';
import { ContentViewerPanel } from './ContentViewerPanel';
import { VideoPanel } from './VideoPanel';
import { useLayoutState } from './hooks/useLayoutState';
import { useResponsiveColumns } from './hooks/useResponsiveColumns';
import type { CourseData, Lecture } from '@/types/course';

interface ThreeColumnLayoutProps {
  courseData: CourseData;
  activeLecture?: Lecture;
  activeLectureId: string;
  completedLectures: string[];
  onLectureSelect: (lectureId: string) => void;
  onMarkComplete: (lectureId: string) => void;
  onTimeUpdate?: (time: number) => void;
  onVideoEnd?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({
  courseData,
  activeLecture,
  activeLectureId,
  completedLectures,
  onLectureSelect,
  onMarkComplete,
  onTimeUpdate,
  onVideoEnd,
  onNext,
  onPrevious,
}) => {
  const {
    showVideo,
    isChaptersCollapsed,
    isVideoCollapsed,
    toggleChapters,
    toggleVideo,
  } = useLayoutState(activeLecture);

  const { isMobile, isTablet, isDesktop } = useResponsiveColumns(showVideo);

  const isCompleted = completedLectures.includes(activeLectureId);

  const handleMarkComplete = () => {
    onMarkComplete(activeLectureId);
  };

  // Determine layout based on screen size and content
  const getLayoutClasses = () => {
    if (isMobile) {
      return 'flex-col'; // Stack vertically on mobile
    }

    if (isTablet) {
      // On tablet, show 2 columns
      if (showVideo && !isVideoCollapsed) {
        // Content + Video (hide chapters by default on tablet when video exists)
        return 'flex-row';
      }
      // Chapters + Content
      return 'flex-row';
    }

    // Desktop: show all 3 columns when applicable
    return 'flex-row';
  };

  // Determine which panels to show
  const shouldShowChapters = !isChaptersCollapsed || isMobile;
  const shouldShowVideo = showVideo && !isVideoCollapsed;

  return (
    <div className={`flex ${getLayoutClasses()} min-h-screen w-full bg-white dark:bg-[#1d2026] overflow-auto hide-scrollbar transition-colors duration-300`}>
      {/* Left Column: Chapter Navigation */}
      {(shouldShowChapters || !isMobile) && (
        <ChapterNavigationPanel
          courseData={courseData}
          activeLectureId={activeLectureId}
          completedLectures={completedLectures}
          onLectureSelect={onLectureSelect}
          isCollapsed={isChaptersCollapsed}
          onToggleCollapse={toggleChapters}
          isMobile={isMobile}
        />
      )}

      {/* Center Column: Content Viewer */}
      <div className={`flex-1 min-w-0 ${isMobile ? 'min-h-screen' : 'h-screen'} overflow-auto`}>
        <ContentViewerPanel
          lecture={activeLecture}
          isCompleted={isCompleted}
          onMarkComplete={handleMarkComplete}
          onNext={onNext}
          onPrevious={onPrevious}
        />
      </div>

      {/* Right Column: Video Player (conditional) */}
      {showVideo && (
        
        <VideoPanel
          lecture={activeLecture}
          courseData={courseData}
          onTimeUpdate={onTimeUpdate}
          onVideoEnd={onVideoEnd}
          isCollapsed={isVideoCollapsed}
          onToggleCollapse={toggleVideo}
          isMobile={isMobile}
        />
   
      )}
    </div>
  );
};
