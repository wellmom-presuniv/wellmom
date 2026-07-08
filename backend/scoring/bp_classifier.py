"""
Klasifikasi tekanan darah berdasarkan tabel AHA — table-driven, baca dari 
bp_thresholds.json (bukan hardcode), supaya bisa di-swap ke kriteria 
obstetri kalau nanti dr. Nucky ubah keputusan.

Owner: Arizal.
"""
from enum import Enum


class BPCategory(str, Enum):
    NORMAL = "NORMAL"
    ELEVATED = "ELEVATED"
    STAGE_1 = "STAGE_1"
    STAGE_2 = "STAGE_2"
    CRISIS = "CRISIS"


# Urutan keparahan — dipakai untuk ambil kategori yang lebih parah
_SEVERITY_ORDER = [
    BPCategory.NORMAL,
    BPCategory.ELEVATED,
    BPCategory.STAGE_1,
    BPCategory.STAGE_2,
    BPCategory.CRISIS,
]


def _classify_single_metric(value: int, metric: str, thresholds: list[dict]) -> BPCategory:
    """
    Cari kategori untuk satu metric (systolic ATAU diastolic) berdasarkan 
    thresholds yang sudah difilter untuk metric itu saja.
    """
    matching = [t for t in thresholds if t["metric"] == metric]
    
    for t in matching:
        min_val = t.get("min", float("-inf"))
        max_val = t.get("max", float("inf"))
        if min_val <= value <= max_val:
            return BPCategory(t["category"])
    
    # Fallback kalau tidak ada yang cocok (seharusnya tidak terjadi kalau 
    # thresholds lengkap, tapi aman daripada error)
    return BPCategory.CRISIS


def classify_blood_pressure(
    systolic: int,
    diastolic: int,
    thresholds: list[dict],
) -> BPCategory:
    """
    Klasifikasi tensi darah berdasarkan tabel AHA.
    
    Logic: ambil kategori yang PALING PARAH antara systolic dan diastolic,
    bukan menganggap keduanya harus match di satu range yang sama.
    
    Contoh: sistol 125 (Elevated) + diastol 85 (Stage 1) -> hasil Stage 1,
    karena diastol menunjukkan kondisi yang lebih parah.
    
    Args:
        systolic: tekanan darah sistolik (mmHg)
        diastolic: tekanan darah diastolik (mmHg)
        thresholds: list of dict dari bp_thresholds.json, contoh:
            [{"category": "NORMAL", "metric": "systolic", "max": 119}, ...]
    
    Returns:
        BPCategory yang paling parah dari kedua metric
    """
    sys_category = _classify_single_metric(systolic, "systolic", thresholds)
    dia_category = _classify_single_metric(diastolic, "diastolic", thresholds)
    
    sys_rank = _SEVERITY_ORDER.index(sys_category)
    dia_rank = _SEVERITY_ORDER.index(dia_category)
    
    return _SEVERITY_ORDER[max(sys_rank, dia_rank)]