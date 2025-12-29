// import NotebookViewer from './file-viewer-components/NotebookViewer';
// import { useConstructUrl } from '@/hooks/use-construct-url';
// import { getFileType } from '@/lib/utils';

// interface DocumentContentProps {
//   documentKey?: string;
// }

// export const DocumentContent: React.FC<DocumentContentProps> = ({ documentKey }) => {
//   if (!documentKey) return null;

//   const fileType = getFileType(documentKey);
//   const documentUrl = useConstructUrl(documentKey);

//   switch (fileType) {
//     case 'ipynb':
//       return <NotebookViewer notebookUrl={documentUrl} />;

//     case 'pdf':
//       return (
//         <iframe
//           src={documentUrl}
//           className="w-full h-full border-0"
//         />
//       );

//     case 'docx':
//       return (
//         <div className="p-6">
//           <a href={documentUrl} target="_blank" rel="noreferrer">
//             Open Word document
//           </a>
//         </div>
//       );

//     default:
//       return (
//         <div className="p-6">
//           <a href={documentUrl} target="_blank" rel="noreferrer">
//             Open document
//           </a>
//         </div>
//       );
//   }
// };





import NotebookViewer from './file-viewer-components/NotebookViewer';
import { useConstructUrl } from '@/hooks/use-construct-url';
import { getFileType } from '@/lib/utils';
import React from 'react';

interface DocumentContentProps {
  documentKey?: string;
}

export const DocumentContent: React.FC<DocumentContentProps> = ({ documentKey }) => {
  if (!documentKey) return null;

  const fileType = getFileType(documentKey);
  const documentUrl = useConstructUrl(documentKey);
  
  // List of file types that are typically not viewed in-browser via <iframe> (due to browser security/support)
  // These files often require dedicated viewers or are best downloaded.
  const filesToDownload = ['zip', 'rar', 'exe', 'msi', 'dmg'];


  // 1. Special Case: Jupyter Notebooks (uses custom component)
  if (fileType === 'ipynb') {
    return <NotebookViewer notebookUrl={documentUrl} />;
  }

  // 2. Special Case: Force Download/Link for compressed/executable files
  if (filesToDownload.includes(fileType)) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-gray-700 mb-4">
          This file type ({fileType.toUpperCase()}) must be downloaded and opened externally.
        </p>
        <a 
          href={documentUrl} 
          target="_blank" 
          rel="noreferrer"
          className="text-blue-600 hover:underline font-medium"
          download 
        >
          Click here to download the file.
        </a>
      </div>
    );
  }

  // 3. Default (In-line Viewer)
  // This handles PDF, DOCX, TXT, HTML, JPG, PNG, etc. 
  // Browser support varies:
  // - PDF, JPG, PNG, GIF, TXT, basic HTML: Works well via <iframe>.
  // - DOCX, XLSX, PPTX: REQUIRES a service like Google Docs Viewer.
  
  // If the file is a Microsoft Office document (docx, xlsx, pptx), we use the Google Docs Viewer service to render it in the iframe.
  const viewerUrl = 
    (fileType === 'docx' || fileType === 'xlsx' || fileType === 'pptx')
      ? `https://docs.google.com/gview?url=${encodeURIComponent(documentUrl)}&embedded=true`
      : documentUrl; 

  return (
    <iframe
      src={viewerUrl}
      title={`Viewing document: ${documentKey}`}
      // Tailwind classes to ensure it fills the container
      className="w-full h-full border-0" 
      // Allows the browser to try and render the content in the frame
      allow="fullscreen"
    />
  );
};