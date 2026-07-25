export interface FetalWeightLogResponse {
  status: "NORMAL" | "BELOW_NORMAL" | "ABOVE_NORMAL";
  message: string;
}

export interface HeadCircLogResponse {
  id: string;
  measurement_date: string;
  head_circumference_cm: number;
}

export interface MaternalLogResponse {
  id: string;
  measurement_date: string;
  weight_kg: number;
  height_cm: number;
}

export interface GrowthEvaluateResponse {
  z_score: number;
  zone: "NORMAL" | "CONCERN" | "SEVERE";
  reference_month_used: number;
}

export type MonitoringHistoryType = "FETAL_WEIGHT" | "HEAD_CIRC" | "MATERNAL" | "GROWTH";

export interface MonitoringHistoryEntry {
  id: string;
  measurement_date: string;
  // fetal weight
  weight_grams?: number;
  status?: "NORMAL" | "BELOW_NORMAL" | "ABOVE_NORMAL";
  message?: string;
  // head circ
  head_circumference_cm?: number;
  // maternal
  weight_kg?: number;
  height_cm?: number;
  // growth
  indicator?: "WEIGHT" | "LENGTH" | "HEAD_CIRCUMFERENCE";
  value?: number;
  age_months?: number;
  sex?: "MALE" | "FEMALE";
  z_score?: number;
  zone?: "NORMAL" | "CONCERN" | "SEVERE";
  reference_month_used?: number;
}
