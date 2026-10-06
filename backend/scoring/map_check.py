"""
MAP (Mean Arterial Pressure) untuk skrining risiko (Buku KIA 2024, skrining preeklamsia).

MAP = (sistolik + 2 x diastolik) / 3

MAP > 90 mmHg = kriteria Risiko Sedang, HANYA dihitung pada usia kehamilan < 20 minggu
(Buku KIA 2024, Skrining Preeklamsia hal. 102; keputusan Chelsea).

- Operator strict (>): MAP persis 90,0 TIDAK berisiko. Kalau Chelsea minta ">= 90",
  cukup ubah MAP_RISK_INCLUSIVE jadi True.
- Usia kehamilan dalam minggu penuh, strict (<): 19 minggu 6 hari masih berlaku, 20 minggu 0 hari tidak.
- Tensi kosong, atau usia kehamilan tidak diketahui (HPHT kosong) -> tidak ada efek, tidak error.
"""
from typing import Optional

MAP_RISK_CUTOFF = 90  # mmHg
MAP_RISK_INCLUSIVE = False  # False: MAP > 90 | True: MAP >= 90
MAP_MAX_GESTATIONAL_WEEKS = 20  # MAP hanya dinilai bila usia kehamilan < 20 minggu (strict)


def calculate_map(systolic_bp: Optional[int], diastolic_bp: Optional[int]) -> Optional[float]:
    """MAP dibulatkan 1 desimal untuk tampilan; None kalau salah satu tensi kosong."""
    if systolic_bp is None or diastolic_bp is None:
        return None
    return round((systolic_bp + 2 * diastolic_bp) / 3, 1)


def is_map_rule_applicable(gestational_week: Optional[int]) -> bool:
    """Aturan MAP hanya berlaku bila usia kehamilan diketahui dan < MAP_MAX_GESTATIONAL_WEEKS."""
    return gestational_week is not None and gestational_week < MAP_MAX_GESTATIONAL_WEEKS


def is_map_at_risk(
    systolic_bp: Optional[int],
    diastolic_bp: Optional[int],
    gestational_week: Optional[int],
) -> bool:
    """
    Bandingkan nilai MAP yang BELUM dibulatkan, supaya tidak ada efek pembulatan di batas.
    gestational_week: minggu penuh dari HPHT; None (HPHT kosong) -> tidak berisiko.
    """
    if systolic_bp is None or diastolic_bp is None:
        return False
    if not is_map_rule_applicable(gestational_week):
        return False
    map_value = (systolic_bp + 2 * diastolic_bp) / 3
    if MAP_RISK_INCLUSIVE:
        return map_value >= MAP_RISK_CUTOFF
    return map_value > MAP_RISK_CUTOFF
