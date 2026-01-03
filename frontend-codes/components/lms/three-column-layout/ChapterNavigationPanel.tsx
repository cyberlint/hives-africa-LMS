// import React, { useState } from 'react';
// import { ChevronDown, ChevronRight, ChevronLeft, CheckCircle, PlayCircle, FileText, HelpCircle, Book } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import type { CourseData, Lecture } from '@/types/course';
// import { cn } from '@/lib/utils';

// interface ChapterNavigationPanelProps {
//   courseData: CourseData;
//   activeLectureId: string;
//   completedLectures: string[];
//   onLectureSelect: (lectureId: string) => void;
//   isCollapsed: boolean;
//   onToggleCollapse: () => void;
//   isMobile?: boolean;
// }

// export const ChapterNavigationPanel: React.FC<ChapterNavigationPanelProps> = ({
//   courseData,
//   activeLectureId,
//   completedLectures,
//   onLectureSelect,
//   isCollapsed,
//   onToggleCollapse,
//   isMobile = false,
// }) => {
//   const [expandedSections, setExpandedSections] = useState<string[]>(
//     courseData.sections.map(section => section.id)
//   );

//   const toggleSection = (sectionId: string) => {
//     setExpandedSections(prev =>
//       prev.includes(sectionId)
//         ? prev.filter(id => id !== sectionId)
//         : [...prev, sectionId]
//     );
//   };

//   const getLectureIcon = (lecture: Lecture) => {
//     const iconClass = "w-4 h-4";
//     switch (lecture.type) {
//       case 'video':
//         return <PlayCircle className={iconClass} />;
//       case 'quiz':
//         return <HelpCircle className={iconClass} />;
//       case 'document':
//         return <FileText className={iconClass} />;
//       case 'resource':
//         return <Book className={iconClass} />;
//       default:
//         return <FileText className={iconClass} />;
//     }
//   };

//   const formatDuration = (seconds?: number) => {
//     if (!seconds) return '';
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   if (isCollapsed) {
//     return (
//       <div className={cn(
//         "z-20 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1d2026] transition-colors duration-300",
//         isMobile ? 'fixed inset-y-0 left-0 hidden' : 'sticky top-0 h-screen w-12 flex flex-col items-center py-4'
//       )}>
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={onToggleCollapse}
//           className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
//           title="Show chapters"
//         >
//           <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
//         </Button>
//       </div>
//     );
//   }

//   const completionPercentage = (completedLectures.length / (courseData.totalLectures || 1)) * 100;

//   return (
//     <div 
//       className={cn("flex flex-col flex-shrink-0 bg-white dark:bg-[#1d2026] border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out",
//   isMobile
//     ? "fixed inset-0 z-50 w-full h-[100dvh]"
//     : "sticky top-0 h-screen w-[260px] sm:w-[280px] lg:w-[300px] xl:w-[320px]"
// )}
//     >
//       {/* Header (Fixed) */}
//       <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1d2026] transition-colors duration-300">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Course Content</h2>
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={onToggleCollapse}
//             className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 rounded-full"
//             title="Hide chapters"
//           >
//             <ChevronLeft className="w-5 h-5" />
//           </Button>
//         </div>

//         {/* Progress Bar */}
//         <div className="space-y-2">
//           <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 font-medium">
//             <span>{Math.round(completionPercentage)}% completed</span>
//             <span>{completedLectures.length}/{courseData.totalLectures || 0}</span>
//           </div>
//           <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
//             <div
//               className="bg-[#fdb606] h-full transition-all duration-500 ease-out rounded-full"
//               style={{ width: `${completionPercentage}%` }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Sections List (Scrollable) */}
//       <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#1d2026]">
//         <div className="p-3 space-y-3">
//           {courseData.sections.map((section) => {
//             const isExpanded = expandedSections.includes(section.id);
//             const sectionCompleted = section.lectures.every(lecture =>
//               completedLectures.includes(lecture.id)
//             );

//             return (
//               <div key={section.id} className="space-y-1">
//                 {/* Section Header */}
//                 <button
//                   onClick={() => toggleSection(section.id)}
//                   className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group select-none"
//                   aria-expanded={isExpanded}
//                 >
//                   <div className="flex items-center gap-2 flex-1 min-w-0">
//                     <div className={cn(
//                       "transition-transform duration-200 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300",
//                       isExpanded ? "rotate-0" : "-rotate-90"
//                     )}>
//                       <ChevronDown className="w-4 h-4" />
//                     </div>
//                     <span className="text-sm font-semibold text-gray-900 dark:text-gray-200 truncate">
//                       {section.title}
//                     </span>
//                   </div>
//                   {sectionCompleted && (
//                     <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0 ml-2" />
//                   )}
//                 </button>

//                 {/* Lectures List */}
//                 <div 
//                   className={cn(
//                     "space-y-1 overflow-hidden transition-all duration-300 ease-in-out",
//                     isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
//                   )}
//                 >
//                   {section.lectures.map((lecture) => {
//                     const isActive = lecture.id === activeLectureId;
//                     const isCompleted = completedLectures.includes(lecture.id);

//                     return (
//                       <button
//                         key={lecture.id}
//                         onClick={() => onLectureSelect(lecture.id)}
//                         className={cn(
//                           "w-full flex items-start gap-3 p-2 pl-8 rounded-md text-left transition-all duration-200 group relative",
//                           isActive 
//                             ? "bg-[#fdb606]/10 text-gray-900 dark:text-white" 
//                             : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
//                         )}
//                       >
//                          {/* Active Indicator Bar */}
//                          {isActive && (
//                             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-[#fdb606] rounded-r-full" />
//                          )}

//                         <div className={cn(
//                           "flex-shrink-0 mt-0.5",
//                           isActive ? "text-[#fdb606]" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"
//                         )}>
//                           {isCompleted ? <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" /> : getLectureIcon(lecture)}
//                         </div>

//                         <div className="flex-1 min-w-0">
//                           <p className={cn(
//                             "text-sm line-clamp-2",
//                             isActive ? "font-medium" : "font-normal"
//                           )}>
//                             {lecture.title}
//                           </p>
//                           {lecture.duration && (
//                             <span className="text-xs text-muted-foreground mt-0.5 block">
//                               {formatDuration(lecture.duration)}
//                             </span>
//                           )}
//                         </div>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Footer Info (Fixed) */}
//       <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 transition-colors duration-300">
//         <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
//           <span>Total Duration</span>
//           <span className="font-semibold text-gray-900 dark:text-gray-200">
//             {Math.floor(
//               courseData.sections.reduce(
//                 (sum, section) =>
//                   sum + section.lectures.reduce((lectureSum, lecture) => lectureSum + (lecture.duration || 0), 0),
//                 0
//               ) / 3600
//             )}h {Math.floor(
//               (courseData.sections.reduce(
//                 (sum, section) =>
//                   sum + section.lectures.reduce((lectureSum, lecture) => lectureSum + (lecture.duration || 0), 0),
//                 0
//               ) % 3600) / 60
//             )}m
//           </span>
//         </div>
//       </div>

//       <style jsx global>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 5px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #e5e7eb;
//           border-radius: 20px;
//         }
//         .custom-scrollbar:hover::-webkit-scrollbar-thumb {
//           background: #d1d5db;
//         }
//         /* Dark mode scrollbar support via media query if possible, or just generic dark classes if tailwind config allows. 
//            Since jsx global styling is tricky with dark mode class, we can leave generic gray or try to target dark mode selector if available globally.
//            For now gray is neutral enough. */
//       `}</style>
//     </div>
//   );
// };


import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  PlayCircle,
  FileText,
  HelpCircle,
  Book,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CourseData, Lecture } from "@/types/course";
