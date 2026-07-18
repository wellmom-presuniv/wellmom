// SHARED
export type RiskCategory = "low" | "medium" | "high"; // for scoreCutoffs
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH"; // for RefferalMapping


// ASSESSMENT QUESTIONS
// Update 30 Jun 2026: 9 pertanyaan (bukan 8).
// is_red_flag berlaku untuk 4 item (Q5 tidak lagi red-flag).
// Struktur kolom tidak berubah — form tetap generic.

export interface AssessmentQuestion {
    question_id: string;
    question_text: string;
    weight: number;
    is_red_flag: boolean;
    order_index: number;
    is_active: boolean;
    category: string | null;
}
export type CreateAssessmentQuestionPayload = Omit<AssessmentQuestion, "question_id">;
export type UpdateAssessmentQuestionPayload = Partial<CreateAssessmentQuestionPayload>;


// SCORE CUTOFFS
// max_score: 999 pada HIGH = sentinel "tidak ada batas atas"
// Render sebagai "≥5" di UI, jangan tampilkan 999.

export interface ScoreBand {
    min_score: number;
    max_score: number;
}
export interface ScoreCutoffs {
    low: ScoreBand;
    medium: ScoreBand;
    high: ScoreBand;
}

// EDUCATION CONTENT
export type Trimester = 1 | 2 | 3;

export interface EducationContent {
  content_id: string;
  title: string;
  trimester: Trimester | null;   // ← tambah | null (support general content)
  category: string;
  body: string;
  is_published: boolean;         // ← ganti dari: status: EducationStatus
  order_in_category: number;
}
export type CreateEducationContentPayload = Omit<EducationContent, "content_id">;
export type UpdateEducationContentPayload = Partial<CreateEducationContentPayload>;

// CHECKLIST ITEMS
export interface ChecklistItem {
    item_id: string;    // updated from id to item_id
    label: string;
    category: string | null;
    is_active: boolean;
    order_index: number;
}
export type CreateChecklistItemPayload = Omit<ChecklistItem, "item_id">;
export type UpdateChecklistItemPayload = Partial<CreateChecklistItemPayload>;

// REFERRAL MAPPING
export interface ReferralMapping {
    mapping_id: string;
    risk_level: RiskLevel;    // changing from risk_category to risk_level   
    facility_type: string;    // "Puskesmas" | "RSIA" | "RS Umum" | dst     
    recommendation: string;   // deskripsi tindakan
    urgency_label: string;    // "Segera" | "Dalam 24 jam" | "Saat ANC rutin"
    is_active: boolean;
}
export type UpdateReferralMappingPayload = Pick<ReferralMapping,"facility_type" | "recommendation" | "urgency_label">;


// BLOOD PRESSURE THRESHOLDS
// [BLOCKED] — semua nilai null sampai dr. Nucky konfirmasi angka.
// Scoring engine TIDAK AKTIF selama status "pending_confirmation".

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