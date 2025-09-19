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

export const CoursesService = {
  async getBySlug(slug: string): Promise<CourseSummary> {
    return await apiClient.get<CourseSummary>(`/api/courses/${slug}/`);
  },

  async getById(id: string): Promise<CourseSummary> {
    // Prefer dedicated endpoint, fallback to list filter if not available
    return await apiClient.get<CourseSummary>(`/api/courses/${id}/`);
  },
};

export default CoursesService;
