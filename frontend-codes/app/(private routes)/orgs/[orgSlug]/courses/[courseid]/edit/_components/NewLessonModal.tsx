import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { z } from "zod";
import { lessonSchema, LessonSchemaType} from "@/lib/zodSchemas";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import { createLesson } from "../actions";
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { lessonTypes } from "@/lib/zodSchemas";

// Use a constant for the form ID to ensure it's correct and unique
const LESSON_FORM_ID = "lesson-creation-form";

export function NewLessonModal({ courseId, moduleId }: {
    courseId: string;
    moduleId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof lessonSchema>>({
    resolver: zodResolver(lessonSchema) as unknown as Resolver<z.infer<typeof lessonSchema>>,
    defaultValues: {
      title: "",
      courseId: courseId,
      moduleId: moduleId,
      type: "Video",
    },
  });

  // Watch for errors to debug if needed
  const errors = form.formState.errors;
  if (Object.keys(errors).length > 0) {
    console.log("Form Validation Errors:", errors);
  }

  
  async function onSubmit(values: LessonSchemaType) {
    // Confirmation log
    console.log("Form submission successfully handled via form attribute!", values); 
    
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createLesson(values));

      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
        setIsOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      form.reset();
    }
    
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-center gap-1">
          <Plus className="size-4" /> New Lesson
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          {/* 1. Assign a unique ID to the main form element */}
          <form id={LESSON_FORM_ID} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <DialogHeader>
              <DialogTitle>Create New Lesson</DialogTitle>
              <DialogDescription>What would you like to name your lesson?</DialogDescription>
            </DialogHeader>

            {/* Form Fields Section */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Introduction to Data Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lesson type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {lessonTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* End Form Fields Section */}

            <DialogFooter>
              <Button 
                disabled={pending} 
                type="submit" // Revert to type="submit"
                // 2. CRITICAL FIX: Use the HTML 'form' attribute to target the form by ID.
                // This works even if the button is rendered outside the form element via a portal.
                form={LESSON_FORM_ID} 
              >
                {pending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
            
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}