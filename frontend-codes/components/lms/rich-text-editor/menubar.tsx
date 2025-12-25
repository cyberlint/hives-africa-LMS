import { Editor } from "@tiptap/react";
import { Tooltip, 
         TooltipContent, 
         TooltipProvider, 
         TooltipTrigger 
} from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import { AlignCenter, 
         AlignLeft, 
         AlignRight, 
         Bold, 
         Heading1Icon, 
         Heading2Icon, 
         Heading3Icon, 
         Italic, 
         ListIcon, 
         ListOrderedIcon, 
         Redo, 
         Strikethrough, 
         Undo 
} from "lucide-react";
import { Button } from "@/components/ui/button";
// 💡 We need useState and useEffect to listen to editor events
import { useEffect, useState } from "react"; 

interface iAppProps {
  editor: Editor | null;
}

export function Menubar({ editor }: iAppProps) {
  // 1. Add a state hook to force re-renders
  // We don't care about the value, just the update function
  const [, setRefresh] = useState(0); 

  // 2. Add an effect to listen for editor state changes
  useEffect(() => {
    if (!editor) return;
    // This function forces the Menubar component to re-render
    const handleUpdate = () => {
        // Increment the state to trigger a re-render
        setRefresh(prev => prev + 1); 
    };

    // Listen for any transaction/update to the editor state
    editor.on('transaction', handleUpdate);
    
    // Set initial state correctly on mount
    handleUpdate();

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      editor.off('transaction', handleUpdate);
    };
  }, [editor]); // Re-run effect if editor instance changes (though it shouldn't here)

  if (!editor) return null;

  return (
    <div className="border border-input border-t-0 border-x-0 rounded-t-lg 
    p-2 bg-card flex flex-wrap gap-1 items-center">
    <TooltipProvider>
      
      {/* 1. TEXT FORMATTING BUTTONS */}
      <div className="flex flex-wrap gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("bold")}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
              className={`${
                editor.isActive("bold") ? "bg-muted text-muted-foreground" : ""
              }`}
            >
              <Bold className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Bold</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("italic")}
              onPressedChange={() => editor.chain().focus().toggleItalic().run()}
              className={`${
                editor.isActive("italic") ? "bg-muted text-muted-foreground" : ""
              }`}
            >
              <Italic className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Italic</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("strike")}
              onPressedChange={() => editor.chain().focus().toggleStrike().run()}
              className={`${
                editor.isActive("strike") ? "bg-muted text-muted-foreground" : ""
              }`}
            >
              <Strikethrough className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Strike through</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", {level: 1})}
              onPressedChange={() => editor.chain().focus().toggleHeading({level: 1}).run()}
              className={`${
                editor.isActive("heading", {level: 1}) ? "bg-muted text-muted-foreground" : ""
              }`}
            >
              <Heading1Icon className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Heading 1</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", {level: 2})}
              onPressedChange={() => editor.chain().focus().toggleHeading({level: 2}).run()}
              className={`${
                editor.isActive("heading", {level: 2}) ? "bg-muted text-muted-foreground" : ""
              }`}
            >
              <Heading2Icon className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Heading 2</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", {level: 3})}
              onPressedChange={() => editor.chain().focus().toggleHeading({level: 3}).run()}
              className={`${
                editor.isActive("heading", {level: 3}) ? "bg-muted text-muted-foreground" : ""
              }`}
            >
              <Heading3Icon className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Heading 3</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("bulletList")}
              onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
              className={`${
                editor.isActive("bulletList") ? "bg-muted text-muted-foreground" : ""
              }`}
            >
              <ListIcon className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Bullet list</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("orderedList")}
              onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
              className={`${
                editor.isActive("orderedList") ? "bg-muted text-muted-foreground" : ""
              }`}
            >
              <ListOrderedIcon className="h-4 w-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Ordered list</TooltipContent>
        </Tooltip>
      </div>

      {/* DIVIDER 1 */}
      <div className="w-px h-6 bg-border mx-2"></div>
      
      {/* 2. ALIGNMENT BUTTONS */}
      <div className="flex flex-wrap gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive({textAlign: 'left'})}
              onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
              className={`${
                editor.isActive({textAlign: 'left'}) ? "bg-muted text-muted-foreground" : ""
              }`}
            >
              <AlignLeft />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Align left</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive({textAlign: 'center'})}
              onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
              className={`${
                editor.isActive({textAlign: 'center'}) ? "bg-muted text-muted-foreground" : ""
              }`}
            >
              <AlignCenter />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Align center</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive({textAlign: 'right'})}
              onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
              className={`${
                editor.isActive({textAlign: 'right'}) ? "bg-muted text-muted-foreground" : ""
              }`}
            >
              <AlignRight />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Align right</TooltipContent>
        </Tooltip>
      </div>

      {/* DIVIDER 2 */}
      <div className="w-px h-6 bg-border mx-2"></div>
      
      {/* 3. HISTORY BUTTONS (Undo/Redo) */}
      <div className="flex flex-wrap gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="ghost" type="button" 
              onClick={() => editor.chain().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="ghost" type="button" 
              onClick={() => editor.chain().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
    </div>
  );
}
