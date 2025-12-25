"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import textAlign from "@tiptap/extension-text-align";
import { useEffect, useState } from "react";

interface RichTextRendererProps {
  content: string; // JSON string or raw text
  className?: string;
}

export function RichTextRenderer({ content, className }: RichTextRendererProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      textAlign.configure({
        types: ['heading', 'paragraph']
      }),
    ],
    content: (() => {
      if (!content) return "";
      if (typeof content === 'object') return content;
      try {
        const parsed = JSON.parse(content);
        return typeof parsed === 'object' ? parsed : content;
      } catch {
        return content;
      }
    })(),
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: className || "focus:outline-none prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none",
      },
    },
  });

  // Re-sync content if it changes
  useEffect(() => {
    if (editor && content) {
      if (typeof content === 'object') {
          editor.commands.setContent(content);
          return;
      }
      try {
        const parsedContent = JSON.parse(content);
        editor.commands.setContent(parsedContent);
      } catch {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  if (!mounted || !editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
}
