import React, { useState, useRef } from 'react';
import NotebookViewer from './file-viewer-components/NotebookViewer';
import { useConstructUrl } from '@/hooks/use-construct-url';
import { getFileType } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  ExternalLink, 
  Maximize2, 
  FileText, 
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface DocumentContentProps {
  documentKey?: string;
  title?: string;
  isCompleted?: boolean;
  onMarkComplete?: () => void;
}

export const DocumentContent: React.FC<DocumentContentProps> = ({ 
  documentKey, 
  title = "Document", 
  isCompleted, 
  onMarkComplete 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  if (!documentKey) return null;

  const fileType = getFileType(documentKey);
  const documentUrl = useConstructUrl(documentKey);
  const isNotebook = fileType === 'ipynb';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = title || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onMarkComplete && !isCompleted) onMarkComplete();
  };

  const ViewerContent = ({ className }: { className?: string }) => {
    if (isNotebook) {
      return <NotebookViewer notebookUrl={documentUrl} />;
    }

    if (fileType === 'pdf') {
      return (
        <iframe
          ref={iframeRef}
          src={documentUrl}
          className={cn("w-full h-full border-0", className)}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsError(true)}
          title={title}
        />
      );
    }

    // For other docs (docx, pptx, etc), use Google Docs Viewer
    return (
      <iframe
        src={`https://docs.google.com/gview?url=${encodeURIComponent(documentUrl)}&embedded=true`}
        className={cn("w-full h-full border-0", className)}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsError(true)}
        title={title}
      />
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate max-w-[200px] sm:max-w-md">
                {title}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">
                {fileType} Viewer
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isCompleted && onMarkComplete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkComplete}
                className="hidden sm:flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                title="Mark as Complete"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="hidden lg:inline">Mark Complete</span>
              </Button>
            )}
            
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              onClick={handleDownload}
              title="Download"
            >
              <Download className="w-4 h-4" />
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 text-gray-500 hover:text-[#fdb606] dark:text-gray-400 dark:hover:text-[#fdb606] hover:border-[#fdb606]"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] p-0 gap-0 bg-gray-100 dark:bg-gray-900 border-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1d2026] border-b border-gray-200 dark:border-gray-800">
                    <DialogTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                       <FileText className="w-5 h-5 text-[#fdb606]" />
                       {title}
                    </DialogTitle>
                    {/* Close button is automatically added by DialogContent usually, but we can add controls here if needed */}
                  </div>
                  <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-950 relative">
                     <ViewerContent className="h-full w-full" />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Viewer Container */}
        <div className="relative w-full bg-gray-100 dark:bg-gray-950 min-h-[500px] h-[600px] flex flex-col group">
          {(!isNotebook && isLoading) && (
             <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 z-10">
               <Loader2 className="w-8 h-8 text-[#fdb606] animate-spin" />
             </div>
          )}
          
          <ViewerContent />

          {/* Overlay for Open in New Tab (optional, appears on hover or if needed) */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
             <Button
                variant="secondary"
                size="sm"
                className="shadow-lg pointer-events-auto bg-white/90 dark:bg-black/90 backdrop-blur"
                onClick={() => window.open(documentUrl, '_blank')}
             >
                <ExternalLink className="w-3 h-3 mr-2" />
                Open Original
             </Button>
          </div>
        </div>
      </div>

      {/* Footer Info / Fallback Actions if needed */}
      <div className="flex justify-between items-center px-2">
         <p className="text-xs text-gray-500 dark:text-gray-400">
            {isNotebook ? 'Interactive Notebook Environment' : 'Document Preview Mode'}
         </p>
         <Button
            variant="link"
            size="sm"
            onClick={() => window.open(documentUrl, '_blank')}
            className="text-xs text-gray-500 hover:text-[#fdb606] h-auto p-0"
         >
            Problem viewing? Click here to open directly
         </Button>
      </div>
    </div>
  );
};
