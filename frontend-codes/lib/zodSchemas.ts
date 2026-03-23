import { z } from "zod";
import { ActivityVisibility, 
         ActivityDifficulty ,
         ActivityStatus,
} from "@prisma/client";

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

export const ActivityTypeEnum = z.enum([
  "Project",
  "Task",
  "Capstone",
  "Case_Study",
  "Client_Simulation",
  "Challenge",
  "Hackathon",
  "Datathon",
  "Team_Project",
  "Open_Source_Contribution",
  "Event_Hosting",
  "Event_Participation",
  "Study_Group_Leadership",
  "Mentorship",
  "Peer_Review",
  "Community_Contribution",
  "Tutorial_Creation",
  "Content_Translation",
  "Research",
  "Article_Publication",
]);

export const ActivityVisibilityEnum = z.nativeEnum(ActivityVisibility);
export const ActivityDifficultyEnum = z.nativeEnum(ActivityDifficulty);
export const ActivityStatusEnum = z.nativeEnum(ActivityStatus);

export const ActivityRequirementEnum = z.enum([
  "File_Upload",
  "GitHub_Repo",
  "Video_Link",
  "Text_Report",
  "Peer_Reviews",
  "Host_An_Online_Event",
  "Event_Attendance",
  "Live_Demo",
]);

export const SubmissionStatusEnum = z.enum([
  "Draft",
  "Submitted",
  "Under_Review",
  "Revision_Required",
  "Approved",
  "Rejected",
]);

export const ReviewTypeEnum = z.enum([
  "Peer",
  "Instructor",
  "Mentor",
]);

export const ParticipantRoleEnum = z.enum([
  "Participant",
  "Reviewer",
  "Mentor",
  "Organizer"
]);

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


// ----- Program Schema -----
export const createProgramSchema = z.object({
  title: z.string()
    .min(5, "Program title must be at least 5 characters."),
  shortdescription: z.string()
    .min(10, "Program short description must be at least 10 characters.")
    .max(150, "Program short description cannot exceed 150 characters."),
  description: z.string()
    .min(100, "Program description must be at least 100 characters.")
    .max(2500, "Program description cannot exceed 2500 characters."),
  fileKey: z.string()
    .min(1, "A program image or primary media file key is required."),
  slug: z.string()
    .min(3, "Slug must be at least 3 characters.")
});

// Update program schema
export const updateProgramSchema = createProgramSchema.partial();

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


// ---- Activity Schema ----
const baseActivityObject = z.object({
  title: z.string().min(5).max(150),
  description: z.string().min(10).max(2500),
  type: ActivityTypeEnum,
  visibility: ActivityVisibilityEnum.default("Public"),
  difficulty: ActivityDifficultyEnum.default("Intermediate"),
  points: z.number().int().min(0).max(10000).default(0),
  isMandatory: z.boolean().default(false),
  startDate: z.coerce.date().optional(),
  deadline: z.coerce.date().optional(),
  courseId: z.string().uuid().optional(),
  programId: z.string().uuid().optional(),
  creatorId: z.string(),
});

export const createActivitySchema = baseActivityObject.superRefine((data, ctx) => {
  if (data.startDate && data.deadline && data.deadline < data.startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Deadline cannot be before start date",
      path: ["deadline"],
    });
  }
});


// We validate based on type. For example, if it's a "Project", we might require a GitHub repo link or file upload. If it's an "Event Participation", we might require an event ID or proof of attendance. This way we can ensure the right data is collected for each activity type.
const baseRequirementSchema = z.object({
  type: ActivityRequirementEnum,
  config: z.record(z.any()).optional(),
});

// Submission schema
export const submissionSchema = z.object({
  activityId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  teamId: z.string().uuid().optional(),
  participationId: z.string().uuid().optional(),
  content: z.record(z.any()),
  status: SubmissionStatusEnum.default("Draft"),
})
.superRefine((data, ctx) => {
  // Rule: Must belong to ONE owner
  if (!data.userId && !data.teamId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Submission must belong to a user or a team",
    });
  }
  if (data.userId && data.teamId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Submission cannot belong to both a user and a team. Please choose one.",
    });
  }
});

