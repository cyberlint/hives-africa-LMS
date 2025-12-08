"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Menubar } from "./menubar";
import { useEffect, useState } from "react";
import textAlign from "@tiptap/extension-text-align";

export function RichTextEditor({ field }: { field: any}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent SSR mismatch by only creating the editor after mount
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        undoRedo: { depth: 100, newGroupDelay: 500 },
      }),
      textAlign.configure({
        types: ['heading', 'paragraph']
      }),
    ],
    immediatelyRender: false, // crucial for Next.js 13–15 SSR

    editorProps: {
      attributes: {
        class: "min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
      },
    },

    onUpdate: ({editor}) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },

      content: field.value ? JSON.parse(field.value): "<p></p>"
  });

  if (!mounted || !editor) {
    return null;
  }

  return (
    <div className="w-full border border-input rounded-lg overflow-hidden
    dark:bg-input/30">
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
