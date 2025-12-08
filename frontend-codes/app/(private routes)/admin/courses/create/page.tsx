"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";
import { 
    courseCategories, 
    courseLevels, 
    courseSchema, 
    CourseSchemaType, 
    courseStatus 
} from "@/lib/zodSchemas";
import { ArrowLeft, Loader2, PlusIcon, Sparkle } from "lucide-react";
import Link from "next/link";   
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import slugify from 'slugify';
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/lms/rich-text-editor/editor";
import { Uploader } from "@/components/lms/file-uploader/uploader";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { CreateCourse } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export default function CourseCreationPage() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter()

const form = useForm<z.infer<typeof courseSchema>>({
  resolver: zodResolver(courseSchema) as unknown as Resolver<z.infer<typeof courseSchema>>,
  defaultValues: {
    title: "",
    description: "",
    fileKey: "",
    price: 0,
    duration: 0,
    level: "Beginner",
    category: "Large Language Models (LLMs)",
    status: "Draft",
    slug: "",
    shortdescription: "",
  },
});

    // Define a submit handler
    function onSubmit(values: CourseSchemaType) {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(CreateCourse(values));

            if(error) {
                toast.error("An unexpected error occured");
                return;
            }

            if(result.status === "success") {
                toast.success(result.message);
                form.reset()
                router.push("/admin/courses")

            }
            else if(result.status === "error") {
                toast.error(result.message);
            }
        });
    }
  return (
    <>
    <div className="flex tem-center gap-4">
        <Link href="/admin/courses" className={buttonVariants({
            variant: "outline",
            size: "icon"
        })}
    >
        <ArrowLeft className="size-4" />
    </Link>
    <h1 className="text-2xl font-bold">Create Courses</h1>
    </div>


    <Card className="mt-6 p-6">
        {/* Course creation form will go here */}
        <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Provide basic information about the Course
            </CardDescription>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}
                    >
                       <FormField 
                       control={form.control}
                       name="title"
                       render={({field}) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                       )}
                       /> 

                       <div className="flex gap-4 items-end">
                        <FormField 
                       control={form.control}
                       name="slug"
                       render={({field}) => (
                        <FormItem className="w-full">
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                                <Input placeholder="Slug" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                       )}
                       /> 

                       <Button type="button" className="w-fit" onClick={() => {
                        const titlevalue = form.getValues("title");
                        
                        const slug = slugify(titlevalue);

                        form.setValue('slug', slug, { shouldValidate: true });
                       }}>
                        Generate Slug <Sparkle className="ml-1" size={16} />
                       </Button>

                       </div>

                       <FormField 
                       control={form.control}
                       name="shortdescription"
                       render={({field}) => (
                        <FormItem className="w-full">
                            <FormLabel>Short Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Short Description" {...field} 
                                className="min-h-[120px]"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                       )}
                       /> 

                       <FormField 
                       control={form.control}
                       name="description"
                       render={({field}) => (
                        <FormItem className="w-full">
                            <FormLabel>Description</FormLabel>
                            <FormControl>  
                                <RichTextEditor field={field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                       )}
                       /> 

                       <FormField 
                       control={form.control}
                       name="fileKey"
                       render={({field}) => (
                        <FormItem className="w-full">
                            <FormLabel>Thumbnail Image</FormLabel>
                            <FormControl>
                                <Uploader onChange={field.onChange} value={field.value}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                       )}
                       /> 

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField 
                       control={form.control}
                       name="category"
                       render={({field}) => (
                        <FormItem className="w-full">
                            <FormLabel>Category</FormLabel>
                            <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue  placeholder="Select category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {courseCategories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                       )}
                       /> 

                       <FormField 
                       control={form.control}
                       name="level"
                       render={({field}) => (
                        <FormItem className="w-full">
                            <FormLabel>Level</FormLabel>
                            <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue  placeholder="Select level" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {courseLevels.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                       )}
                       /> 

                       <FormField 
                       control={form.control}
                       name="duration"
                       render={({field}) => (
                        <FormItem className="w-full">
                            <FormLabel>Duration (hours)</FormLabel>
                            <FormControl>
                                <Input 
                                placeholder="Duration e.g 5 hours" 
                                type="number" 
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                       )}
                       /> 


                       <FormField 
                       control={form.control}
                       name="price"
                       render={({field}) => (
                        <FormItem className="w-full">
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                                <Input 
                                placeholder="Price" 
                                type="number" 
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                       )}
                       /> 
                       </div>

                       <FormField 
                       control={form.control}
                       name="status"
                       render={({field}) => (
                        <FormItem className="w-full">
                            <FormLabel>Status</FormLabel>
                            <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue  placeholder="Select status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {courseStatus.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                       )}
                       /> 

                       <Button type="submit" disabled={isPending}>
                        {isPending ? (
                            <>
                            Creating...

                            <Loader2 className="animate-spin ml-1" />
                            </>
                        ): (
                            <>
                            Create Course <PlusIcon className="ml-1" size={16} />
                            </>
                        )}
                       </Button>
                    </form>
                </Form>
            </CardContent>
    </Card>
    </>
  );
}
