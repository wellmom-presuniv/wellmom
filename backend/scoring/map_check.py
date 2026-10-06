"""
MAP (Mean Arterial Pressure) untuk skrining risiko (Buku KIA 2024, skrining preeklamsia).

MAP = (sistolik + 2 x diastolik) / 3

MAP > 90 mmHg -> berisiko. Operator strict (>): MAP persis 90,0 TIDAK berisiko.
Kalau Chelsea minta ">= 90", cukup ubah MAP_RISK_INCLUSIVE jadi True (satu-satunya tempat).

Tensi kosong -> tidak ada efek (None / tidak berisiko).
"""
from typing import Optional

MAP_RISK_CUTOFF = 90  # mmHg
MAP_RISK_INCLUSIVE = False  # False: MAP > 90 | True: MAP >= 90


def calculate_map(systolic_bp: Optional[int], diastolic_bp: Optional[int]) -> Optional[float]:
    """MAP dibulatkan 1 desimal untuk tampilan; None kalau salah satu tensi kosong."""
    if systolic_bp is None or diastolic_bp is None:
        return None
    return round((systolic_bp + 2 * diastolic_bp) / 3, 1)


def is_map_at_risk(systolic_bp: Optional[int], diastolic_bp: Optional[int]) -> bool:
    """Bandingkan nilai MAP yang BELUM dibulatkan, supaya tidak ada efek pembulatan di batas."""
    if systolic_bp is None or diastolic_bp is None:
        return False
    map_value = (systolic_bp + 2 * diastolic_bp) / 3
    if MAP_RISK_INCLUSIVE:
        return map_value >= MAP_RISK_CUTOFF
    return map_value > MAP_RISK_CUTOFF
