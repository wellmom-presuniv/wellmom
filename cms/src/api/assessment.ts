import { apiClient } from "@/lib/axios";
import type {
  AssessmentQuestion,
  CreateAssessmentQuestionPayload,
  UpdateAssessmentQuestionPayload,
} from "@/types";

export const assessmentApi = {
  getAll: async (): Promise<AssessmentQuestion[]> => {
    const response = await apiClient.get(
      "/api/v1/admin/assessment-questions"
    );
    return response.data;
  },

  create: async (
    payload: CreateAssessmentQuestionPayload
  ): Promise<AssessmentQuestion> => {
    const response = await apiClient.post(
      "/api/v1/admin/assessment-questions",
      payload
    );
    return response.data;
  },

  update: async (
    id: string,
    payload: UpdateAssessmentQuestionPayload
  ): Promise<AssessmentQuestion> => {
    const response = await apiClient.put(
      `/api/v1/admin/assessment-questions/${id}`,
      payload
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/admin/assessment-questions/${id}`);
  },
};