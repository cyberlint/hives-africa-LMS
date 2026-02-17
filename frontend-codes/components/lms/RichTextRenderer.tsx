"use client";

import React, { useMemo } from 'react'; // useMemo is key here
import { useEditor, EditorContent, JSONContent } from '@tiptap/react'; 
import StarterKit from '@tiptap/starter-kit';
import textAlign from "@tiptap/extension-text-align";

interface RichTextRendererProps {
  // Pass the raw JSON string from the database
  contentJsonString: string; 
  className?: string;
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({ contentJsonString, className }) => {
    // 1. Parsing logic moved BEFORE the Hook call, but the early return is gone.
    // 2. We use useMemo to only parse when the string changes.
    const parsedContent: JSONContent | undefined = useMemo(() => {
        try {
            return JSON.parse(contentJsonString) as JSONContent;
        } catch (e) {
            console.warn("Content is not valid JSON.", e);
            // On failure, return undefined, which we check later.
            return undefined; 
        }
    }, [contentJsonString]);


    // 3. The Hook is called UNCONDITIONALLY at the top level.
    const editor = useEditor({
      editable: false, 
      content: parsedContent, // Pass the parsed content
      extensions: [
        StarterKit.configure({
          undoRedo: { depth: 100, newGroupDelay: 500 },
        }),
        textAlign.configure({
          types: ['heading', 'paragraph']
        }),
      ],
      immediatelyRender: false,
      // If parsedContent is undefined, Tiptap will initialize with default empty content.
    }, [parsedContent]); // Add parsedContent as a dependency for the editor to update if content changes.


    // 4. Handle the fallback logic *after* all Hooks have been called.
    if (!parsedContent) {
        // Fallback rendering for invalid JSON
        return <p className={className}>{contentJsonString}</p>;
    }


    if (!editor) {
      return <span className={`text-gray-500 ${className}`}>Loading content...</span>;
    }

    // The EditorContent component renders the parsed JSON content as HTML/React elements.
    return (
        <EditorContent editor={editor} className={className}/>
    );
};