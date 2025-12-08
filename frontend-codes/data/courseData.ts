import type { CourseData, Lecture } from '@/types/course';

// Enhanced course data with comprehensive content
const allLectures: Lecture[] = [
  // Section 1: Introduction & Getting Started
  {
    id: "1",
    title: "Course Introduction & Welcome",
    duration: 180,
    position: 1,
    type: 'video' as const,
    completed: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    description: "Welcome to the complete web development course! Learn what you'll build, the skills you'll gain, and how to get the most out of this course.",
    attachments: [
      {
        id: "1",
        title: "Course Syllabus & Learning Path",
        type: 'document',
        description: "Complete course outline, learning objectives, and recommended study schedule.",
        url: "/attachments/course-syllabus.pdf",
        fileSize: "2.4 MB"
      },
      {
        id: "2",
        title: "Pre-Course Knowledge Check",
        type: 'quiz',
        description: "Quick assessment to gauge your current knowledge level.",
        url: "/quiz/pre-course-check"
      }
    ]
  },
  {
    id: "2",
    title: "Setting Up Your Development Environment",
    duration: 420,
    position: 2,
    type: 'video' as const,
    completed: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    description: "Step-by-step guide to installing and configuring VS Code, browser dev tools, and essential extensions for web development.",
    attachments: [
      {
        id: "3",
        title: "Development Tools Installation Guide",
        type: 'document',
        description: "Detailed instructions for setting up your coding environment across different operating systems.",
        url: "/attachments/dev-tools-guide.pdf",
        fileSize: "1.8 MB"
      }
    ]
  },
  {
    id: "3",
    title: "Course Resources & Community",
    duration: 0,
    position: 3,
    type: 'resource' as const,
    completed: true,
    description: "Access exclusive course materials, join our community forum, and discover additional learning resources.",
    attachments: [
      {
        id: "4",
        title: "Resource Library Access",
        type: 'document',
        description: "Links to code repositories, design assets, and supplementary materials.",
        url: "/attachments/resource-library.pdf",
        fileSize: "0.5 MB"
      }
    ]
  },
  {
    id: "4",
    title: "Knowledge Check: Course Basics",
    duration: 0,
    position: 4,
    type: 'quiz' as const,
    completed: false,
    description: "Test your understanding of the course structure and development environment setup."
  },
  // Section 2: HTML Fundamentals & Semantic Web
  {
    id: "5",
    title: "HTML Basics & Document Structure",
    duration: 660,
    position: 5,
    type: 'video' as const,
    completed: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    description: "Learn the fundamental building blocks of HTML, document structure, and how browsers interpret HTML code.",
    attachments: [
      {
        id: "5",
        title: "HTML Element Reference Guide",
        type: 'document',
        description: "Comprehensive reference of HTML elements with examples and use cases.",
        url: "/attachments/html-reference.pdf",
        fileSize: "3.2 MB"
      },
      {
        id: "6",
        title: "HTML Structure Quiz",
        type: 'quiz',
        description: "Test your knowledge of HTML document structure and basic elements.",
        url: "/quiz/html-structure"
      }
    ]
  },
  {
    id: "6",
    title: "Semantic HTML & Accessibility",
    duration: 540,
    position: 6,
    type: 'video' as const,
    completed: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    description: "Discover the importance of semantic HTML for accessibility, SEO, and code maintainability.",
    attachments: [
      {
        id: "7",
        title: "Accessibility Checklist",
        type: 'document',
        description: "Essential accessibility guidelines and best practices for web developers.",
        url: "/attachments/accessibility-checklist.pdf",
        fileSize: "1.5 MB"
      }
    ]
  },
  {
    id: "7",
    title: "Forms & User Input Elements",
    duration: 780,
    position: 7,
    type: 'video' as const,
    completed: false,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    description: "Master HTML forms, input types, validation, and creating user-friendly interfaces.",
    attachments: [
      {
        id: "8",
        title: "Form Elements Cheat Sheet",
        type: 'document',
        description: "Quick reference for all HTML form elements and their attributes.",
        url: "/attachments/form-elements-cheat-sheet.pdf",
        fileSize: "2.1 MB"
      }
    ]
  },
  {
    id: "8",
    title: "HTML5 Advanced Features",
    duration: 620,
    position: 8,
    type: 'video' as const,
    completed: false,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    description: "Explore modern HTML5 features including multimedia elements, canvas, and web APIs.",
    attachments: [
      {
        id: "9",
        title: "HTML5 Feature Support Chart",
        type: 'document',
        description: "Browser compatibility chart for HTML5 features and fallback strategies.",
        url: "/attachments/html5-support-chart.pdf",
        fileSize: "0.8 MB"
      }
    ]
  },
  {
    id: "9",
    title: "Build Your First Website Project",
    duration: 0,
    position: 9,
    type: 'resource' as const,
    completed: false,
    description: "Apply your HTML knowledge to create a complete personal portfolio website.",
    attachments: [
      {
        id: "10",
        title: "Project Requirements & Assets",
        type: 'document',
        description: "Detailed project specifications, starter files, and design mockups.",
        url: "/attachments/project-requirements.zip",
        fileSize: "5.3 MB"
      }
    ]
  },
  {
    id: "10",
    title: "HTML Mastery Assessment",
    duration: 0,
    position: 10,
    type: 'quiz' as const,
    completed: false,
    description: "Comprehensive quiz covering all HTML concepts learned in this section."
  },
  // Section 3: CSS Mastery
  { id: "11", title: "CSS Introduction", duration: 480, position: 11, type: 'video' as const, completed: false, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4' },
  { id: "12", title: "CSS Selectors", duration: 720, position: 12, type: 'video' as const, completed: false, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' },
  { id: "13", title: "CSS Box Model", duration: 600, position: 13, type: 'video' as const, completed: false, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4' },
  { id: "14", title: "Flexbox Layout", duration: 900, position: 14, type: 'video' as const, completed: false, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
  { id: "15", title: "CSS Grid System", duration: 840, position: 15, type: 'video' as const, completed: false, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4' },
  { id: "16", title: "CSS Animations", duration: 620, position: 16, type: 'video' as const, completed: false, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4' },
  { id: "17", title: "Responsive Design", duration: 780, position: 17, type: 'video' as const, completed: false, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  { id: "18", title: "CSS Resources", duration: 0, position: 18, type: 'resource' as const, completed: false },
  // Section 4: JavaScript Fundamentals
  { id: "19", title: "JavaScript Variables", duration: 520, position: 19, type: 'video' as const, completed: false, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
  { id: "20", title: "Functions and Scope", duration: 680, position: 20, type: 'video' as const, completed: false, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
  { id: "21", title: "DOM Manipulation", duration: 750, position: 21, type: 'video' as const, completed: false, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
  { id: "22", title: "Event Handling", duration: 640, position: 22, type: 'video' as const, completed: false, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
  { id: "23", title: "Async JavaScript", duration: 890, position: 23, type: 'video' as const, completed: false, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
  { id: "24", title: "JavaScript Project", duration: 0, position: 24, type: 'resource' as const, completed: false },
  { id: "25", title: "JavaScript Assessment", duration: 0, position: 25, type: 'quiz' as const, completed: false },
  // Section 5: Advanced Topics
  { id: "26", title: "API Integration", duration: 720, position: 26, type: 'video' as const, completed: false, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4' },
  { id: "27", title: "Database Basics", duration: 850, position: 27, type: 'video' as const, completed: false, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' },
  { id: "28", title: "Final Project", duration: 0, position: 28, type: 'resource' as const, completed: false },
];

export const courseData: CourseData = {
  id: "1",
  title: "The Complete Web Developer: Zero to Mastery",
  instructor: "Andrei Neagoie",
  instructorId: "instructor-1",
  description: "Master modern web development from HTML basics to advanced JavaScript. Build real-world projects, learn industry best practices, and become job-ready with this comprehensive course designed for beginners and intermediate developers.",
  shortDescription: "Master modern web development from HTML to JavaScript",
  price: 0,
  duration: 40,
  level: "Beginner",
  category: "Web Development",
  image: "/placeholder.svg?height=400&width=600",
  slug: "complete-web-developer-zero-to-mastery",
  status: "Published",
  totalLectures: 28,
  completedLectures: 5,
  lectures: allLectures,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  sections: [
    {
      id: "1",
      title: "Introduction & Getting Started",
      position: 1,
      lectures: allLectures.slice(0, 4) // lectures 1-4
    },
    {
      id: "2",
      title: "HTML Fundamentals & Semantic Web",
      position: 2,
      lectures: allLectures.slice(4, 10) // lectures 5-10
    },
    {
      id: "3",
      title: "CSS Mastery",
      position: 3,
      lectures: allLectures.slice(10, 18) // lectures 11-18
    },
    {
      id: "4",
      title: "JavaScript Fundamentals",
      position: 4,
      lectures: allLectures.slice(18, 25) // lectures 19-25
    },
    {
      id: "5",
      title: "Advanced Topics",
      position: 5,
      lectures: allLectures.slice(25, 28) // lectures 26-28
    }
  ]
};