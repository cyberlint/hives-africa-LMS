import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, FileText, ExternalLink } from 'lucide-react';
import type { Lecture } from '@/types/course';
import { constructUrl } from '@/lib/construct-url';
import { RichTextRenderer } from './RichTextRenderer';
import { cn, getFileType } from '@/lib/utils';
import { DocumentContent } from './three-column-layout/DocumentContent';

interface DocumentRendererProps {
  lecture: Lecture;
  onMarkComplete: () => void;
  isCompleted: boolean;
}

export const DocumentRenderer: React.FC<DocumentRendererProps> = ({
  lecture,
  onMarkComplete,
  isCompleted
}) => {
  const documentUrl = lecture.documentKey ? constructUrl(lecture.documentKey) : undefined;
  const isNotebook = lecture.documentKey ? getFileType(lecture.documentKey) === 'ipynb' : false;
  console.log("this is the construct url:" + (constructUrl(lecture.documentKey?? "no document key")));


  return (
    <div className="flex-1 bg-white dark:bg-darkBlue-300 flex flex-col h-full overflow-y-auto transition-colors duration-300">
      <div className="flex-1 flex flex-col items-center p-4 md:p-8">
        <div className={cn(
          "text-center w-full",
          isNotebook ? "max-w-7xl" : "max-w-4xl"
        )}>
          <div className="mb-8">
            {/* <div className="w-16 h-16 bg-[#fdb606]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-[#fdb606]" />
            </div> */}
            {/* <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">{lecture.title}</h2> */}
            <div className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
              <RichTextRenderer contentJsonString={lecture.description || ''} className="prose dark:prose-invert max-w-none" />
            </div>
          </div>
          
          {isCompleted && (
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm font-medium mb-8">
              <CheckCircle className="w-4 h-4" />
              <span>Completed</span>
            </div>
          )}

          {/* Primary Document Action */}
          {documentUrl ? (
             <div className="mb-10">
              <DocumentContent 
                documentKey={lecture.documentKey} 
                title={lecture.title}
                isCompleted={isCompleted}
                onMarkComplete={onMarkComplete}
              />
            </div>
          ) : (
             !lecture.attachments?.length && (
                <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 mb-8">
                  <p className="text-gray-500 dark:text-gray-400">No document file available for this lecture.</p>
                </div>
             )
          )}

          {/* Mark as Complete Action */}
          {!isCompleted && (
            <div className="flex justify-center mb-12">
              <Button
                onClick={onMarkComplete}
                className="bg-yellow hover:bg-yellow/90 text-darkBlue-300 font-bold px-10 py-6 h-auto text-lg rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <CheckCircle className="mr-2" />
                Mark as Complete
              </Button>
            </div>
          )}

          {/* Attachments Section */}
          {lecture.attachments && lecture.attachments.length > 0 && (
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                 <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
                 <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Additional Resources</span>
                 <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lecture.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="p-4 bg-white dark:bg-darkBlue-300 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-yellow/50 dark:hover:border-yellow/50 hover:shadow-sm transition-all group text-left"
                  >
                    <div className="flex items-start gap-3">
                       <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg group-hover:bg-yellow/10 transition-colors">
                          <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-yellow dark:group-hover:text-yellow" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate mb-1">
                            {attachment.title}
                          </h4>
                          <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                            <div className="prose prose-xs dark:prose-invert max-w-none">{attachment.description}</div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                                <span className="capitalize bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">{attachment.type}</span>
                                {attachment.fileSize && <span>{attachment.fileSize}</span>}
                             </div>
                             
                             <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-400 hover:text-yellow hover:bg-yellow/10 dark:hover:bg-yellow/10"
                                  onClick={() => window.open(attachment.url, '_blank')} // Assuming attachment.url is already complete or handled elsewhere
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
