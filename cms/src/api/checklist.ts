import { apiClient } from "@/lib/axios";
import type {
  ChecklistItem,
  CreateChecklistItemPayload,
  UpdateChecklistItemPayload,
} from "@/types";

export const checklistApi = {
  getAll: async (): Promise<ChecklistItem[]> => {
    const response = await apiClient.get("/api/v1/admin/checklist-items");
    return response.data;
  },

  create: async (
    payload: CreateChecklistItemPayload
  ): Promise<ChecklistItem> => {
    const response = await apiClient.post(
      "/api/v1/admin/checklist-items",
      payload
    );
    return response.data;
  },

  update: async (
    item_id: string,
    payload: UpdateChecklistItemPayload
  ): Promise<ChecklistItem> => {
    const response = await apiClient.put(
      `/api/v1/admin/checklist-items/${item_id}`,
      payload
    );
    return response.data;
  },

  delete: async (item_id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/admin/checklist-items/${item_id}`);
  },
};