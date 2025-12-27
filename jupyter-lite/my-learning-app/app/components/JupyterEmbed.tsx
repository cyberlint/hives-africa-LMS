'use client'; 

import React from 'react';

const JUPYTERLITE_URL = '/jupyterlite/lab/index.html';

export default function JupyterEmbed() {
  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%', // Crucial: Take up 100% of the grid cell height
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #ddd',
      }}
    >
      <iframe
        src={JUPYTERLITE_URL}
        title="Interactive JupyterLite Notebook"
        style={{ width: '100%', height: '100%', border: 'none' }}
        allowFullScreen
      />
    </div>
  );
}