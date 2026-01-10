import React from 'react';
import { Button } from '@/components/ui/button';
import { QuizRenderer } from '@/components/lms/QuizRenderer';
import { DocumentRenderer } from '@/components/lms/DocumentRenderer';
import { ResourceRenderer } from '@/components/lms/ResourceRenderer';
import { CheckCircle, FileText, HelpCircle, Book, PlayCircle } from 'lucide-react';
import type { Lecture } from '@/types/course';
import { RichTextRenderer } from '@/components/lms/RichTextRenderer';

interface ContentViewerPanelProps {
  lecture?: Lecture;
  isCompleted: boolean;
  onMarkComplete: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const ContentViewerPanel: React.FC<ContentViewerPanelProps> = ({
  lecture,
  isCompleted,
  onMarkComplete,
  onNext,
  onPrevious,
}) => {
  if (!lecture) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-darkBlue-300 flex items-center justify-center transition-colors duration-300">
        <div className="text-center text-gray-500 dark:text-gray-400 p-8">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">No Content Selected</h2>
          <p className="text-sm">Select a chapter from the left to start learning</p>
        </div>
      </div>
    );
  }

  const getContentIcon = () => {
    switch (lecture.type) {
      case 'video':
        return <PlayCircle className="w-6 h-6" />;
      case 'quiz':
        return <HelpCircle className="w-6 h-6" />;
      case 'document':
        return <FileText className="w-6 h-6" />;
      case 'resource':
        return <Book className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  const getContentTypeLabel = () => {
    switch (lecture.type) {
      case 'video':
        return 'Video Lecture';
      case 'quiz':
        return 'Quiz';
      case 'document':
        return 'Reading Material';
      case 'resource':
        return 'Resources';
      default:
        return 'Content';
    }
  };

  // For video type, show info card instead of full video player
  // (video player is in the right panel)
  if (lecture.type === 'video') {
    return (
      <div className="min-h-screen bg-white dark:bg-darkBlue-300 flex flex-col transition-colors duration-300">
        {/* Header */}
        <div className="shrink-0 p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-darkBlue-300 transition-colors duration-300">
          <div className="flex items-start gap-4">
            <div className="shrink-0 p-3 bg-yellow/10 rounded-lg text-yellow">
              {getContentIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-yellow uppercase tracking-wide">
                  {getContentTypeLabel()}
                </span>
                {isCompleted && (
                  <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-500">
                    <CheckCircle className="w-3 h-3" />
                    Completed
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight">
                {lecture.title}
              </h1>
              {lecture.description && (
                <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  <RichTextRenderer contentJsonString={lecture.description} className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-400" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 max-w-4xl">
            {/* Video Info Card */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6 transition-colors duration-300">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">About This Lecture</h2>
              <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  Watch the video on the right to learn about {lecture.title.toLowerCase()}.
                  The video player includes controls for playback speed, quality settings, and captions.
                </p>
                {lecture.duration && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <span>Duration:</span>
                    <span className="text-gray-900 dark:text-gray-200 font-medium">
                      {Math.floor(lecture.duration / 60)}:{(lecture.duration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Attachments */}
            {lecture.attachments && lecture.attachments.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 transition-colors duration-300">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Course Materials</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {lecture.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-yellow dark:hover:border-yellow hover:bg-yellow/5 dark:hover:bg-yellow/10 transition-all group"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-gray-200 group-hover:text-yellow dark:group-hover:text-yellow text-sm mb-1 transition-colors">
                        {attachment.title}
                      </h4>
                      {attachment.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{attachment.description}</p>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-yellow capitalize">{attachment.type}</span>
                        {attachment.fileSize && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">{attachment.fileSize}</span>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
 
            {/* Mark as Complete Action */}
            {!isCompleted && (
              <div className="flex justify-center mt-8 mb-6">
                <Button
                  onClick={onMarkComplete}
                  className="bg-yellow hover:bg-yellow/90 text-darkBlue-300 font-bold p-4 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95"
                >
                  <CheckCircle className="w-6 h-6 mr-2" />
                  Mark as Complete
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // For other content types, render their specific components
  return (
    <div className="min-h-screen bg-white dark:bg-darkBlue-300 flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="shrink-0 p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-darkBlue-300 transition-colors duration-300">
        <div className="flex items-start gap-4">
          <div className={`
            shrink-0 p-3 rounded-lg
            ${lecture.type === 'quiz' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : ''}
            ${lecture.type === 'document' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' : ''}
            ${lecture.type === 'resource' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : ''}
          `}>
            {getContentIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`
                text-xs font-medium uppercase tracking-wide
                ${lecture.type === 'quiz' ? 'text-purple-600 dark:text-purple-400' : ''}
                ${lecture.type === 'document' ? 'text-green-600 dark:text-green-400' : ''}
                ${lecture.type === 'resource' ? 'text-orange-600 dark:text-orange-400' : ''}
              `}>
                {getContentTypeLabel()}
              </span>
              {isCompleted && (
                <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-500">
                  <CheckCircle className="w-3 h-3" />
                  Completed
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight">
              {lecture.title}
            </h1>
            {lecture.description && (
              <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                <RichTextRenderer contentJsonString={lecture.description} className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Renderer */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-darkBlue-300">
        {lecture.type === 'quiz' && (
          <QuizRenderer
            lecture={lecture}
            onMarkComplete={onMarkComplete}
            isCompleted={isCompleted}
          />
        )}
        {lecture.type === 'document' && (
          <DocumentRenderer
            lecture={lecture}
            onMarkComplete={onMarkComplete}
            isCompleted={isCompleted}
          />
        )}
        {lecture.type === 'resource' && onNext && onPrevious && (
          <ResourceRenderer
            lecture={lecture}
            onNext={onNext}
            onPrevious={onPrevious}
            onMarkComplete={onMarkComplete}
            isCompleted={isCompleted}
          />
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};
