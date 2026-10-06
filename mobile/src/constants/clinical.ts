// Cutoff klinis di sisi mobile. Sumber kebenaran skor akhir tetap backend
// (backend/scoring/map_check.py); konstanta ini hanya untuk pratinjau di form.
// Ubah KEDUANYA bersamaan kalau Chelsea mengubah aturan (mis. ">" jadi ">=").
export const MAP_RISK_CUTOFF = 90; // mmHg, MAP > 90 => berisiko (Buku KIA 2024)
export const MAP_RISK_INCLUSIVE = false;

// Bandingkan MAP yang belum dibulatkan, sama seperti backend.
export function isMapAtRisk(systolic: number, diastolic: number): boolean {
  if (!Number.isFinite(systolic) || !Number.isFinite(diastolic) || systolic <= 0 || diastolic <= 0) return false;
  const map = (systolic + 2 * diastolic) / 3;
  return MAP_RISK_INCLUSIVE ? map >= MAP_RISK_CUTOFF : map > MAP_RISK_CUTOFF;
}
