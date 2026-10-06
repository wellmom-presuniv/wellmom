// ============================================================
// CONFIRMED — sudah dicocokkan ke kode asli backend (migration, model, engine.py)
// ============================================================

// ===== Self-Assessment =====
export interface AssessmentQuestion {
  question_id: string;        
  question_text: string;
  order_index: number;
  is_red_flag: boolean;
  weight: number;
  is_active: boolean;
}

export interface AssessmentAnswer {
  question_id: string;
  answer: boolean;
}

// Kode riwayat penyakit (Q11, tidak diskor) — harus sama dengan MedicalHistoryCode di backend.
export type MedicalHistoryCode =
  | "HYPERTENSION"
  | "DIABETES"
  | "KIDNEY_DISEASE"
  | "HEART_DISEASE"
  | "AUTOIMMUNE"
  | "CLOTTING_DISORDER"
  | "SEVERE_ANEMIA"
  | "NONE";

export interface AssessmentSubmitPayload {
  answers: AssessmentAnswer[];
  systolic_bp: number | null;
  diastolic_bp: number | null;
  medical_history: MedicalHistoryCode[];
  // pregnancy_profile_id TIDAK perlu dikirim — backend resolve otomatis dari JWT, sama kayak user_id.
}

export type RiskCategory = "LOW" | "MEDIUM" | "HIGH";
export type BpAssessmentStatus = "NOT_PROVIDED" | "PENDING_THRESHOLD" | "NORMAL" | "FLAGGED";
export type BpCategory = "NORMAL" | "ELEVATED" | "STAGE_1" | "STAGE_2" | "CRISIS"; // ← tambah ini

export interface TriggeredRedFlag {
  question_id: string;
  question_text: string;
}

export interface RiskThreshold {
  min_score: number;
  max_score: number;
  category: RiskCategory;
}

export interface DurationTriggeredSymptom {
  symptom: string;
  days_active: number;
  status: string;
}

export interface AssessmentResult {
  response_id: string;                    
  date: string;                           
  risk_category: RiskCategory;
  red_flag_triggered: boolean;            
  triggered_red_flags: TriggeredRedFlag[];  
  total_score: number | null;             
  bp_assessment_status: BpAssessmentStatus;
  bp_category: BpCategory; 
  duration_triggered_symptoms: DurationTriggeredSymptom[];
  map_at_risk?: boolean;                  // MAP > 90 (KIA) -> berisiko; backend sudah menaikkan risk_category
  map_mmhg?: number | null;               // MAP = (sistolik + 2 x diastolik) / 3, null kalau tensi kosong
  medical_history?: MedicalHistoryCode[];
}

// ===== Auth — sesuai schema asli backend (token.py / user.py) =====
export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  full_name: string;
  email: string;
  role: string;
}

export interface RegisterPayload {
  email: string;
  full_name: string;
  password: string;
  role?: string; // default "mother" di backend kalau di-omit
}

export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

// ===== Profil & Onboarding — sesuai endpoint asli Alek =====

// Body untuk POST /api/v1/profile (sekali saat onboarding)
export interface ProfileSubmitPayload {
  hpht: string; // ISO date "YYYY-MM-DD" — Hari Pertama Haid Terakhir, BUKAN tanggal perkiraan lahir
}

// Response dari GET /api/v1/profile/me — dipanggil tiap dashboard load
export interface PregnancyProfile {
  profile_id: string;
  hpht: string;
  hpl: string; // Hari Perkiraan Lahir — dihitung otomatis backend dari hpht
  trimester: 1 | 2 | 3; // dihitung otomatis backend, JANGAN dihitung ulang di FE
  gestational_week: number; // dihitung otomatis backend
  progress_pct: number; // dihitung otomatis backend, 0-100
  is_active: boolean;
}

// ============================================================
// BELUM CONFIRMED — belum ada endpoint publik (mobile) yang dicek langsung,
// cuma kontrak draft CMS Thoriq. Field/nama bisa berubah pas endpoint asli jadi.
// ============================================================

export interface EducationContent {
  id: string;
  category: string;
  trimester: number | null;
  title: string;
  body: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
}

export interface ChecklistItemStatus {
  item_id: string;
  label: string;
  category: string | null;
  order_index?: number | null;
  is_completed: boolean;
  log_id?: string | null;
}

export interface ChecklistSummary {
  total: number;
  completed: number;
  label: string;
}

export interface TodayChecklistResponse {
  date: string;
  items: ChecklistItemStatus[];
  summary: ChecklistSummary;
}

export interface ChecklistHistoryDay {
  date: string;
  items: {
    item_id: string;
    label: string;
    is_completed: boolean;
  }[];
  summary: ChecklistSummary;
}

export interface ChecklistLogEntry {
  item_id: string;
  date: string;
  is_done: boolean;
}

export interface ChecklistSubmitItem {
  item_id: string;
  is_completed: boolean;
}

export interface ChecklistSubmitPayload {
  items: ChecklistSubmitItem[];
}
