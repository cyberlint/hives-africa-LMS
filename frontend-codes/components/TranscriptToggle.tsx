import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface TranscriptToggleProps {
  transcriptContent: string; 
}

export function TranscriptToggle({ transcriptContent }: TranscriptToggleProps) {
  // State to track if the transcript is shown
  const [isShown, setIsShown] = useState(false);

  const toggleTranscript = () => {
    setIsShown(!isShown);
  };

  return (
    <div className="my-4">
      {/* The Toggle Button */}
      <Button 
        onClick={toggleTranscript} 
        variant="outline"
        className="flex items-center gap-2 transition-colors"
        aria-expanded={isShown}
        aria-controls="transcript-area"
      >
        {/* Dynamic Icon */}
        {isShown 
          ? <X className="h-4 w-4 transition-transform" /> 
          : <Menu className="h-4 w-4 transition-transform" />}
        
        {/* Dynamic Text */}
        {isShown ? 'Hide Transcript' : 'Show Transcript'}
      </Button>

      {/* The Content Area */}
      {isShown && (
        <div 
          id="transcript-area" 
          className="mt-4 p-4 border rounded-lg bg-card text-card-foreground shadow-sm"
          role="region"
        >
          {/* Using whitespace-pre-line preserves line breaks in the content */}
          <p className="text-sm whitespace-pre-line">{transcriptContent}</p>
        </div>
      )}
    </div>
  );
}