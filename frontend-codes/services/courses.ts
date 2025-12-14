import apiClient from "@/lib/api-client";

export interface CourseSummary {
  id: string;
  title: string;
  slug?: string;
  thumbnail?: string;
  current_price: number;
  is_free: boolean;
  instructor?: { name?: string };
}

export interface CourseListItem {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  current_price: number;
  original_price?: number;
  is_free: boolean;
  instructor?: {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  difficulty?: string;
  average_rating: number;
  total_reviews: number;
  total_enrollments: number;
  short_description?: string;
  created_at: string;
}

interface ApiCourse {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  price: number;
  instructor: string;
  instructorId: string;
  category: string;
  rating: number;
  students: number;
  createdAt: string;
  shortDescription?: string;
}

function mapApiCourseToListItem(course: ApiCourse): CourseListItem {
  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    thumbnail: course.thumbnail,
    current_price: course.price,
    original_price: course.price, // No discount logic yet
    is_free: course.price === 0,
    instructor: {
      id: course.instructorId,
      first_name: course.instructor.split(' ')[0] || course.instructor,
      last_name: course.instructor.split(' ').slice(1).join(' ') || '',
      full_name: course.instructor,
    },
    category: {
      id: course.category, // using name as ID for now
      name: course.category,
      slug: course.category.toLowerCase().replace(/\s+/g, '-'),
    },
    difficulty: 'Beginner', // Default or fetch if available
    average_rating: course.rating,
    total_reviews: 0, // Not in API yet
    total_enrollments: course.students,
    short_description: course.shortDescription || '',
    created_at: course.createdAt,
  };
}

export const CoursesService = {
  async getBySlug(slug: string): Promise<CourseSummary> {
    const response = await fetch(`/api/courses/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch course');
    // Note: getBySlug returns CourseSummary which is different from CourseListItem
    // We might need to map this too if CourseSummary structure differs from API
    return response.json();
  },

  async getById(id: string): Promise<CourseSummary> {
    const response = await fetch(`/api/courses/${id}`);
    if (!response.ok) throw new Error('Failed to fetch course');
    return response.json();
  },

  async getFeaturedCourses(): Promise<CourseListItem[]> {
    const response = await fetch('/api/courses/featured');
    if (!response.ok) throw new Error('Failed to fetch featured courses');
    const data = await response.json();
    return (data.courses as ApiCourse[]).map(mapApiCourseToListItem);
  },

  async getBestSellingCourses(limit: number = 8): Promise<CourseListItem[]> {
    const response = await fetch(`/api/courses?ordering=-total_enrollments&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch best selling courses');
    const data = await response.json();
    return (data.courses as ApiCourse[]).map(mapApiCourseToListItem);
  },

  async getRecentlyAddedCourses(limit: number = 8): Promise<CourseListItem[]> {
    const response = await fetch(`/api/courses?ordering=-created_at&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch recently added courses');
    const data = await response.json();
    return (data.courses as ApiCourse[]).map(mapApiCourseToListItem);
  },
};

export default CoursesService;
