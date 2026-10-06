// Cutoff klinis di sisi mobile. Sumber kebenaran skor akhir tetap backend
// (backend/scoring/map_check.py); konstanta ini hanya untuk pratinjau di form dan catatan UI.
// Ubah KEDUANYA bersamaan kalau Chelsea mengubah aturan.
export const MAP_RISK_CUTOFF = 90; // mmHg, MAP > 90 => berisiko (Buku KIA 2024, skrining preeklamsia hal. 102)
export const MAP_RISK_INCLUSIVE = false;
export const MAP_MAX_GESTATIONAL_WEEKS = 20; // MAP hanya dinilai bila usia kehamilan < 20 minggu (strict)

// Aturan MAP berlaku hanya kalau usia kehamilan (minggu penuh) diketahui dan < 20.
export function isMapRuleApplicable(gestationalWeek: number | null | undefined): boolean {
  return gestationalWeek != null && gestationalWeek < MAP_MAX_GESTATIONAL_WEEKS;
}

// Pratinjau di form (sebelum submit). Bandingkan MAP yang belum dibulatkan, sama seperti backend.
export function isMapAtRisk(
  systolic: number,
  diastolic: number,
  gestationalWeek: number | null | undefined
): boolean {
  if (!isMapRuleApplicable(gestationalWeek)) return false;
  if (!Number.isFinite(systolic) || !Number.isFinite(diastolic) || systolic <= 0 || diastolic <= 0) return false;
  const map = (systolic + 2 * diastolic) / 3;
  return MAP_RISK_INCLUSIVE ? map >= MAP_RISK_CUTOFF : map > MAP_RISK_CUTOFF;
}
