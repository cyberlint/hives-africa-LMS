'use client'; 

import React from 'react';

interface NotebookViewerProps {
  notebookUrl: string; 
  theme?: string; 
}

// Base path to the static JupyterLite distribution we copied to public/
const JUPYTERLITE_BASE_PATH = '/jupyterlite/lab/index.html';

export default function NotebookViewer({ notebookUrl, theme = 'JupyterLab Dark' }: NotebookViewerProps) {
  
  // URL-encode the external notebook URL.
  const encodedNotebookUrl = encodeURIComponent(notebookUrl);
  
  // Construct the final iframe URL using the encoded external path.
  const finalIframeUrl = 
    `${JUPYTERLITE_BASE_PATH}?path=${notebookUrl}&theme=${theme}`;
    console.log("this is the final iframe url:" + finalIframeUrl);
  return (
    <div className="w-full h-[600px] lg:h-[800px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1e1e1e]">
      <iframe
        src={finalIframeUrl}
        title={`Interactive Notebook: ${notebookUrl}`}
        className="w-full h-full border-none"
        allow="fullscreen; clipboard-read; clipboard-write"
      />
    </div>
  );
}