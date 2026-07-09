import { apiClient } from "@/lib/axios";
import type {
  EducationContent,
  CreateEducationContentPayload,
  UpdateEducationContentPayload,
} from "@/types";

export const educationApi = {
  // get all education content
  getAll: async (): Promise<EducationContent[]> => {
    const response = await apiClient.get("/api/admin/education-content");
    return response.data;
  },
  // create education content
  create: async (
    payload: CreateEducationContentPayload
  ): Promise<EducationContent> => {
    const response = await apiClient.post(
      "/api/admin/education-content",
      payload
    );
    return response.data;
  },
  // update education content
  update: async (
    content_id: string,
    payload: UpdateEducationContentPayload
  ): Promise<EducationContent> => {
    const response = await apiClient.put(
      `/api/admin/education-content/${content_id}`,
      payload
    );
    return response.data;
  },
  // delete education content
  delete: async (content_id: string): Promise<void> => {
    await apiClient.delete(`/api/admin/education-content/${content_id}`);
  },
};