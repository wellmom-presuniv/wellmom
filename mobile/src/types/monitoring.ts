// Field names di sini mengikuti response asli backend (app/schemas/monitoring.py),
// BUKAN nama field yang ditebak di awal — beda antar endpoint (mis. POST fetal-weight/log
// balikin "weight_grams", tapi GET history balikin "fetal_weight_grams" untuk tipe yang sama).

export interface FetalWeightLogResponse {
  record_id: string;
  date: string;
  weight_grams: number;
  status: "NORMAL" | "BELOW_NORMAL" | "ABOVE_NORMAL" | null;
  message: string | null;
}

export interface HeadCircLogResponse {
  record_id: string;
  date: string;
  head_circumference_cm: number;
  normal_range: string;
  message: string;
  is_evaluated: boolean;
}

export interface FetalLengthLogResponse {
  record_id: string;
  date: string;
  length_cm: number;
}

export type LilaStatus = "NORMAL" | "KEK_RISK";

export interface MaternalLogResponse {
  record_id: string;
  date: string;
  weight_kg: number;
  height_cm: number;
  lila_cm?: number | null;
  lila_status?: LilaStatus | null;
  lila_message?: string | null;
}

export interface GrowthEvaluateResponse {
  record_id: string;
  date: string;
  indicator: "WEIGHT" | "LENGTH" | "HEAD_CIRCUMFERENCE";
  value: number;
  age_months: number;
  sex: "MALE" | "FEMALE";
  z_score: number;
  zone: "NORMAL" | "CONCERN" | "SEVERE";
  reference_month_used: number;
}

export type MonitoringHistoryType = "FETAL_WEIGHT" | "FETAL_LENGTH" | "HEAD_CIRC" | "MATERNAL" | "GROWTH";

// Persis app/schemas/monitoring.py::MonitoringHistoryItem — satu shape gabungan
// untuk semua tipe, field yang gak relevan buat tipe tsb bakal null.
export interface MonitoringHistoryEntry {
  record_id: string;
  date: string;
  type: MonitoringHistoryType;

  fetal_weight_grams?: number | null;
  head_circumference_cm?: number | null;
  fetal_length_cm?: number | null;

  maternal_weight_kg?: number | null;
  maternal_height_cm?: number | null;
  maternal_lila_cm?: number | null;
  lila_status?: LilaStatus | null;

  indicator?: "WEIGHT" | "LENGTH" | "HEAD_CIRCUMFERENCE" | null;
  value?: number | null;
  age_months?: number | null;
  sex?: "MALE" | "FEMALE" | null;

  status?: "NORMAL" | "BELOW_NORMAL" | "ABOVE_NORMAL" | null;
  zone?: "NORMAL" | "CONCERN" | "SEVERE" | null;
  message?: string | null;
  z_score?: number | null;
  reference_month_used?: number | null;
}
