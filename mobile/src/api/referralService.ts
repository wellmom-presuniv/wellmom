import apiClient from "./client";
import { ReferralResponse } from "../types/referral";

export async function getReferral(riskLevel: "MEDIUM" | "HIGH"): Promise<ReferralResponse> {
  const { data } = await apiClient.get<ReferralResponse>(`/referral/${riskLevel}`);
  return data;
}
