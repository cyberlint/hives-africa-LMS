"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"; 
import * as z from "zod"; 

import { toast } from "sonner";

// All your UI components (Form primitives, buttons, cards, etc.)
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"; 
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/lms/rich-text-editor/editor";
import { Uploader } from "@/components/lms/file-uploader/uploader";
import { ArrowLeft, Loader2, PlusIcon } from "lucide-react";
import Link from "next/link";

// Your shared schema and actions
import { EventSchema, CreateEventSchema, EventVenueEnum, EventCategoryEnum } from "@/lib/zodSchemas";
import { createEvent, updateEvent } from "@/app/(public routes)/community/events/events-actions";

// Define the expected user type passed from the Server Component
interface AuthUser {
    id: string;
    role: 'user' | 'admin';
    // Add other fields from AuthUser type if necessary
}

// FIX: Define the schema for data *received from the form inputs* (dates are strings for datetime-local)
type FormInputSchema = Omit<z.infer<typeof CreateEventSchema>, 'startdate' | 'enddate'> & {
    startdate: string;
    enddate: string;
};


interface EventFormProps {
    eventData?: z.infer<typeof EventSchema>; 
    // The user data is now passed safely from the Server Component
    currentUser: AuthUser; 
}

// Helper to format Date or string to the required "YYYY-MM-DDThh:mm" string format
const formatDateForInput = (dateOrString: Date | string | undefined): string | undefined => {
    if (!dateOrString) return undefined;
    
    const date = dateOrString instanceof Date ? dateOrString : new Date(dateOrString);
    
    if (isNaN(date.getTime())) return undefined;

    return date.toISOString().slice(0, 16);
};


// Define a schema for the form validation that expects strings for dates
const FormValidatorSchema = EventSchema.omit({ 
    id: true, createdAt: true, updatedAt: true, userId: true,
    startdate: true, enddate: true 
}).extend({
    startdate: z.string().refine((val) => !isNaN(Date.parse(val)), "Start date must be a valid date"),
    enddate: z.string().refine((val) => !isNaN(Date.parse(val)), "End date must be a valid date"),
}).superRefine((data, ctx) => {
    if (data.startdate && data.enddate) {
        const start = new Date(data.startdate);
        const end = new Date(data.enddate);
        if (end <= start) {
            ctx.addIssue({
                code: "custom",
                path: ["enddate"],
                message: "End date must be after start date",
            });
        }
    }
});

export default function EventForm({ eventData, currentUser }: EventFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // useForm uses the string-based schema
    const form = useForm<FormInputSchema>({
        // The Zod resolver uses the string-based schema
        resolver: zodResolver(FormValidatorSchema), 
        defaultValues: {
            title: eventData?.title ?? "",
            shortdescription: eventData?.shortdescription ?? "",
            description: eventData?.description ?? "",
            imageKey: eventData?.imageKey || "", 
            
            // Access enum values correctly using .enum
            venue: eventData?.venue ?? EventVenueEnum.enum.NextHive, 
            url: eventData?.url || "",
            eventCategory: eventData?.eventCategory ?? EventCategoryEnum.enum.Tutorial, 
            
            isOnline: eventData?.isOnline ?? true,
            
            // Pass formatted string values to the form inputs
            startdate: formatDateForInput(eventData?.startdate) ?? formatDateForInput(new Date())!,
            enddate: formatDateForInput(eventData?.enddate) ?? formatDateForInput(new Date())!,
        },
    });

    // onSubmit accepts the string-based input values
    function onSubmit(values: FormInputSchema) {
        startTransition(async () => {
            try {
                // The currentUser prop is guaranteed to be present due to the Server Component check.
                
                // Convert string dates back to Date objects for server actions
                const dataToSend = {
                    ...values,
                    startdate: new Date(values.startdate), 
                    enddate: new Date(values.enddate),     
                } as z.infer<typeof CreateEventSchema>; // Cast to the expected Zod type


                if (eventData && eventData.id) {
                    await updateEvent(eventData.id, dataToSend);
                } else {
                    // Use the ID from the currentUser prop
                    await createEvent(dataToSend, currentUser.id);
                }

                toast.success(eventData ? "Event updated successfully" : "Event created successfully");
                form.reset();
                router.push("/community/events");

            } catch (err) {
                console.error(err);
                const errorMessage = (err && typeof err === 'object' && 'message' in err) 
                    ? (err as Error).message 
                    : "An unexpected error occurred";
                    
                toast.error(errorMessage);
            }
        });
    }


    return (
        <>
            <div className="flex items-center gap-4">
                <Link
                    href="/community/events"
                    className={buttonVariants({ variant: "outline", size: "icon" })}
                >
                    <ArrowLeft className="size-4" />
                </Link>
                <h1 className="text-2xl font-bold">
                    {eventData ? "Edit Event" : "Create Event"}
                </h1>
            </div>

            <Card className="mt-6 p-6">
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Provide basic information about the event</CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                            
                            {/* Title */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Event Title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Short Description */}
                            <FormField
                                control={form.control}
                                name="shortdescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Short Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Short Description" className="min-h-[120px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <RichTextEditor field={field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Thumbnail */}
                            <FormField
                                control={form.control}
                                name="imageKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Thumbnail Image</FormLabel>
                                        <FormControl>
                                            <Uploader 
                                                onChange={field.onChange} 
                                                value={(field.value ?? "") || ""}
                                                apiEndpoint="/api/s3/upload-public"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Venue & Category */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="venue"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Venue</FormLabel>
                                            <Select 
                                                onValueChange={field.onChange} 
                                                defaultValue={field.value}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select venue" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {/* FIX: Use .enum to access unique values, resolving the key error */}
                                                    {Object.values(EventVenueEnum.enum).map((venue) => ( 
                                                        <SelectItem key={venue} value={venue}>
                                                            {venue}
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
                                    name="eventCategory"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select 
                                                onValueChange={field.onChange} 
                                                defaultValue={field.value}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {/* FIX: Use .enum to access unique values, resolving the key error */}
                                                    {Object.values(EventCategoryEnum.enum).map((cat) => ( 
                                                        <SelectItem key={cat} value={cat}>
                                                            {cat}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* URL */}
                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Event URL</FormLabel>
                                        <FormDescription>
                                            Optional URL for external event registration/page.
                                        </FormDescription> 
                                        <FormControl>
                                            <Input 
                                                placeholder="Optional URL" 
                                                {...field} 
                                                value={field.value ?? ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Online / Offline */}
                            <FormField
                                control={form.control}
                                name="isOnline"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Format</FormLabel>
                                        <Select 
                                            // Convert boolean to string for the select component
                                            onValueChange={(val) => field.onChange(val === "true")} 
                                            defaultValue={String(field.value)}
                                            value={String(field.value)} 
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Online / In-Person" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="true">Online</SelectItem>
                                                <SelectItem value="false">In-Person</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Start & End Date */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="startdate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Date</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="datetime-local" 
                                                    {...field} 
                                                    value={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="enddate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Date</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="datetime-local" 
                                                    {...field} 
                                                    value={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        {eventData ? "Updating..." : "Creating..."} <Loader2 className="animate-spin ml-1" />
                                    </>
                                ) : (
                                    <>
                                        {eventData ? "Update Event" : "Create Event"} <PlusIcon className="ml-1" size={16} />
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