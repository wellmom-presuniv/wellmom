import { AssessmentQuestion, AssessmentResult } from "../../types";

// Sumber: backend/database/seeds/assessment_questions.json (Arizal) — 8 pertanyaan asli.
// TODO: pertanyaan ini akan berubah setelah PR #11 Arizal di-merge (Q2 digabung, Q5 jadi
// non-red-flag, Q9 baru). Jangan update dulu sampai re-seed DB dan jawaban duration tracking
// (otomatis vs manual) dikonfirmasi Arizal.
export const MOCK_QUESTIONS: AssessmentQuestion[] = [
  { question_id: "q1", question_text: "Mudah lelah berlebihan?", weight: 1, is_red_flag: false, is_active: true, order_index: 1 },
  { question_id: "q2", question_text: "Pusing atau mata berkunang?", weight: 1, is_red_flag: false, is_active: true, order_index: 2 },
  { question_id: "q3", question_text: "Mual muntah terus-menerus?", weight: 1, is_red_flag: false, is_active: true, order_index: 3 },
  { question_id: "q4", question_text: "Tidak konsumsi tablet tambah darah?", weight: 1, is_red_flag: false, is_active: true, order_index: 4 },
  { question_id: "q5", question_text: "Perdarahan atau flek?", weight: 0, is_red_flag: true, is_active: true, order_index: 5 },
  { question_id: "q6", question_text: "Sakit kepala berat?", weight: 0, is_red_flag: true, is_active: true, order_index: 6 },
  { question_id: "q7", question_text: "Bengkak pada wajah/tangan?", weight: 0, is_red_flag: true, is_active: true, order_index: 7 },
  { question_id: "q8", question_text: "Gerakan janin berkurang (trimester lanjut)?", weight: 0, is_red_flag: true, is_active: true, order_index: 8 },
];

export function mockCalculateRisk(
  answers: Record<string, boolean>,
  systolicBp: number | null,
  diastolicBp: number | null
): AssessmentResult {
  const triggeredRedFlags = MOCK_QUESTIONS
    .filter((q) => q.is_red_flag && answers[q.question_id])
    .map((q) => ({
      question_id: q.question_id,
      question_text: q.question_text,
    }));

  const bpStatus =
    systolicBp == null || diastolicBp == null ? "NOT_PROVIDED" : "PENDING_THRESHOLD";

  const today = new Date().toISOString().split("T")[0];

  if (triggeredRedFlags.length > 0) {
    return {
      response_id: "mock-result",
      date: today,
      risk_category: "HIGH",
      red_flag_triggered: true,
      total_score: null,
      bp_assessment_status: bpStatus,
      triggered_red_flags: triggeredRedFlags,
    };
  }

  const totalScore = MOCK_QUESTIONS
    .filter((q) => !q.is_red_flag && answers[q.question_id])
    .reduce((sum, q) => sum + q.weight, 0);

  const category = totalScore <= 2 ? "LOW" : totalScore <= 4 ? "MEDIUM" : "HIGH";

  return {
    response_id: "mock-result",
    date: today,
    risk_category: category,
    red_flag_triggered: false,
    total_score: totalScore,
    bp_assessment_status: bpStatus,
    triggered_red_flags: [],
  };
}