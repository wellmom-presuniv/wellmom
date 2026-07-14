import { apiClient } from "@/lib/axios";
import type {
  ReferralMapping,
  UpdateReferralMappingPayload,
  RiskLevel,
} from "@/types";

export const referralMappingApi = {
  getAll: async (): Promise<ReferralMapping[]> => {
    const response = await apiClient.get("/api/v1/admin/referral-mapping");
    return response.data;
  },

  update: async (
    risk_level: RiskLevel,
    payload: UpdateReferralMappingPayload
  ): Promise<ReferralMapping> => {
    const response = await apiClient.put(
      `/api/v1/admin/referral-mapping/${risk_level}`,
      payload
    );
    return response.data;
  },
};