import { cn } from "@/lib/utils";

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
    courseData.sections.map((s) => s.id)
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getLectureIcon = (lecture: Lecture) => {
    const cls = "w-4 h-4";
    switch (lecture.type) {
      case "video":
        return <PlayCircle className={cls} />;
      case "quiz":
        return <HelpCircle className={cls} />;
      case "document":
        return <FileText className={cls} />;
      case "resource":
        return <Book className={cls} />;
      default:
        return <FileText className={cls} />;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* -------------------- Collapsed State -------------------- */
  if (isCollapsed) {
    return (
      <div
        className={cn(
          "z-20 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1d2026]",
          isMobile
            ? "fixed inset-y-0 left-0 hidden"
            : "sticky top-0 h-screen w-12 flex flex-col items-center py-4"
        )}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="h-8 w-8 p-0 rounded-full"
          title="Show chapters"
        >
          <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </Button>
      </div>
    );
  }

  const completionPercentage =
    (completedLectures.length / (courseData.totalLectures || 1)) * 100;

  /* -------------------- Expanded State -------------------- */
  return (
    <aside
      className={cn(
        "flex flex-col flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1d2026] transition-all",
        isMobile
          ? "fixed inset-0 z-50 w-full h-[100dvh]"
          : "sticky top-0 h-screen w-[260px] sm:w-[280px] lg:w-[300px]"
      )}
    >
      {/* Header */}
      <header className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Course Content
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>{Math.round(completionPercentage)}% completed</span>
            <span>
              {completedLectures.length}/{courseData.totalLectures || 0}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-full rounded-full bg-[#fdb606] transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </header>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-3 space-y-3">
          {courseData.sections.map((section) => {
            const isExpanded = expandedSections.includes(section.id);
            const sectionCompleted = section.lectures.every((l) =>
              completedLectures.includes(l.id)
            );

            return (
              <div key={section.id} className="space-y-1">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform text-gray-400",
                        !isExpanded && "-rotate-90"
                      )}
                    />
                    <span className="text-sm font-semibold truncate text-gray-900 dark:text-gray-200">
                      {section.title}
                    </span>
                  </div>
                  {sectionCompleted && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </button>

                {/* Lectures */}
                <div
                  className={cn(
                    "space-y-1 overflow-hidden transition-all",
                    isExpanded ? "max-h-[5000px]" : "max-h-0"
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
                          "relative w-full flex items-start gap-3 p-2 pl-8 rounded-md text-left",
                          isActive
                            ? "bg-[#fdb606]/10 text-gray-900 dark:text-white"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-2/3 w-1 bg-[#fdb606] rounded-r" />
                        )}

                        <span
                          className={cn(
                            "mt-0.5",
                            isActive
                              ? "text-[#fdb606]"
                              : "text-gray-400 dark:text-gray-500"
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            getLectureIcon(lecture)
                          )}
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm line-clamp-2">
                            {lecture.title}
                          </p>
                          {lecture.duration && (
                            <span className="block text-xs text-muted-foreground">
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

      {/* Footer */}
      <footer className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>Total Duration</span>
          <span className="font-semibold text-gray-900 dark:text-gray-200">
            {Math.floor(
              courseData.sections.reduce(
                (sum, s) =>
                  sum +
                  s.lectures.reduce(
                    (ls, l) => ls + (l.duration || 0),
                    0
                  ),
                0
              ) / 3600
            )}
            h{" "}
            {Math.floor(
              (courseData.sections.reduce(
                (sum, s) =>
                  sum +
                  s.lectures.reduce(
                    (ls, l) => ls + (l.duration || 0),
                    0
                  ),
                0
              ) %
                3600) /
                60
            )}
            m
          </span>
        </div>
      </footer>

      {/* Scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 9999px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #d1d5db;
        }
      `}</style>
    </aside>
  );
};
