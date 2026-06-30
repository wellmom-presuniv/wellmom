import { AssessmentQuestion, AssessmentResult } from "../../types";

// Sumber: backend/database/seeds/assessment_questions.json (Arizal) — 8 pertanyaan asli,
// BUKAN dummy karangan. order_index & is_red_flag persis sama seed yang sudah di-load ke DB.
export const MOCK_QUESTIONS: AssessmentQuestion[] = [
  { id: "q1", question_text: "Mudah lelah berlebihan?", category: null, weight: 1, is_red_flag: false, is_active: true, order_index: 1 },
  { id: "q2", question_text: "Pusing atau mata berkunang?", category: null, weight: 1, is_red_flag: false, is_active: true, order_index: 2 },
  { id: "q3", question_text: "Mual muntah terus-menerus?", category: null, weight: 1, is_red_flag: false, is_active: true, order_index: 3 },
  { id: "q4", question_text: "Tidak konsumsi tablet tambah darah?", category: null, weight: 1, is_red_flag: false, is_active: true, order_index: 4 },
  { id: "q5", question_text: "Perdarahan atau flek?", category: null, weight: 0, is_red_flag: true, is_active: true, order_index: 5 },
  { id: "q6", question_text: "Sakit kepala berat?", category: null, weight: 0, is_red_flag: true, is_active: true, order_index: 6 },
  { id: "q7", question_text: "Bengkak pada wajah/tangan?", category: null, weight: 0, is_red_flag: true, is_active: true, order_index: 7 },
  { id: "q8", question_text: "Gerakan janin berkurang (trimester lanjut)?", category: null, weight: 0, is_red_flag: true, is_active: true, order_index: 8 },
];

/**
 * Simulasi scoring engine Arizal (engine.py) — dipakai SEMENTARA sampai
 * POST /assessment/submit beneran ada. Logic ini sengaja di-mirror persis
 * (red-flag check dulu baru score accumulation) biar pas swap ke API asli,
 * behavior UI ga berubah.
 */
export function mockCalculateRisk(
  answers: Record<string, boolean>,
  systolicBp: number | null,
  diastolicBp: number | null
): AssessmentResult {
  const triggeredRedFlags = MOCK_QUESTIONS.filter((q) => q.is_red_flag && answers[q.id]).map((q) => ({
    question_id: q.id,
    question_text: q.question_text,
  }));

  const bpStatus =
    systolicBp == null || diastolicBp == null ? "NOT_PROVIDED" : "PENDING_THRESHOLD";

  if (triggeredRedFlags.length > 0) {
    return {
      risk_category: "HIGH",
      total_score: 0,
      bp_assessment_status: bpStatus,
      triggered_red_flags: triggeredRedFlags,
      recommendation_text:
        "Beberapa tanda yang Anda alami perlu perhatian segera. Lakukan konsultasi ke fasilitas kesehatan terdekat.",
    };
  }

  const totalScore = MOCK_QUESTIONS.filter((q) => !q.is_red_flag && answers[q.id]).reduce(
    (sum, q) => sum + q.weight,
    0
  );

  // Sesuai risk_thresholds.json: LOW 0-2, MEDIUM 3-4, HIGH 5-999
  const category = totalScore <= 2 ? "LOW" : totalScore <= 4 ? "MEDIUM" : "HIGH";

  return {
    risk_category: category,
    total_score: totalScore,
    bp_assessment_status: bpStatus,
    triggered_red_flags: [],
    recommendation_text:
      category === "LOW"
        ? "Kondisi Anda baik. Tetap jaga pola makan dan lakukan pemeriksaan kehamilan rutin."
        : "Tingkatkan asupan gizi dan konsultasikan kondisi Anda saat kunjungan ANC berikutnya.",
  };
}