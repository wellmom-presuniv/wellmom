"""
Cek berat janin trimester 3 -- murni pembanding ke rentang normal statis, 
BUKAN risk factor untuk scoring engine (sesuai konfirmasi Chelsea: fitur 
Monitoring itu modul tracking/prevention terpisah, tidak nyambung ke 
compute_risk atau risk_combiner).

Rentang normal (locked, dr. Nucky): 2,5 - 4 kg di trimester 3.

Owner: Arizal.
"""
from enum import Enum


class FetalWeightStatus(str, Enum):
    BELOW_NORMAL = "BELOW_NORMAL"
    NORMAL = "NORMAL"
    ABOVE_NORMAL = "ABOVE_NORMAL"


# Config-driven -- kalau nanti dr. Nucky ubah rentangnya, tinggal ubah 2 angka ini
MIN_NORMAL_KG = 2.5
MAX_NORMAL_KG = 4.0


def check_fetal_weight(weight_kg: float) -> dict:
    """
    Bandingkan berat janin trimester 3 ke rentang normal.
    
    Args:
        weight_kg: berat janin dalam kg (biasanya dari hasil USG)
    
    Returns:
        dict berisi status dan pesan edukatif -- untuk ditampilkan sebagai 
        info/motivasi, BUKAN untuk trigger red-flag atau masuk skor apapun.
    """
    if weight_kg < MIN_NORMAL_KG:
        return {
            "status": FetalWeightStatus.BELOW_NORMAL.value,
            "message": (
                f"Berat janin ({weight_kg} kg) di bawah rentang normal trimester 3 "
                f"({MIN_NORMAL_KG}-{MAX_NORMAL_KG} kg). Tingkatkan asupan gizi dan "
                f"konsultasikan ke tenaga kesehatan saat kunjungan berikutnya."
            ),
        }
    
    if weight_kg > MAX_NORMAL_KG:
        return {
            "status": FetalWeightStatus.ABOVE_NORMAL.value,
            "message": (
                f"Berat janin ({weight_kg} kg) di atas rentang normal trimester 3 "
                f"({MIN_NORMAL_KG}-{MAX_NORMAL_KG} kg). Konsultasikan ke tenaga "
                f"kesehatan untuk pemantauan lebih lanjut."
            ),
        }
    
    return {
        "status": FetalWeightStatus.NORMAL.value,
        "message": (
            f"Berat janin ({weight_kg} kg) dalam rentang normal trimester 3. "
            f"Pertahankan pola makan dan kunjungan ANC rutin."
        ),
    }