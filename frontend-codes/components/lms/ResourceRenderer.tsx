import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, FileText, ExternalLink, Folder } from 'lucide-react';
import type { Lecture } from '@/types/course';
import { RichTextRenderer } from './RichTextRenderer';

interface ResourceRendererProps {
  lecture: Lecture;
  onNext: () => void;
  onPrevious: () => void;
  onMarkComplete: () => void;
  isCompleted: boolean;
}

export const ResourceRenderer: React.FC<ResourceRendererProps> = ({
  lecture,
  onNext,
  onPrevious,
  onMarkComplete,
  isCompleted
}) => {
  const handleResourceAccess = () => {
    // Mark as complete when accessing resources
    onMarkComplete();
  };

  return (
    <div className="flex-1 bg-white dark:bg-darkBlue-300 flex flex-col h-full overflow-y-auto transition-colors duration-300">
      <div className="flex-1 flex flex-col items-center p-8">
        <div className="text-center max-w-2xl w-full">
          <div className="mb-8">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Folder className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">{lecture.title}</h2>
            <div className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg mb-8">
              <RichTextRenderer contentJsonString={lecture.description || ""} className="prose prose-lg dark:prose-invert max-w-none" />
            </div>
          </div>
          
          {isCompleted && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm font-medium mb-8">
              <CheckCircle className="w-4 h-4" />
              <span>Completed</span>
            </div>
          )}
          
          {lecture.attachments && lecture.attachments.length > 0 ? (
            <div className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 text-left">Available Resources</h3>
              <div className="grid gap-3">
                {lecture.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.type === 'quiz' ? `/quiz/${lecture.id}/${attachment.id}` : attachment.url} // Use direct URL for generic attachments
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleResourceAccess}
                    className="flex items-center p-3 bg-white dark:bg-darkBlue-300 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-orange-300 dark:hover:border-orange-500/50 hover:shadow-sm transition-all group text-left"
                  >
                     <div className="p-2 bg-orange-50 dark:bg-orange-900/10 rounded-md mr-3 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
                        <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                     </div>
                     <div className="flex-1 min-w-0">
                         <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-orange-700 dark:group-hover:text-orange-400 truncate">
                          {attachment.title}
                        </h4>
                        {attachment.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                                <RichTextRenderer contentJsonString={attachment.description || ""} className="prose prose-xs dark:prose-invert max-w-none" />
                            </div>
                        )}
                     </div>
                    
                    <div className="flex flex-col items-end gap-1 ml-3">
                      <span className="text-xs font-medium text-orange-600 dark:text-orange-400 px-2 py-0.5 bg-orange-50 dark:bg-orange-900/10 rounded-full capitalize">
                        {attachment.type}
                      </span>
                      {attachment.fileSize && (
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">{attachment.fileSize}</span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ) : (
             <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 mb-8">
               <p className="text-gray-500 dark:text-gray-400">No resources available for this lecture.</p>
             </div>
          )}
          
          <Button
            onClick={handleResourceAccess}
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium shadow-lg hover:shadow-xl transition-all"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Access Resources
          </Button>
        </div>
      </div>

      {/* Bottom Controls - kept simple as request was focused on main area styling */}
    </div>
  );
};
