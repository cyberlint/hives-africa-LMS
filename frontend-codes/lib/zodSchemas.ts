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


export const lessonSchema = z.object({
    name: z.string()
        .min(5, "Lesson name must be at least 5 characters."),
    courseId: z.string().uuid({ message: "Invalid course id" }),
    moduleId: z.string().uuid({ message: "Invalid module id" }),
    description: z.string()
        .min(5, { message: "Lesson description must be at least 5 characters." })
        .optional(),
    thumbnailKey: z.string().optional(),
    videoKey: z.string().optional(),
});


// Infer the TypeScript type from the schema for easy use elsewhere
export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ModuleSchemaType = z.infer<typeof moduleSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;
