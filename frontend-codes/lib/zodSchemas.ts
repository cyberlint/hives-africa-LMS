import { z } from "zod";

// --- Enums ---
export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;
export const courseStatus = ["Draft", "InReview", "Published", "Archived"] as const;

export const courseCategories = [
  // Data & AI Core
  "Machine Learning",
  "Deep Learning",
  "Large Language Models (LLMs)",
  "Data Science",
  "Data Engineering",
  "MLOps & Model Deployment",
  "Artificial Intelligence Fundamentals",
  "Applied Statistics",

  // Analytics & Business Intelligence
  "Business Analytics",
  "Data Visualization & Storytelling",
  "Excel for Data Analysis",
  "Power BI & Tableau",
  "SQL & Database Analytics",
  "Product Analytics",
  "Marketing Analytics",

  // Programming & Tools
  "Python for Data Professionals",
  "R Programming",
  "SQL Fundamentals",
  "Cloud Data Platforms (AWS, GCP, Azure)",
  "APIs & Data Pipelines",
  "Git & Version Control",

  // Career Essentials & Professional Skills
  "Problem Solving & Critical Thinking",
  "Adaptability in the Workplace",
  "Communication for Data Professionals",
  "Resilience & Emotional Intelligence",
  "Collaboration & Team Skills",
  "Career Growth for Data Practitioners",
  "Portfolio Building & Job Readiness",

  // Specialized & Emerging Domains
  "Generative AI Applications",
  "AI Ethics & Responsible Innovation",
  "Data Privacy & Security",
  "Financial Data Analytics",
  "Healthcare Data Science",
  "Climate & Environmental Data",
  "Operations & Supply Chain Analytics",
] as const;

export const EventVenueEnum = z.enum([
  "NextHive",
  "GoogleMeet",
  "Zoom",
  "MicrosoftTeams",
  "Offline",
  "Hybrid",
], { errorMap: () => ({ message: "Invalid event venue selected" }) });

export const EventCategoryEnum = z.enum([
  "Hackathon",
  "Webinar",
  "BrainstormingSession",
  "NetworkingEvent",
  "PanelDiscussion",
  "QandASession",
  "Workshop",
  "Meetup",
  "Tutorial",
  "Lecture",
  "StudyGroup",
  "Roundtable",
  "DemoDay",
  "OfficeHours",
  "Competition",
  "FiresideChat",
  "CertificationCourse",
  "Bootcamp",
], { errorMap: () => ({ message: "Invalid event category selected" }) });


// --- Course Schema ---

export const courseSchema = z.object({
  title: z
    .string()
    .min(10, "Please enter a descriptive course title (at least 10 characters).")
    .max(100, "Course title cannot exceed 100 characters."),

  description: z
    .string()
    .min(10, "Provide a detailed course description (minimum 10 characters).")
    .max(2500, "Description is too long. Please keep it under 2,500 characters."),

  fileKey: z
    .string()
    .min(1, "A course image or primary media file key is required."),

  price: z
    .coerce.number()
    .min(0, "Price must be zero or higher."),

  originalPrice: z
    .coerce.number()
    .min(0, "Original price must be zero or higher.")
    .optional(),

  registrationFee: z
    .coerce.number()
    .min(0, "Registration fee must be zero or higher.")
    .optional(),

  duration: z
    .coerce.number()
    .int("Duration must be a whole number (in hours).")
    .min(1, "Course duration must be at least 1 hour.")
    .max(500, "Course duration cannot exceed 500 hours."),

  level: z.enum(courseLevels, {
    message: "Please choose the appropriate course level.",
  }),

  category: z.enum(courseCategories, {
    message: "Category is required",
  }),

  shortdescription: z
    .string()
    .min(10, "Short description must be at least 10 characters.")
    .max(150, "Short description cannot exceed 150 characters."),

  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters."),

  status: z.enum(courseStatus, {
    message: "Please select a valid course status.",
  }),
});


export const moduleSchema = z.object({
  name: z.string()
    .min(5, "Module name must be at least 5 characters."),
  courseId: z.string().uuid({ message: "Invalid course id" }),
});


// --- Enums ---
export const lessonTypes = ["Video", "Document", "Notebook", "Quiz", "Resource"] as const;

export const lessonSchema = z.object({
  title: z.string().min(3, "Lesson Title must be at least 3 characters."),
  courseId: z.string().uuid({ message: "Invalid course id" }),
  moduleId: z.string().uuid({ message: "Invalid module id" }),
  description: z.string().optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
  type: z.enum(lessonTypes),
  content: z.string().optional(),
  duration: z.coerce.number().optional(),
  documentKey: z.string().optional(),
  quizConfig: z.any().optional(),
});



export const EventSchema = z.object({
  id: z.string().uuid({ message: "Invalid event ID" }),
  title: z
    .string({ required_error: "Title is required" })
    .min(3, { message: "Title must be at least 3 characters" })
    .max(255, { message: "Title cannot exceed 255 characters" }),
  shortdescription: z
    .string({ required_error: "Short description is required" })
    .min(10, { message: "Short description must be at least 10 characters" })
    .max(500, { message: "Short description cannot exceed 500 characters" }),
  description: z
    .string({ required_error: "Description is required" })
    .min(20, { message: "Description must be at least 20 characters" }),
  startdate: z.coerce.date({ invalid_type_error: "Start date must be a valid date" }),
  enddate: z.coerce.date({ invalid_type_error: "End date must be a valid date" }),
  imageKey: z.string().nullable(),
  venue: EventVenueEnum,
  url: z.string().url({ message: "URL must be valid" }).nullable(),
  eventCategory: EventCategoryEnum,
  isOnline: z.boolean({ required_error: "Online status must be true or false" }),
  createdAt: z.date({ required_error: "CreatedAt must be a valid date" }),
  updatedAt: z.date({ required_error: "UpdatedAt must be a valid date" }),
  userId: z.string({ required_error: "User ID is required" }),
});


// CREATE EVENT SCHEMA
export const CreateEventSchema = EventSchema
  .omit({ id: true, createdAt: true, updatedAt: true, userId: true }) // user doesn’t provide these
  .superRefine((data, ctx) => {
    if (data.enddate <= data.startdate) {
      ctx.addIssue({
        code: "custom",
        path: ["enddate"],
        message: "End date must be after start date",
      });
    }
  });

// UPDATE EVENT SCHEMA
export const UpdateEventSchema = EventSchema.partial() // everything optional
  .superRefine((data, ctx) => {
    if (data.startdate && data.enddate && data.enddate <= data.startdate) {
      ctx.addIssue({
        code: "custom",
        path: ["enddate"],
        message: "End date must be after start date",
      });
    }
  });


// Infer the TypeScript type from the schema for easy use elsewhere
export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ModuleSchemaType = z.infer<typeof moduleSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;
export type EventInput = z.infer<typeof CreateEventSchema>;
export type EventUpdateInput = z.infer<typeof UpdateEventSchema>;
export type EventOutput = z.infer<typeof EventSchema>;
