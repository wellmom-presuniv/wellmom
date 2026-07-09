import { apiClient } from "@/lib/axios";
import type {
  EducationContent,
  CreateEducationContentPayload,
  UpdateEducationContentPayload,
} from "@/types";

export const educationApi = {
  getAll: async (): Promise<EducationContent[]> => {
    const response = await apiClient.get("/api/v1/admin/education-content");
    return response.data;
  },

  create: async (
    payload: CreateEducationContentPayload
  ): Promise<EducationContent> => {
    const response = await apiClient.post(
      "/api/v1/admin/education-content",
      payload
    );
    return response.data;
  },

  update: async (
    content_id: string,
    payload: UpdateEducationContentPayload
  ): Promise<EducationContent> => {
    const response = await apiClient.put(
      `/api/v1/admin/education-content/${content_id}`,
      payload
    );
    return response.data;
  },

  delete: async (content_id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/admin/education-content/${content_id}`);
  },
};