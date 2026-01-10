import React, { useState, useRef } from 'react';
import NotebookViewer from './file-viewer-components/NotebookViewer';
import { useConstructUrl } from '@/hooks/use-construct-url';
import { getFileType } from '@/lib/utils';

interface DocumentContentProps {
  documentKey?: string;
  title?: string;
  isCompleted?: boolean;
  onMarkComplete?: () => void;
}

export const DocumentContent: React.FC<DocumentContentProps> = ({ documentKey }) => {
    
    const documentUrl = useConstructUrl(documentKey ?? "");

    if (!documentKey || !documentUrl) return null;

    const fileType = getFileType(documentKey);
    console.log("this is the file type:" + fileType);
    console.log("this is the document url:" + documentUrl);
    // // List of file types that are typically not viewed in-browser via <iframe>
    // const filesToDownload = ['zip', 'rar', 'exe', 'msi', 'dmg'];


    // 1. Special Case: Jupyter Notebooks (uses custom component)
    if (fileType === 'ipynb') {
      return <NotebookViewer notebookUrl={documentUrl} />;
    }

    // // 2. Special Case: Force Download/Link for compressed/executable files
    // if (filesToDownload.includes(fileType)) {
    //   return (
    //     <div className="p-6 text-center">
    //       <p className="text-lg text-gray-700 mb-4">
    //         This file type ({fileType.toUpperCase()}) must be downloaded and opened externally.
    //       </p>
    //       <a 
    //         href={documentUrl}
    //         target="_blank" 
    //         rel="noreferrer"
    //         className="text-blue-600 hover:underline font-medium"
    //         download 
    //       >
    //         Click here to download the file.
    //       </a>
    //     </div>
    //   );
    // }

    // 3. Default (In-line Viewer)
    const viewerUrl = 
      (fileType === 'docx' || fileType === 'xlsx' || fileType === 'pptx')
        ? `https://docs.google.com/gview?url=${encodeURIComponent(documentUrl)}&embedded=true`
        : documentUrl; 

    return (
      <div className="w-full h-[600px] lg:h-[800px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <iframe
          src={viewerUrl}
          title={`Viewing document: ${documentKey}`}
          className="w-full h-full border-0" 
          allow="fullscreen; clipboard-read; clipboard-write"
        />
      </div>
    );
};