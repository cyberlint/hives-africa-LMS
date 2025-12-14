import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ChevronLeft, CheckCircle, PlayCircle, FileText, HelpCircle, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CourseData, Lecture } from '@/types/course';
import { cn } from '@/lib/utils';

interface ChapterNavigationPanelProps {
  courseData: CourseData;
  activeLectureId: string;
  completedLectures: string[];
  onLectureSelect: (lectureId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
}

export const ChapterNavigationPanel: React.FC<ChapterNavigationPanelProps> = ({
  courseData,
  activeLectureId,
  completedLectures,
  onLectureSelect,
  isCollapsed,
  onToggleCollapse,
  isMobile = false,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(
    courseData.sections.map(section => section.id)
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getLectureIcon = (lecture: Lecture) => {
    const iconClass = "w-4 h-4";
    switch (lecture.type) {
      case 'video':
        return <PlayCircle className={iconClass} />;
      case 'quiz':
        return <HelpCircle className={iconClass} />;
      case 'document':
        return <FileText className={iconClass} />;
      case 'resource':
        return <Book className={iconClass} />;
      default:
        return <FileText className={iconClass} />;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isCollapsed) {
    return (
      <div className={cn(
        "z-20 border-r border-gray-200 bg-white",
        isMobile ? 'fixed inset-y-0 left-0 hidden' : 'sticky top-0 h-screen w-12 flex flex-col items-center py-4'
      )}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
          title="Show chapters"
        >
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </Button>
      </div>
    );
  }

  const completionPercentage = (completedLectures.length / (courseData.totalLectures || 1)) * 100;

  return (
    <div 
      className={cn(
        "flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
        isMobile ? "fixed inset-0 z-50 w-full h-[100dvh]" : "sticky top-0 h-screen w-[320px]"
      )}
    >
      {/* Header (Fixed) */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Course Content</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full"
            title="Hide chapters"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600 font-medium">
            <span>{Math.round(completionPercentage)}% completed</span>
            <span>{completedLectures.length}/{courseData.totalLectures || 0}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-yellow h-full transition-all duration-500 ease-out rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sections List (Scrollable) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-3 space-y-3">
          {courseData.sections.map((section) => {
            const isExpanded = expandedSections.includes(section.id);
            const sectionCompleted = section.lectures.every(lecture =>
              completedLectures.includes(lecture.id)
            );

            return (
              <div key={section.id} className="space-y-1">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group select-none"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={cn(
                      "transition-transform duration-200 text-gray-400 group-hover:text-gray-600",
                      isExpanded ? "rotate-0" : "-rotate-90"
                    )}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {section.title}
                    </span>
                  </div>
                  {sectionCompleted && (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 ml-2" />
                  )}
                </button>

                {/* Lectures List */}
                <div 
                  className={cn(
                    "space-y-1 overflow-hidden transition-all duration-300 ease-in-out",
                    isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  {section.lectures.map((lecture) => {
                    const isActive = lecture.id === activeLectureId;
                    const isCompleted = completedLectures.includes(lecture.id);

                    return (
                      <button
                        key={lecture.id}
                        onClick={() => onLectureSelect(lecture.id)}
                        className={cn(
                          "w-full flex items-start gap-3 p-2 pl-8 rounded-md text-left transition-all duration-200 group relative",
                          isActive 
                            ? "bg-yellow/10 text-gray-900" 
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                         {/* Active Indicator Bar */}
                         {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-yellow rounded-r-full" />
                         )}

                        <div className={cn(
                          "flex-shrink-0 mt-0.5",
                          isActive ? "text-yellow" : "text-gray-400 group-hover:text-gray-500"
                        )}>
                          {isCompleted ? <CheckCircle className="w-4 h-4 text-green-500" /> : getLectureIcon(lecture)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-sm line-clamp-2",
                            isActive ? "font-medium" : "font-normal"
                          )}>
                            {lecture.title}
                          </p>
                          {lecture.duration && (
                            <span className="text-xs text-muted-foreground mt-0.5 block">
                              {formatDuration(lecture.duration)}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info (Fixed) */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50/50">
        <div className="flex justify-between items-center text-xs text-gray-600">
          <span>Total Duration</span>
          <span className="font-semibold text-gray-900">
            {Math.floor(
              courseData.sections.reduce(
                (sum, section) =>
                  sum + section.lectures.reduce((lectureSum, lecture) => lectureSum + (lecture.duration || 0), 0),
                0
              ) / 3600
            )}h {Math.floor(
              (courseData.sections.reduce(
                (sum, section) =>
                  sum + section.lectures.reduce((lectureSum, lecture) => lectureSum + (lecture.duration || 0), 0),
                0
              ) % 3600) / 60
            )}m
          </span>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 20px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
};
