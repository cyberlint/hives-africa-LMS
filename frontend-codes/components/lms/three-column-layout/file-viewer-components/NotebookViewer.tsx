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
    `${JUPYTERLITE_BASE_PATH}?path=${encodedNotebookUrl}&theme=${theme}`;
    
  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #333',
      }}
    >
      <iframe
        src={finalIframeUrl}
        title={`Interactive JupyterLite Notebook: ${notebookUrl}`}
        style={{ width: '100%', height: '100%', border: 'none' }}
        />
    </div>
  );
}