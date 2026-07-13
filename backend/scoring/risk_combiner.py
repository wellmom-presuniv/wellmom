"""
Penggabung akhir — menyatukan 3 jalur independen jadi satu hasil risk 
assessment: jalur skor (compute_risk), jalur durasi gejala berat 
(duration_logic), dan info tensi (bp_classifier, informasional saja).

Fungsi ini TIDAK menghitung ulang ketiga jalur -- dia cuma menerima hasil 
yang sudah dihitung, lalu mengambil keputusan mana yang paling parah.
Endpoint backend nanti yang panggil compute_risk/evaluate_all_duration_symptoms/
classify_blood_pressure lebih dulu, baru kirim hasilnya ke sini.

Owner: Arizal.
"""
from dataclasses import dataclass
from enum import Enum
from typing import Optional


class FinalRiskCategory(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    WARNING = "WARNING"
    HIGH = "HIGH"


# Urutan keparahan -- dipakai untuk ambil kategori paling parah antar jalur
_SEVERITY_ORDER = [
    FinalRiskCategory.LOW,
    FinalRiskCategory.MEDIUM,
    FinalRiskCategory.WARNING,
    FinalRiskCategory.HIGH,
]


@dataclass
class FinalAssessmentResult:
    risk_category: FinalRiskCategory
    red_flag_triggered: bool
    triggered_red_flags: list[dict]
    total_score: Optional[int]
    duration_triggered_symptoms: list[dict]
    bp_category: Optional[str]  # informasional, tidak pengaruhi risk_category


def _map_score_category(score_result: dict) -> FinalRiskCategory:
    """
    Convert hasil compute_risk (yang pakai string "LOW"/"MEDIUM"/"HIGH") 
    ke FinalRiskCategory. Kalau red_flag_triggered, itu sudah HIGH.
    """
    if score_result["red_flag_triggered"]:
        return FinalRiskCategory.HIGH
    return FinalRiskCategory(score_result["risk_category"])


def _map_duration_category(duration_category_str: str) -> FinalRiskCategory:
    """
    Convert DurationCategory (NONE/WARNING/HIGH) ke FinalRiskCategory.
    NONE dianggap setara LOW -- tidak ada kontribusi ke arah lebih parah.
    """
    mapping = {
        "NONE": FinalRiskCategory.LOW,
        "WARNING": FinalRiskCategory.WARNING,
        "HIGH": FinalRiskCategory.HIGH,
    }
    return mapping[duration_category_str]

def map_to_storage_category(category: FinalRiskCategory | str) -> FinalRiskCategory:
    """
    Map kategori risk internal ke kategori yang aman disimpan ke DB.
    
    Untuk MVP (keputusan bareng Alek, 10 Juli 2026): WARNING belum jadi 
    risk_level resmi di database/schema, jadi di-map ke MEDIUM saat 
    disimpan. Detail durasi (status WARNING per-gejala) tetap ada di 
    duration_triggered_symptoms, jadi FE tetap bisa jelasin alasan 
    spesifik ke user meski risk_category yang tersimpan cuma MEDIUM.
    
    Menerima FinalRiskCategory atau string biasa (defensif untuk 
    integrasi backend -- misal kalau dipanggil dengan string yang 
    diambil dari DB/request body), tapi SELALU mengembalikan 
    FinalRiskCategory enum, bukan string biasa -- supaya caller bisa 
    aman pakai .value tanpa cek tipe dulu.
    """
    if not isinstance(category, FinalRiskCategory):
        category = FinalRiskCategory(category)
    
    if category == FinalRiskCategory.WARNING:
        return FinalRiskCategory.MEDIUM
    return category

def combine_final_risk(
    score_result: dict,
    duration_category: str,
    duration_triggered_symptoms: list[dict],
    bp_category: Optional[str] = None,
) -> FinalAssessmentResult:
    """
    Gabungkan jalur skor dan jalur durasi, ambil yang paling parah.
    Tensi (bp_category) TIDAK ikut menentukan kategori -- murni informasional.
    
    risk_category yang di-return SUDAH melalui storage mapping -- WARNING 
    tidak akan pernah muncul di field ini, otomatis jadi MEDIUM. Detail 
    WARNING per-gejala tetap ada di duration_triggered_symptoms.
    
    Args:
        score_result: dict hasil dari compute_risk() 
            {"risk_category": str, "red_flag_triggered": bool, 
             "triggered_red_flags": list, "total_score": int|None}
        duration_category: string dari evaluate_all_duration_symptoms()
            -- "NONE" / "WARNING" / "HIGH"
        duration_triggered_symptoms: list detail dari evaluate_all_duration_symptoms()
        bp_category: hasil dari classify_blood_pressure(), opsional
    
    Returns:
        FinalAssessmentResult dengan kategori final yang sudah storage-safe
    """
    score_category = _map_score_category(score_result)
    duration_cat = _map_duration_category(duration_category)
    
    score_rank = _SEVERITY_ORDER.index(score_category)
    duration_rank = _SEVERITY_ORDER.index(duration_cat)
    
    raw_category = _SEVERITY_ORDER[max(score_rank, duration_rank)]
    final_category = map_to_storage_category(raw_category)
    
    return FinalAssessmentResult(
        risk_category=final_category,
        red_flag_triggered=score_result["red_flag_triggered"],
        triggered_red_flags=score_result["triggered_red_flags"],
        total_score=score_result["total_score"],
        duration_triggered_symptoms=duration_triggered_symptoms,
        bp_category=bp_category,
    )