import { apiClient } from "@/lib/axios";
import type {
  ReferralMapping,
  CreateReferralMappingPayload,
  UpdateReferralMappingPayload,
} from "@/types";

export const referralMappingApi = {
  getAll: async (): Promise<ReferralMapping[]> => {
    const response = await apiClient.get("/api/v1/admin/referral-mapping");
    return response.data;
  },

  create: async (
    payload: CreateReferralMappingPayload
  ): Promise<ReferralMapping> => {
    const response = await apiClient.post(
      "/api/v1/admin/referral-mapping",
      payload
    );
    return response.data;
  },

  update: async (
    id: string,
    payload: UpdateReferralMappingPayload
  ): Promise<ReferralMapping> => {
    const response = await apiClient.put(
      `/api/v1/admin/referral-mapping/${id}`,
      payload
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/admin/referral-mapping/${id}`);
  },
};