
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, FileText, Download, ExternalLink } from 'lucide-react';
import type { Lecture } from '@/types/course';
import { constructUrl } from '@/lib/construct-url';
import { RichTextRenderer } from './RichTextRenderer';
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

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onMarkComplete();
  };

  const handleView = (url: string) => {
    window.open(url, '_blank');
    onMarkComplete();
  };

  return (
    <div className="flex-1 bg-white dark:bg-[#1d2026] flex flex-col h-full overflow-y-auto transition-colors duration-300">
      <div className="flex-1 flex flex-col items-center p-8">
        <div className="text-center max-w-4xl w-full">
          <div className="mb-8">
            <div className="w-16 h-16 bg-[#fdb606]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-[#fdb606]" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">{lecture.title}</h2>
            <div className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
              {/* <RichTextRenderer content={lecture.description || 'Document content for this lecture'} className="prose dark:prose-invert max-w-none" /> */}
              <div className="prose dark:prose-invert max-w-none">{lecture.description}</div>
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
            //  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-8 mb-10 max-w-2xl mx-auto">
            //     <div className="flex flex-col items-center">
            //        <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
            //        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Main Document</h3>
            //        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Access the main learning material for this lecture</p>
            //        <div className="flex gap-3">
            //           <Button
            //             onClick={() => handleView(documentUrl)}
            //             className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            //             variant="outline"
            //           >
            //             <ExternalLink className="w-4 h-4 mr-2" />
            //             Open in New Tab
            //           </Button>
            //           <Button
            //             onClick={() => handleDownload(documentUrl, lecture.title)}
            //             className="bg-[#fdb606] hover:bg-[#f39c12] text-black border-none"
            //           >
            //             <Download className="w-4 h-4 mr-2" />
            //             Download PDF
            //           </Button>
            //        </div>
            //     </div>
            //  </div>
             <div className="bg-white border border-gray-200 rounded-xl p-4 mb-10">
              <DocumentContent documentKey={lecture.documentKey} />
              </div>
          ) : (
             !lecture.attachments?.length && (
                <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 mb-8">
                  <p className="text-gray-500 dark:text-gray-400">No document file available for this lecture.</p>
                </div>
             )
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
                    className="p-4 bg-white dark:bg-[#1d2026] border border-gray-200 dark:border-gray-800 rounded-xl hover:border-[#fdb606]/50 dark:hover:border-[#fdb606]/50 hover:shadow-sm transition-all group text-left"
                  >
                    <div className="flex items-start gap-3">
                       <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg group-hover:bg-[#fdb606]/10 transition-colors">
                          <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-[#fdb606] dark:group-hover:text-[#fdb606]" />
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
                                  className="h-8 w-8 text-gray-400 hover:text-[#fdb606] hover:bg-[#fdb606]/10 dark:hover:bg-[#fdb606]/10"
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
