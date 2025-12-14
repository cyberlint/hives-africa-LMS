"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DndContext,
  DragEndEvent,
  DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ReactNode, useEffect, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, FileText, GripVertical, GripVerticalIcon, Trash2, PlayCircle, HelpCircle, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { reorderLessons } from "@/app/(private routes)/admin/courses/[courseid]/edit/actions";
import { reorderModules } from "@/app/(private routes)/admin/courses/[courseid]/edit/actions";
import { NewModuleModal } from "./NewModuleModal";
import { NewLessonModal } from "./NewLessonModal";
import { DeleteLesson } from "./DeleteLesson";
import { DeleteModule } from "./DeleteModule";
import { EditLessonSheet } from "./EditLessonSheet";

interface iAppProps {
  data: AdminCourseSingularType;
}

type ModuleType = NonNullable<AdminCourseSingularType>['module'][number];
type LessonType = ModuleType['lessons'][number];

interface SortableItemProps {
    id: string;
    children: (listeners: DraggableSyntheticListeners) => ReactNode
    className?: string;
    data?: {
        type: "module" | "lesson",
        moduleId?: string;     //Only relevant for when we want to drag lessons in a module instead of the module itself
    };
}
  function SortableItem({children, id, className, data}: SortableItemProps) {

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
      useSortable({ id: id, data: data });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      className={cn("touch-none", className, isDragging ? "z-10" : "")}
      >
        {children(listeners)}
      </div>
    );
  }

export function CourseStructure({ data }: iAppProps) {

  console.log("Course Data:", data); 
  console.log("Modules Array:", data?.module);

  const initialItems =
    data.module.map((module: ModuleType) => ({
      id: module.id,
      title: module.title,
      order: module.position,
      isOpen: true,   //Default module collapsible to open
      lessons: module.lessons.map((lesson: LessonType) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
        description: lesson.description,
        thumbnailKey: lesson.thumbnailKey,
        videoKey: lesson.videoKey,
        type: lesson.type,
        content: lesson.content,
        duration: lesson.duration,
        documentKey: lesson.documentKey,
        quizConfig: lesson.quizConfig,
      })),
    })) || [];

  const [items, setItems] = useState(initialItems);

