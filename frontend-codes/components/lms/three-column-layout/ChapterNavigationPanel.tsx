import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ChevronLeft, CheckCircle, PlayCircle, FileText, HelpCircle, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CourseData, CourseSection, Lecture } from '@/types/course';

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
      <div className={`${isMobile ? 'relative' : 'fixed left-0 top-0 h-screen'} z-20 lg:relative lg:top-0 lg:h-full`}>
        <div className="h-full flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-gray-700 hover:bg-gray-100 p-3 rounded-r-lg rounded-l-none bg-white border border-gray-200 shadow-lg transition-all duration-200"
            title="Show chapters"
            aria-label="Show chapter navigation"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  const completionPercentage = (completedLectures.length / (courseData.totalLectures || 1)) * 100;

  return (
    <div 
      className={`
        ${isMobile ? 'w-full min-h-screen' : 'w-[320px] h-screen sticky top-0'} 
        bg-white border-r border-gray-200 flex flex-col
        transition-all duration-300 ease-in-out
      `}
    >
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">Course Content</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 transition-colors"
            title="Hide chapters"
            aria-label="Hide chapter navigation"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>{completedLectures.length} of {courseData.totalLectures || 0} completed</span>
            <span>{Math.round(completionPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-yellow h-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
        <div className="p-2">
          {courseData.sections.map((section) => {
            const isExpanded = expandedSections.includes(section.id);
            const sectionCompleted = section.lectures.every(lecture =>
              completedLectures.includes(lecture.id)
            );

            return (
              <div key={section.id} className="mb-2">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {section.title}
                    </span>
                    {sectionCompleted && (
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {section.lectures.length}
                  </span>
                </button>

                {/* Lectures List */}
                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {section.lectures.map((lecture) => {
                      const isActive = lecture.id === activeLectureId;
                      const isCompleted = completedLectures.includes(lecture.id);

                      return (
                        <button
                          key={lecture.id}
                          onClick={() => onLectureSelect(lecture.id)}
                          className={`
                            w-full flex items-start gap-3 p-2.5 rounded-lg transition-all
                            ${isActive
                              ? 'bg-yellow/10 border border-yellow'
                              : 'hover:bg-gray-50 border border-transparent'
                            }
                          `}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          {/* Icon */}
                          <div className={`flex-shrink-0 mt-0.5 ${isActive ? 'text-yellow' : 'text-gray-500'}`}>
                            {getLectureIcon(lecture)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-start justify-between gap-2">
                              <span className={`text-sm ${isActive ? 'text-gray-900 font-medium' : 'text-gray-700'} line-clamp-2`}>
                                {lecture.title}
                              </span>
                              {isCompleted && (
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                              )}
                            </div>
                            {lecture.duration && (
                              <span className="text-xs text-gray-500 mt-1 block">
                                {formatDuration(lecture.duration)}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Total Duration</span>
            <span className="text-gray-900 font-medium">
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
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f9fafb;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};
