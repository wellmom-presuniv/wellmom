// src/api/profileService.ts
import apiClient from "./client";
import { ProfileSubmitPayload, PregnancyProfile } from "../types";

export async function submitProfile(payload: ProfileSubmitPayload): Promise<PregnancyProfile> {
  const { data } = await apiClient.post<PregnancyProfile>("/profile", payload);
  return data;
}

export async function getMyProfile(): Promise<PregnancyProfile> {
  const { data } = await apiClient.get<PregnancyProfile>("/profile/me");
  return data;
}