// Review schema
export const reviewSchema = z.object({
  submissionId: z.string().uuid(),
  reviewerId: z.string().uuid(),
  type: ReviewTypeEnum.default("Peer"),
  score: z.number().min(0).max(100).optional(),
  feedback: z.string().max(5000).optional(),
  rubricScores: z.record(z.number()).optional(),
})
.superRefine((data, ctx) => {
  if (data.score === undefined && data.rubricScores === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Review must include a score or rubric scores",
    });
  }
});

// Reviewer assignment schema
export const reviewAssignmentSchema = z.object({
  submissionId: z.string().uuid(),
  reviewerId: z.string().uuid(),
  expiresAt: z.coerce.date().optional(),
});

// Team Schema
export const teamSchema = z.object({
  name: z
    .string()
    .min(3, "Team name must be at least 3 characters.")
    .max(60, "Team name cannot exceed 60 characters."),
  description: z.string().optional(),
  activityId: z.string().uuid(),
});

// Participation Schema
export const participationSchema = z.object({
  userId: z.string().uuid(),
  activityId: z.string().uuid(),
  teamId: z.string().uuid().optional(),
  role: ParticipantRoleEnum.default("Participant"),
});

//--- Activity Builder Step Schemas ---
// For the activity builder, we can have separate schemas for each step. For example, Step 1 might be basic info, Step 2 might be requirements, Step 3 might be review and publish settings. This way we can validate each step independently and provide better feedback to the user.

// Step 1: Overview
export const activityOverviewSchema = baseActivityObject.pick({
  title: true,
  description: true,
  type: true,
  difficulty: true,
  points: true,
  startDate: true,
  deadline: true,
  courseId: true,
  programId: true,
}).superRefine((data, ctx) => {
    // We have to put the date logic here too because .pick() dropped the old superRefine
    if (data.startDate && data.deadline && data.deadline < data.startDate) {
       ctx.addIssue({
         code: z.ZodIssueCode.custom,
         message: "Deadline cannot be before start date",
         path: ["deadline"],
       });
    }
  });

// Step 2: Requirements
export const activityRequirementSchema = z.object({
  type: ActivityRequirementEnum,

  config: z.object({
    label: z.string().min(1), // e.g. "GitHub Repository"
    description: z.string()
      .min(10, "Requirement description must be at least 10 characters.")
      .max(150, "Requirement description cannot exceed 150 characters."),
    required: z.boolean().default(true),
  }).optional(),
});

// Step 3: Review & Publish
export const submissionConfigSchema = z.object({
  fields: z.array(
    z.object({
      name: z.string(),
      type: z.enum(["text", "file", "url", "video"]),
      required: z.boolean().default(true),
    })
  ).min(1),
});

// Step 4: Rubric (if using rubric-based grading)
export const rubricSchema = z.array(
  z.object({
    title: z.string(),
    description: z.string().optional(),
    weight: z.number().min(0).max(100),
    maxScore: z.number().min(1),
  })
).min(1)
.superRefine((criteria, ctx) => {
  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  if (totalWeight !== 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Rubric weights must sum to 100",
    });
  }
});

// Step 5: KSB Mapping
export const activityKSBMappingSchema = z.array(
  z.object({
    ksbId: z.string().uuid(),
    weight: z.number().min(0).max(1).default(1),
  })
).min(1);



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
  // Allow empty strings for form compatibility when optional
  url: z.string().url({ message: "URL must be valid" }).optional().or(z.literal("")),
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
    if (data.enddate <= data.startdate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
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
export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type ActivityRequirementInput = z.infer<typeof activityRequirementSchema>;
export type RubricInput = z.infer<typeof rubricSchema>;
export type ActivityKSBMappingInput = z.infer<typeof activityKSBMappingSchema>;
export type SubmissionInput = z.infer<typeof submissionSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ReviewAssignmentInput = z.infer<typeof reviewAssignmentSchema>;
export type TeamInput = z.infer<typeof teamSchema>;
export type ParticipationInput = z.infer<typeof participationSchema>;
export type EventInput = z.infer<typeof CreateEventSchema>;
export type EventUpdateInput = z.infer<typeof UpdateEventSchema>;
export type EventOutput = z.infer<typeof EventSchema>;
