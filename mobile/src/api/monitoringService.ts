import apiClient from "./client";
import {
  FetalWeightLogResponse,
  HeadCircLogResponse,
  MaternalLogResponse,
  GrowthEvaluateResponse,
  MonitoringHistoryEntry,
  MonitoringHistoryType,
} from "../types/monitoring";

export async function logFetalWeight(weightGrams: number): Promise<FetalWeightLogResponse> {
  const { data } = await apiClient.post<FetalWeightLogResponse>("/monitoring/fetal-weight/log", {
    weight_grams: weightGrams,
  });
  return data;
}

export async function logHeadCircumference(headCircumferenceCm: number): Promise<HeadCircLogResponse> {
  const { data } = await apiClient.post<HeadCircLogResponse>("/monitoring/head-circumference/log", {
    head_circumference_cm: headCircumferenceCm,
  });
  return data;
}

export async function logMaternal(weightKg: number, heightCm: number): Promise<MaternalLogResponse> {
  const { data } = await apiClient.post<MaternalLogResponse>("/monitoring/maternal/log", {
    weight_kg: weightKg,
    height_cm: heightCm,
  });
  return data;
}

export async function evaluateGrowth(payload: {
  indicator: "WEIGHT" | "LENGTH" | "HEAD_CIRCUMFERENCE";
  value: number;
  age_months: number;
  sex: "MALE" | "FEMALE";
}): Promise<GrowthEvaluateResponse> {
  const { data } = await apiClient.post<GrowthEvaluateResponse>("/monitoring/growth/evaluate", payload);
  return data;
}

export async function getMonitoringHistory(type: MonitoringHistoryType): Promise<MonitoringHistoryEntry[]> {
  const { data } = await apiClient.get<MonitoringHistoryEntry[]>("/monitoring/history", {
    params: { type },
  });
  return data;
}
