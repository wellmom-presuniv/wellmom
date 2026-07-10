"""
Hitung z-score pertumbuhan bayi berdasarkan metode LMS (WHO Child Growth 
Standards). Data referensi (L, M, S per bulan per jenis kelamin) dibaca 
dari file JSON -- config-driven, bukan hardcode.

Cakupan (sesuai konfirmasi Chelsea/dr. Nucky):
- Lingkar kepala & berat badan: 0-5 tahun (dipakai subset 0-24 bulan)
- Panjang badan: 0-2 tahun

Zona hasil (berdasarkan garis WHO chart yang dikirim Chelsea):
- NORMAL: -2 <= z <= 2  (dalam garis merah)
- CONCERN: -3 <= z < -2  atau  2 < z <= 3  (antara garis hitam & merah)
- SEVERE: z < -3  atau  z > 3  (di luar garis hitam)

Owner: Arizal.
"""
import json
import math
import os
from enum import Enum


class GrowthZone(str, Enum):
    SEVERE = "SEVERE"
    CONCERN = "CONCERN"
    NORMAL = "NORMAL"


class Indicator(str, Enum):
    HEAD_CIRCUMFERENCE = "HEAD_CIRCUMFERENCE"
    WEIGHT = "WEIGHT"
    LENGTH = "LENGTH"


_SEED_DIR = os.path.join(
    os.path.dirname(__file__), "..", "database", "seeds", "who_growth_standards"
)

_FILE_MAP = {
    Indicator.HEAD_CIRCUMFERENCE: "head_circumference.json",
    Indicator.WEIGHT: "weight_for_age.json",
    Indicator.LENGTH: "length_for_age.json",
}

_cache: dict = {}


def _load_reference_data(indicator: Indicator) -> list[dict]:
    """Load dan cache data referensi L/M/S dari JSON, biar tidak baca file berulang."""
    if indicator not in _cache:
        path = os.path.join(_SEED_DIR, _FILE_MAP[indicator])
        with open(path) as f:
            _cache[indicator] = json.load(f)
    return _cache[indicator]


def _find_lms(indicator: Indicator, month: int, sex: str) -> dict | None:
    """
    Cari baris L/M/S untuk umur (bulan) dan jenis kelamin tertentu.
    Kalau umur tidak persis match, ambil yang paling dekat (bulan dibulatkan).
    """
    data = _load_reference_data(indicator)
    matching = [row for row in data if row["sex"] == sex]
    
    if not matching:
        return None
    
    # Cari exact match dulu
    for row in matching:
        if row["month"] == month:
            return row
    
    # Kalau tidak ada exact match, ambil yang bulan-nya paling dekat
    closest = min(matching, key=lambda row: abs(row["month"] - month))
    return closest


def calculate_zscore(value: float, L: float, M: float, S: float) -> float:
    """
    Hitung z-score pakai rumus LMS (WHO method).
    
    Kalau L != 0: Z = ((value/M)^L - 1) / (L * S)
    Kalau L == 0: Z = ln(value/M) / S
    """
    if L != 0:
        z = ((value / M) ** L - 1) / (L * S)
    else:
        z = math.log(value / M) / S
    return z


def classify_zone(z_score: float) -> GrowthZone:
    """Cocokkan z-score ke salah satu dari 3 zona."""
    if z_score < -3 or z_score > 3:
        return GrowthZone.SEVERE
    if (-3 <= z_score < -2) or (2 < z_score <= 3):
        return GrowthZone.CONCERN
    return GrowthZone.NORMAL


def evaluate_growth(
    indicator: Indicator,
    value: float,
    age_months: int,
    sex: str,
) -> dict:
    """
    Fungsi utama -- hitung z-score dan zona untuk satu pengukuran.
    
    Args:
        indicator: HEAD_CIRCUMFERENCE, WEIGHT, atau LENGTH
        value: nilai hasil ukur (cm untuk lingkar kepala/panjang, kg untuk berat)
        age_months: umur bayi dalam bulan (dibulatkan ke bulan terdekat)
        sex: "MALE" atau "FEMALE"
    
    Returns:
        dict berisi z_score, zone, dan info referensi yang dipakai
    """
    lms = _find_lms(indicator, age_months, sex)
    
    if lms is None:
        return {
            "z_score": None,
            "zone": None,
            "error": f"Tidak ada data referensi untuk {sex} umur {age_months} bulan",
        }
    
    z_score = calculate_zscore(value, lms["L"], lms["M"], lms["S"])
    zone = classify_zone(z_score)
    
    return {
        "z_score": round(z_score, 2),
        "zone": zone.value,
        "reference_month_used": lms["month"],  # bulan referensi yang dipakai (kalau age_months tidak exact match)
    }