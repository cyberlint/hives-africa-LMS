"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { lessonSchema, lessonTypes, LessonSchemaType } from "@/lib/zodSchemas";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Uploader } from "@/components/lms/file-uploader/uploader";
import { VideoUploader } from "@/components/lms/file-uploader/video-uploader";
import { DocumentUploader } from "@/components/lms/file-uploader/document-uploader";
import { QuizBuilder } from "@/components/lms/quiz-builder/quiz-builder";
import { RichTextEditor } from "@/components/lms/rich-text-editor/editor";
import { updateLesson } from "../actions";
import { toast } from "sonner";
import { useState, useTransition, useEffect } from "react";
import { PlayCircle, Edit } from "lucide-react";

interface LessonData {
  id: string;
  title: string;
  description: string | null;
  thumbnailKey: string | null;
  videoKey: string | null;
  position: number;
  type: "Video" | "Document" | "Quiz" | "Resource"; 
  content: string | null;
  duration: number | null;
  documentKey?: string | null;
  quizConfig?: any;
}

interface EditLessonSheetProps {
  lesson: LessonData;
  moduleId: string;
  courseId: string;
  trigger?: React.ReactNode;
}

export function EditLessonSheet({ lesson, moduleId, courseId, trigger }: EditLessonSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pending, startTransition] = useTransition();

const form = useForm<LessonSchemaType>({
  resolver: zodResolver(lessonSchema),
  defaultValues: {
    title: lesson.title ?? "",
    description: lesson.description ?? "",
    courseId,
    moduleId,
    thumbnailKey: lesson.thumbnailKey ?? "",
    videoKey: lesson.videoKey ?? "",
    documentKey: lesson.documentKey ?? "",
    type: lesson.type ?? "Video",
    content: lesson.content ?? "",
    duration: lesson.duration ?? 0,
    quizConfig: lesson.quizConfig ?? undefined,
  },
});

    useEffect(() => {
        if(isOpen) {
            form.reset({
                title: lesson.title,
                description: lesson.description || "",
                courseId: courseId,
                moduleId: moduleId,
                thumbnailKey: lesson.thumbnailKey || undefined,
                videoKey: lesson.videoKey || undefined,
                documentKey: lesson.documentKey || undefined,
                type: lesson.type,
                content: lesson.content || "",
                duration: lesson.duration || undefined,
                quizConfig: lesson.quizConfig || undefined,
            });
        }
    }, [lesson, isOpen, courseId, moduleId, form]);


  async function onSubmit(values: z.infer<typeof lessonSchema>) {
    startTransition(async () => {
      const result = await updateLesson(values, lesson.id);

      if (result.status === "success") {
        toast.success(result.message);
        setIsOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  } 



  const currentType = form.watch("type");
  const currentDuration = form.watch("duration");

  const handleDurationChange = (duration: number) => {
      form.setValue("duration", Math.round(duration));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Edit className="size-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lesson: {lesson.title}</DialogTitle>
          <DialogDescription>
            Make changes to your lesson details and content.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-2">
            <Tabs defaultValue="settings" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
              </TabsList>

              <TabsContent value="settings" className="space-y-4 p-1">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                           className="resize-none"
                           rows={3}
                           {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Short summary of the lesson.
                      </FormDescription>
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
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                             {lessonTypes.map(type => (
                                 <SelectItem key={type} value={type}>{type}</SelectItem>
                             ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {currentType === "Video" && (
                     <FormField
                     control={form.control}
                     name="duration"
                     render={({ field }) => (
                       <FormItem className="hidden">
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                       </FormItem>
                     )}
                   />
                )}

                {currentType === "Video" && currentDuration != null && (
                     <div className="flex items-center gap-2 p-3 bg-muted rounded-md text-sm">
                        <PlayCircle className="size-4" />
                        <span>Detected Duration: {Math.floor(currentDuration / 60)}m {currentDuration % 60}s</span>
                     </div>
                )}

              </TabsContent>

              <TabsContent value="content" className="space-y-4 p-1 min-h-[300px]">
                
                {currentType === "Video" && (
                    <div className="space-y-6">
                        <FormField
                        control={form.control}
                        name="videoKey"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Video File</FormLabel>
                            <FormDescription>
                                Upload your lesson video here. (Max 512MB)
                            </FormDescription>
                            <FormControl>
                                <VideoUploader 
                                value={field.value} 
                                onChange={field.onChange}
                                onDurationChange={handleDurationChange}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        
                        <FormField
                        control={form.control}
                        name="thumbnailKey"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Thumbnail Image (Optional)</FormLabel>
                            <FormControl>
                                <Uploader 
                                value={field.value} 
                                onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                )}

                {currentType === "Document" && (
                     <div className="space-y-6">
                          <FormField
                          control={form.control}
                          name="documentKey"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Document File</FormLabel>
                               <FormDescription>Upload PDF, Word, or Presentation file.</FormDescription>
                              <FormControl>
                                  <DocumentUploader 
                                  value={field.value || lesson.documentKey || ""} 
                                  onChange={field.onChange}
                                  />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                          />

                         <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Additional Text Content (Optional)</FormLabel>
                                <FormControl>
                                    <RichTextEditor field={field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                     </div>
                )}
                
                {currentType === "Quiz" && (
                    <div className="space-y-6">
                        <FormField 
                           control={form.control}
                           name="quizConfig"
                           render={({ field }) => (
                               <FormItem>
                                   <FormControl>
                                       <QuizBuilder 
                                          value={field.value}
                                          onChange={field.onChange}
                                       />
                                   </FormControl>
                                   <FormMessage />
                               </FormItem>
                           )}
                        />
                    </div>
                )}
                
                 {currentType === "Resource" && (
                     <div className="space-y-6">
                          <FormField
                          control={form.control}
                          name="documentKey"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Resource File</FormLabel>
                               <FormDescription>Upload downloadable resources (PDF, Zip, Code, etc).</FormDescription>
                              <FormControl>
                                  <DocumentUploader 
                                  value={field.value || lesson.documentKey || ""} 
                                  onChange={field.onChange}
                                  />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                          />

                         <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Instructions / Description</FormLabel>
                                <FormControl>
                                    <RichTextEditor field={field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                     </div>
                 )}

              </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-4 gap-2">
                 <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
               <Button disabled={pending} type="submit">
                {pending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
