// ============================================================
// SHARED
// ============================================================
export type RiskCategory = "low" | "medium" | "high";

// ============================================================
// ASSESSMENT QUESTIONS
// ============================================================
export interface AssessmentQuestion {
    id: string;
    question_text: string;
    weight: number;
    is_red_flag: boolean;
    order_index: number;
    is_active: boolean;
    category: string | null;
}
export type CreateAssessmentQuestionPayload = Omit<AssessmentQuestion, "id">;
export type UpdateAssessmentQuestionPayload = Partial<CreateAssessmentQuestionPayload>;

// ============================================================
// SCORE CUTOFFS
// max_score: 999 pada HIGH = sentinel "tidak ada batas atas"
// Render sebagai "≥5" di UI, jangan tampilkan 999.
// ============================================================
export interface ScoreBand {
    min_score: number;
    max_score: number;
}
export interface ScoreCutoffs {
    low: ScoreBand;
    medium: ScoreBand;
    high: ScoreBand;
}

// ============================================================
// EDUCATION CONTENT
// status adalah string literal, BUKAN boolean.
// ============================================================
export type EducationStatus = "published" | "draft";
export type Trimester = 1 | 2 | 3;

export interface EducationContent {
    id: string;
    title: string;
    trimester: Trimester;
    category: string;
    body: string;
    status: EducationStatus;
    order_in_category: number;
}
export type CreateEducationContentPayload = Omit<EducationContent, "id">;
export type UpdateEducationContentPayload = Partial<CreateEducationContentPayload>;

// ============================================================
// CHECKLIST ITEMS
// ============================================================
export interface ChecklistItem {
    id: string;
    label: string;
    category: string | null;
    is_active: boolean;
    order_index: number;
}
export type CreateChecklistItemPayload = Omit<ChecklistItem, "id">;
export type UpdateChecklistItemPayload = Partial<CreateChecklistItemPayload>;

// ============================================================
// REFERRAL MAPPING
// ============================================================
export interface ReferralMapping {
    id: string;
    risk_category: RiskCategory;
    facility_type: string;    // "Puskesmas" | "RSIA" | "RS Umum" | dst
    recommendation: string;   // deskripsi tindakan
    urgency_label: string;    // "Segera" | "Dalam 24 jam" | "Saat ANC rutin"
    is_active: boolean;
}
export type CreateReferralMappingPayload = Omit<ReferralMapping, "id">;
export type UpdateReferralMappingPayload = Partial<CreateReferralMappingPayload>;

// ============================================================
// BLOOD PRESSURE THRESHOLDS
// [BLOCKED] — semua nilai null sampai dr. Nucky konfirmasi angka.
// Scoring engine TIDAK AKTIF selama status "pending_confirmation".
// ============================================================
export type BPThresholdStatus = "pending_confirmation" | "confirmed";

export interface BloodPressureThresholds {
    systolic_warning: number | null;  // contoh: 140 mmHg
    systolic_danger: number | null;  // contoh: 160 mmHg
    diastolic_warning: number | null;  // contoh: 90 mmHg
    diastolic_danger: number | null;  // contoh: 110 mmHg
    status: BPThresholdStatus;
    confirmed_by: string | null;       // nama dokter, null jika belum
    confirmed_at: string | null;       // ISO timestamp, null jika belum
}