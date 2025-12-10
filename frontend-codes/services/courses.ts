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

export const CoursesService = {
  async getBySlug(slug: string): Promise<CourseSummary> {
    return await apiClient.get<CourseSummary>(`/api/courses/${slug}/`);
  },

  async getById(id: string): Promise<CourseSummary> {
    // Prefer dedicated endpoint, fallback to list filter if not available
    return await apiClient.get<CourseSummary>(`/api/courses/${id}/`);
  },

  async getFeaturedCourses(): Promise<CourseListItem[]> {
    return await apiClient.get<CourseListItem[]>('/api/courses/featured/');
  },

  async getBestSellingCourses(limit: number = 8): Promise<CourseListItem[]> {
    // Best selling = highest enrollments
    return await apiClient.get<CourseListItem[]>(`/api/courses/?ordering=-total_enrollments&limit=${limit}`);
  },

  async getRecentlyAddedCourses(limit: number = 8): Promise<CourseListItem[]> {
    // Recently added = newest courses
    return await apiClient.get<CourseListItem[]>(`/api/courses/?ordering=-created_at&limit=${limit}`);
  },
};

export default CoursesService;
