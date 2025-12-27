
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, FileText, Download, ExternalLink } from 'lucide-react';
import type { Lecture } from '@/types/course';
import { constructUrl } from '@/lib/construct-url';
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
    <div className="flex-1 bg-white flex flex-col h-full overflow-y-auto">
      <div className="flex-1 flex flex-col items-center p-8">
        <div className="text-center max-w-4xl w-full">
          <div className="mb-8">
            <div className="w-16 h-16 bg-yellow/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-yellow" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900">{lecture.title}</h2>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {lecture.description || 'Document content for this lecture'}
            </p>
          </div>
          
          {isCompleted && (
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-8">
              <CheckCircle className="w-4 h-4" />
              <span>Completed</span>
            </div>
          )}

          {/* Primary Document Action */}
          {documentUrl ? (
             <div className="bg-white border border-gray-200 rounded-xl p-4 mb-10">
              <DocumentContent documentKey={lecture.documentKey} />
              </div>
          ) : (
             !lecture.attachments?.length && (
                <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 mb-8">
                  <p className="text-gray-500">No document file available for this lecture.</p>
                </div>
             )
          )}

          {/* Attachments Section */}
          {lecture.attachments && lecture.attachments.length > 0 && (
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                 <div className="h-px bg-gray-200 flex-1"></div>
                 <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Additional Resources</span>
                 <div className="h-px bg-gray-200 flex-1"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lecture.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="p-4 bg-white border border-gray-200 rounded-xl hover:border-yellow/50 hover:shadow-sm transition-all group text-left"
                  >
                    <div className="flex items-start gap-3">
                       <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-yellow/10 transition-colors">
                          <FileText className="w-5 h-5 text-gray-500 group-hover:text-yellow" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate mb-1">
                            {attachment.title}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                            {attachment.description || "No description available"}
                          </p>
                          
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span className="capitalize bg-gray-100 px-2 py-0.5 rounded text-gray-600">{attachment.type}</span>
                                {attachment.fileSize && <span>{attachment.fileSize}</span>}
                             </div>
                             
                             <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-400 hover:text-yellow hover:bg-yellow/10"
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
