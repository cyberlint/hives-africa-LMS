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

export function NewLessonModal({ courseId, moduleId }: {
    courseId: string;
    moduleId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof lessonSchema>>({
    resolver: zodResolver(lessonSchema) as unknown as Resolver<z.infer<typeof lessonSchema>>,
    defaultValues: {
      name: "",
      courseId: courseId,
      moduleId: moduleId,
    },
  });

  
  async function onSubmit(values: LessonSchemaType) {
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

  // stays outside after fix
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
        <DialogHeader>
          <DialogTitle>Create New Lesson</DialogTitle>
          <DialogDescription>What would you like to name your lesson?</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Lesson Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button disabled={pending} type="submit">
                {pending ? "Saving..." : "Save Change"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
