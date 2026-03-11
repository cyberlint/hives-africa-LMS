"use client";
import React from 'react';
import { ChapterNavigationPanel } from './ChapterNavigationPanel';
import { ContentViewerPanel } from './ContentViewerPanel';
import { VideoPanel } from './VideoPanel';
import { useLayoutState } from './hooks/useLayoutState';
import { useResponsiveColumns } from './hooks/useResponsiveColumns';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({
  courseData, activeLecture, activeLectureId, completedLectures, onLectureSelect, onMarkComplete, onTimeUpdate, onVideoEnd, onNext, onPrevious,
}) => {
  const { showVideo, isChaptersCollapsed, isVideoCollapsed, toggleChapters, toggleVideo } = useLayoutState(activeLecture);
  const { isMobile } = useResponsiveColumns(showVideo);

  return (
    <div className="flex h-screen w-full bg-white dark:bg-[#1d2026] relative overflow-hidden">
      
      {/* Sidebar Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleChapters}
        className={cn(
          "fixed z-[160] h-8 w-8 rounded-full bg-background shadow-md transition-all duration-300 border-border top-24", 
          isMobile ? "left-4" : (isChaptersCollapsed ? "left-4" : "left-[284px]")
        )}
      >
        {isChaptersCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      {/* 1. LEFT: Chapters */}
      <ChapterNavigationPanel
        courseData={courseData}
        activeLectureId={activeLectureId}
        completedLectures={completedLectures}
        onLectureSelect={onLectureSelect}
        isCollapsed={isChaptersCollapsed}
        onToggleCollapse={toggleChapters}
        isMobile={isMobile}
      />

      {/* MAIN CONTAINER: Use h-full to prevent the "void" below the video */}
      <main className={cn(
        "flex-1 flex min-w-0 h-full", 
        isMobile ? "flex-col overflow-y-auto" : "flex-row overflow-hidden"
      )}>
        
        {/* 2. MIDDLE: VIDEO - Forced to fill 70% */}
        {showVideo && (
          <div className={cn(
            "bg-black flex flex-col border-r border-border h-full",
            isMobile ? "w-full shrink-0 aspect-video" : "w-[70%]" 
          )}>
            {/* This wrapper ensures the VideoPanel doesn't shrink internally */}
            <div className="flex-1 w-full h-full relative">
              <VideoPanel
                lecture={activeLecture}
                courseData={courseData}
                onTimeUpdate={onTimeUpdate}
                onVideoEnd={onVideoEnd}
                isCollapsed={isVideoCollapsed}
                onToggleCollapse={toggleVideo}
                isMobile={isMobile}
              />
            </div>
          </div>
        )}

        {/* 3. RIGHT: NOTES - 30% Width */}
        <div className={cn(
          "bg-white dark:bg-[#1d2026] flex flex-col min-w-0 h-full",
          isMobile ? "w-full" : (showVideo ? "w-[30%]" : "w-full")
        )}>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <ContentViewerPanel
              lecture={activeLecture}
              isCompleted={completedLectures.includes(activeLectureId)}
              onMarkComplete={() => onMarkComplete(activeLectureId)}
              onNext={onNext}
              onPrevious={onPrevious}
            />
          </div>
        </div>
      </main>
    </div>
  );
};