useEffect(() => {
  setItems((prevItems: any) => {
    const updatedItems = data.module.map((module: ModuleType) => ({
      id: module.id,
      title: module.title,
      order: module.position,
      isOpen: prevItems.find((item: any) => item.id === module.id)?.isOpen ?? true,
      lessons: module.lessons.map((lesson: LessonType) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
        description: lesson.description,
        thumbnailKey: lesson.thumbnailKey,
        videoKey: lesson.videoKey,
        type: lesson.type,
        content: lesson.content,
        duration: lesson.duration,
        documentKey: lesson.documentKey,
        quizConfig: lesson.quizConfig,
      })),
    })) || [];

    return updatedItems;
  });
}, [data]);


  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) { 
        return;  
    }

    const activeId = active.id;
    const overId = over.id;
    const activeType = active.data.current?.type as "module" | "lesson";
    const overType = over.data.current?.type as "module" | "lesson";
    const courseId = data.id;

    if (activeType === "module") {
      let targetModuleId = null;

      if (overType === "module") {
        targetModuleId = overId;
      } else if (overType === "lesson") {
        targetModuleId = over.data.current?.moduleId ?? null;
      }

      if (!targetModuleId) {
        toast.error("Could not determine the module for reordering.");
        return;
      }

      const oldIndex = items.findIndex((item: any) => item.id === activeId);
      const newIndex = items.findIndex((item: any) => item.id === targetModuleId);

      if (oldIndex === -1 || newIndex === -1) {
        toast.error("Could not find module old/new index for reordering.");
        
        return;
      }

      const reorderedLocalModule = arrayMove(items, oldIndex, newIndex);
      const updatedModuleForState = reorderedLocalModule.map((module: any, index: number) => ({
        ...module,
        order: index + 1,
      }));

      const previousItems = [...items];

      setItems(updatedModuleForState);

      if (courseId) {
        const modulesToUpdate = updatedModuleForState.map((module: any) => ({
          id: module.id,
          position: module.order,
        }));

        const reorderPromise = () => 
          reorderModules(
          courseId,
          modulesToUpdate
        );

        toast.promise(
          reorderPromise(),
          {
            loading: "Reordering modules...",
            success: (result) => {
              if((result as any).status === "success")
                return (result as any).message;
              throw new Error((result as any).message)
          },
          error : () => {
            setItems(previousItems);
            return "Failed to reorder modules."
          },
      });
      }
      return;
  }

  if (activeType === "lesson" && overType === "lesson") {
      const moduleId = active.data.current?.moduleId;
      const overModuleId = over.data.current?.moduleId;

      if(!moduleId || moduleId !== overModuleId) {
        toast.error("Cannot move lessons between different modules."
        );
        return;
      }

      const moduleIndex = items.findIndex((module: any) => module.id === moduleId);
      if (moduleIndex === -1) {
        toast.error("Could not find module for reordering lessons.");
        return;
      }

      const moduleToUpdate = items[moduleIndex];

      const oldLessonIndex = moduleToUpdate.lessons.findIndex((lesson: any) => lesson.id === activeId);
      const newLessonIndex = moduleToUpdate.lessons.findIndex((lesson: any) => lesson.id === overId);


      if (oldLessonIndex === -1 || newLessonIndex === -1) {
        toast.error("Could not find lesson old/new index for reordering.");
        return;
      }

      const reorderedLessons = arrayMove(
        moduleToUpdate.lessons,
        oldLessonIndex,
        newLessonIndex
      );

      const updatedLessonsForState = reorderedLessons.map((lesson: any, index: number) => ({
        ...lesson,
        order: index + 1,
      }));

      const newItems = [...items];

      newItems[moduleIndex] = {
        ...moduleToUpdate,
        lessons: updatedLessonsForState,
      };

      const previousItems = [...items];
      setItems(newItems);
      
      if (courseId) {
        const lessonsToUpdate = updatedLessonsForState.map((lesson: any) => ({
          id: lesson.id,
          position: lesson.order,
        }));

        const reorderLessonsPromise = () => 
          reorderLessons(
          moduleId,
          lessonsToUpdate,
          courseId
        );
        toast.promise(
          reorderLessonsPromise(),
          {
            loading: "Reordering lessons...",
            success: (result) => {
              if((result as any).status === "success") 
                return (result as any).message;
              throw new Error((result as any).message)
          },
          error : () => {
            setItems(previousItems);
            return "Failed to reorder lessons."
          },
      });
      }

      return;
    }
}

  function toggleModule(moduleId: string) {
    setItems(
        items.map((module: any) => 
            module.id === moduleId 
        ? {...module, isOpen: !module.isOpen}
        : module
    )
    );
  }
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border">
          <CardTitle>Modules</CardTitle>
          <NewModuleModal courseId={data.id}/>
        </CardHeader>
        <CardContent className="space-y-8">
          <SortableContext items={items} 
          strategy={verticalListSortingStrategy}>
            {items.map((item: any) => (
                <SortableItem id={item.id} 
                data={{type: "module"}} 
                key={item.id}
            >
                {(listeners) => (
                    <Card>
                        <Collapsible 
                        open={item.isOpen} 
                        onOpenChange={() => toggleModule(item.id)}
                        >

                            <div className="flex item-center justify-between p-3
                            border-b border-border">
                                <div className="flex items-center gap-2">
                                    <Button 
                                    variant={"ghost"}
                                    size={"icon"}
                                    {...listeners}
                                    >
                                        <GripVertical className="size-4" />
                                    </Button>
                                    <CollapsibleTrigger asChild>
                                    <Button 
                                    size="icon"
                                    variant={"ghost"}
                                    className="flex items-center">
                                      {item.isOpen ? (
                                        <ChevronDown className="size-4"/>
                                      ) : (
                                        <ChevronRight className="size-4"/>
                                      )}
                                    </Button>
                                    </CollapsibleTrigger>

                                    <p className="cursor-pointer hover:text-primary pl-2">
                                      {item.title}
                                    </p>
                                </div>

                                <DeleteModule moduleId={item.id} courseId={data.id}/>
                            </div>

                            <CollapsibleContent>
                            <div className="p-1">
                              <SortableContext
                              items={item.lessons.map((lesson: any) => lesson.id)}
                              strategy={verticalListSortingStrategy}
                              >
                                {item.lessons.map((lesson: any) => (
                                    <SortableItem key={lesson.id} id={lesson.id}
                                    data={{type: "lesson", moduleId: item.id}}
                                    >
                                        {(lessonListeners) => (
                                          <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                          <div className="flex item-center gap-2">
                                            <Button 
                                            variant="ghost" 
                                            size="icon"
                                            {...lessonListeners}
                                            >
                                              <GripVerticalIcon className="size-4" />
                                            </Button>
                                            <div className="flex items-center gap-2">
                                            {lesson.type === 'Video' && <PlayCircle className="size-4 text-blue-500" />}
                                            {lesson.type === 'Document' && <FileText className="size-4 text-orange-500" />}
                                            {lesson.type === 'Quiz' && <HelpCircle className="size-4 text-green-500" />}
                                            {lesson.type === 'Resource' && <Folder className="size-4 text-purple-500" />}
                                            <EditLessonSheet 
                                              lesson={lesson}
                                              moduleId={item.id}
                                              courseId={data.id}
                                              trigger={
                                                <span className="cursor-pointer hover:underline">
                                                  {lesson.title}
                                                </span>
                                              }
                                            />
                                            </div>

                                          </div>
                                          <DeleteLesson 
                                          moduleId={item.id}
                                          courseId={data.id}
                                          lessonId={lesson.id} />
                                          </div>
                                        )}
                                    </SortableItem>
                                ))}
                              </SortableContext> 
                              <div className="p-2">
                                <NewLessonModal 
                                moduleId={item.id} 
                                courseId={data.id} 
                                />
                                </div>
                            </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </Card>
                )} 
            </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
}
