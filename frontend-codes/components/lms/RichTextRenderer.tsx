import React from 'react';
import { useEditor, EditorContent, JSONContent } from '@tiptap/react'; 
import StarterKit from '@tiptap/starter-kit';
import textAlign from "@tiptap/extension-text-align";

interface RichTextRendererProps {
  // Pass the raw JSON string from the database
  contentJsonString: string; 
  className?: string;
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({ contentJsonString, className }) => {
  let parsedContent: JSONContent | null = null;
  
  try {
    // Attempt to parse the string into a JavaScript object
    parsedContent = JSON.parse(contentJsonString) as JSONContent;
  } catch (e) {
    console.error("Error parsing Rich Text JSON:", e);
    return <p className={`text-red-500 p-4 border border-red-300 rounded ${className}`}>Error rendering content: Invalid JSON format.</p>;
  }

  const editor = useEditor({
    editable: false, 
    content: parsedContent, 
    extensions: [
      StarterKit.configure({
        undoRedo: { depth: 100, newGroupDelay: 500 },
      }),
      textAlign.configure({
        types: ['heading', 'paragraph']
      }),
    ],
    immediatelyRender: false,
  });



  if (!editor) {
    return <span className={`text-gray-500 ${className}`}>Loading content...</span>;
  }

  // The EditorContent component renders the parsed JSON content as HTML/React elements.
  return (
    <p className={className}>
      <EditorContent editor={editor} />
    </p>
  );
};