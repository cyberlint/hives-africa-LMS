"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"; 
import * as z from "zod"; 

import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"; 
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/lms/rich-text-editor/editor";
import { Uploader } from "@/components/lms/file-uploader/uploader";
import { ArrowLeft, Loader2, PlusIcon } from "lucide-react";
import Link from "next/link";

// Shared schema and actions
import { EventSchema, CreateEventSchema, EventVenueEnum, EventCategoryEnum } from "@/lib/zodSchemas";
import { createEvent, updateEvent } from "../events-actions";

// Define the expected user type passed from the Server Component
interface AuthUser {
    id: string;
    role: 'user' | 'admin';
}

// Define the schema for data received from the form inputs
type FormInputSchema = Omit<z.infer<typeof CreateEventSchema>, 'startdate' | 'enddate'> & {
    startdate: string;
    enddate: string;
};

interface EventFormProps {
    eventData?: z.infer<typeof EventSchema>; 
    currentUser: AuthUser; 
}

// Helper to format Date or string to the required "YYYY-MM-DDThh:mm" format
const formatDateForInput = (dateOrString: Date | string | undefined): string | undefined => {
    if (!dateOrString) return undefined;
    
    const date = dateOrString instanceof Date ? dateOrString : new Date(dateOrString);
    if (isNaN(date.getTime())) return undefined;

    return date.toISOString().slice(0, 16);
};

// Validator schema that expects strings for dates from the input fields
const FormValidatorSchema = EventSchema.omit({ 
    id: true, createdAt: true, updatedAt: true, userId: true,
    startdate: true, enddate: true 
}).extend({
    startdate: z.string().refine((val) => !isNaN(Date.parse(val)), "Start date must be a valid date"),
    enddate: z.string().refine((val) => !isNaN(Date.parse(val)), "End date must be a valid date"),
}).superRefine((data, ctx) => {
    
    // 1. Enforce URL for online events
    if (data.isOnline) {
        if (!data.url || data.url.trim() === "") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["url"],
                message: "Event URL is required for online events",
            });
        }
    }

    // 2. Enforce chronological dates
    if (data.startdate && data.enddate) {
        const start = new Date(data.startdate);
        const end = new Date(data.enddate);
        if (end <= start) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["enddate"],
                message: "End date must be after start date",
            });
        }
    }
});

export default function EventForm({ eventData, currentUser }: EventFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<FormInputSchema>({
        resolver: zodResolver(FormValidatorSchema), 
        defaultValues: {
            title: eventData?.title ?? "",
            shortdescription: eventData?.shortdescription ?? "",
            description: eventData?.description ?? "",
            imageKey: eventData?.imageKey || "", 
            venue: eventData?.venue ?? EventVenueEnum.enum.NextHive, 
            url: eventData?.url || "",
            eventCategory: eventData?.eventCategory ?? EventCategoryEnum.enum.Tutorial, 
            isOnline: eventData?.isOnline ?? true,
            startdate: formatDateForInput(eventData?.startdate) ?? formatDateForInput(new Date())!,
            enddate: formatDateForInput(eventData?.enddate) ?? formatDateForInput(new Date())!,
        },
    });

    function onSubmit(values: FormInputSchema) {
        startTransition(async () => {
            try {
                const dataToSend = {
                    ...values,
                    startdate: new Date(values.startdate), 
                    enddate: new Date(values.enddate),     
                } as z.infer<typeof CreateEventSchema>; 

                if (eventData && eventData.id) {
                    await updateEvent(eventData.id, dataToSend);
                } else {
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
        <div className="mx-auto max-w-4xl py-10 px-4 sm:px-6">
            
            {/* Header Section */}
            <div className="mb-8 flex items-center gap-4">
                <Button asChild variant="outline" size="icon" className="shrink-0 rounded-full">
                    <Link href="/community/events">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        {eventData ? "Edit Event" : "Create Event"}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {eventData ? "Update the details of your upcoming event." : "Fill out the details below to host a new event."}
                    </p>
                </div>
            </div>

            {/* Clean, Flat Card */}
            <Card className="border-border shadow-sm">
                <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-5">
                    <CardTitle className="text-lg">Event Details</CardTitle>
                    <CardDescription>Provide the necessary information for the community.</CardDescription>
                </CardHeader>

                <CardContent className="p-6 sm:p-8">
                    <Form {...form}>
                        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                            
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

                            <FormField
                                control={form.control}
                                name="shortdescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Short Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="A brief summary of the event..." className="min-h-[100px] resize-none" {...field} />
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
                                        <FormLabel>Full Description</FormLabel>
                                        <FormControl>
                                            <div className="overflow-hidden rounded-md border border-input">
                                                <RichTextEditor field={field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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

                            {/* Two-Column Grid Sections */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="venue"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Venue</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select venue" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.values(EventVenueEnum.enum).map((venue) => ( 
                                                        <SelectItem key={venue} value={venue}>{venue}</SelectItem>
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
                                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.values(EventCategoryEnum.enum).map((cat) => ( 
                                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Event URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://..." {...field} value={field.value ?? ''} />
                                            </FormControl>
                                            <FormDescription>Optional external link for the event.</FormDescription> 
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="isOnline"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Format</FormLabel>
                                            <Select onValueChange={(val) => field.onChange(val === "true")} defaultValue={String(field.value)} value={String(field.value)}>
                                                <FormControl>
                                                    <SelectTrigger>
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

                                <FormField
                                    control={form.control}
                                    name="startdate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Date & Time</FormLabel>
                                            <FormControl>
                                                <Input type="datetime-local" {...field} value={field.value} />
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
                                            <FormLabel>End Date & Time</FormLabel>
                                            <FormControl>
                                                <Input type="datetime-local" {...field} value={field.value} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                                    {isPending ? (
                                        <>
                                            {eventData ? "Updating..." : "Creating..."} 
                                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                        </>
                                    ) : (
                                        <>
                                            {eventData ? "Update Event" : "Create Event"} 
                                            <PlusIcon className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}