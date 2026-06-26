// ===== Self-Assessment — berdasarkan dokumen Scoring Engine Design (Arizal, 26 Jun 2026) =====
// NOTE: struktur ini masih bisa berubah sesuai revisi yang diminta (red-flag list, BP status).
// Update file ini begitu Arizal+Alek finalisasi.

export interface AssessmentQuestion {
  id: string;
  text: string;
  weight: number;
  isRedFlag: boolean;
  isActive: boolean;
  trimesterSpecific: number | null; // null = berlaku semua trimester
}

export interface AssessmentAnswer {
  questionId: string;
  answer: boolean;
}

export interface AssessmentSubmitPayload {
  answers: AssessmentAnswer[];
  systolicBp: number | null;
  diastolicBp: number | null;
}

export type RiskCategory = "LOW" | "MEDIUM" | "HIGH";
export type BpAssessmentStatus = "PENDING_THRESHOLD" | "NORMAL" | "FLAGGED" | "NOT_PROVIDED";

export interface AssessmentResult {
  riskCategory: RiskCategory;
  redFlagTriggered: boolean;
  totalScore: number | null;
  bpAssessmentStatus: BpAssessmentStatus;
  // TODO: tambahkan field ini begitu revisi red-flag granularity disepakati Arizal+Alek,
  // misal: triggeredRedFlags: { questionId: string; text: string }[]
}

// ===== Profil & Onboarding =====
export interface PregnancyProfile {
  trimester: 1 | 2 | 3;
  gestationalWeek: number;
  estimatedDueDate: string; // ISO date
}

// ===== Edukasi =====
export interface EducationContent {
  id: string;
  category: string;
  trimester: number | null;
  title: string;
  body: string;
}

// ===== Checklist Harian =====
export interface ChecklistItem {
  id: string;
  label: string;
}

export interface ChecklistLogEntry {
  itemId: string;
  date: string; // ISO date
  isDone: boolean;
}
