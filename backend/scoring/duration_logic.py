"""
Logic durasi untuk 3 gejala berat: bleeding (Q5), blurred vision (Q2), 
high fever (Q9).

Aturan (locked, dari Chelsea/dr. Nucky):
- Hari 1 gejala muncul -> WARNING (belum rujuk)
- Hari ke-2 dst gejala masih ada -> HIGH (rujuk)

Gejala ini TETAP menyumbang skor biasa (weight=1 tiap pertanyaan) DI LUAR 
sistem ini -- itu dihitung terpisah di scoring_service.py. File ini HANYA 
menangani jalur durasi, bukan jalur skor.

Owner: Arizal.
"""
from dataclasses import dataclass
from datetime import date
from enum import Enum


class DurationCategory(str, Enum):
    NONE = "NONE"          # gejala tidak ada / sudah resolved
    WARNING = "WARNING"    # gejala hari pertama
    HIGH = "HIGH"          # gejala hari ke-2 atau lebih


class SymptomType(str, Enum):
    BLEEDING = "BLEEDING"
    BLURRED_VISION = "BLURRED_VISION"
    HIGH_FEVER = "HIGH_FEVER"


@dataclass
class SymptomTrackingRecord:
    """
    Representasi 1 baris di tabel symptom_onset_tracking.
    onset_date: kapan gejala ini PERTAMA kali dilaporkan (Ya) dan belum resolved
    last_reported_date: tanggal submission assessment yang sedang diproses
    resolved: True kalau gejala ini sudah dilaporkan "Tidak" di suatu hari
    """
    symptom_type: SymptomType
    onset_date: date
    last_reported_date: date
    resolved: bool = False


# Mapping dari question_id ke SymptomType -- sesuai keputusan final
QUESTION_TO_SYMPTOM = {
    "q2": SymptomType.BLURRED_VISION,  # "Pusing, Pandangan kabur?"
    "q5": SymptomType.BLEEDING,         # "Perdarahan atau flek?"
    "q9": SymptomType.HIGH_FEVER,       # "Demam tinggi (>=38°C)?"
}


def update_tracking_record(
    symptom_type: SymptomType,
    existing_record: SymptomTrackingRecord | None,
    answered_yes: bool,
    today: date,
) -> SymptomTrackingRecord | None:
    """
    Update state tracking untuk SATU gejala, berdasarkan jawaban hari ini.
    
    Logic:
    - Kalau dijawab "Tidak" -> record di-resolve (reset), atau tidak buat 
      record baru kalau memang belum ada.
    - Kalau dijawab "Ya" dan belum ada record aktif -> buat record baru, 
      onset_date = hari ini (ini onset baru, hari 1).
    - Kalau dijawab "Ya" dan sudah ada record aktif (belum resolved) -> 
      update last_reported_date jadi hari ini, onset_date TETAP (tidak 
      berubah -- ini kelanjutan gejala yang sama).
    """
    if not answered_yes:
        if existing_record and not existing_record.resolved:
            existing_record.resolved = True
        return existing_record
    
    if existing_record is None or existing_record.resolved:
        # Onset baru -- gejala baru muncul atau gejala lama sudah resolved
        return SymptomTrackingRecord(
            symptom_type=symptom_type,
            onset_date=today,
            last_reported_date=today,
            resolved=False,
        )
    
    # Gejala berlanjut dari hari sebelumnya
    existing_record.last_reported_date = today
    return existing_record


def get_duration_category(record: SymptomTrackingRecord | None, today: date) -> DurationCategory:
    """
    Tentukan kategori durasi untuk SATU record tracking.
    
    Hari ke berapa dihitung dari onset_date sampai last_reported_date 
    (bukan sampai 'today' saja -- supaya konsisten kalau ada gap laporan).
    """
    if record is None or record.resolved:
        return DurationCategory.NONE
    
    days_active = (record.last_reported_date - record.onset_date).days + 1
    
    if days_active >= 2:
        return DurationCategory.HIGH
    return DurationCategory.WARNING


def evaluate_all_duration_symptoms(
    tracking_records: dict[SymptomType, SymptomTrackingRecord],
    today: date,
) -> tuple[DurationCategory, list[dict]]:
    """
    Cek SEMUA gejala durasi sekaligus, ambil kategori paling parah.
    
    Returns:
        (kategori_final, list_detail_gejala_yang_trigger)
    """
    severity_rank = {
        DurationCategory.NONE: 0,
        DurationCategory.WARNING: 1,
        DurationCategory.HIGH: 2,
    }
    
    worst_category = DurationCategory.NONE
    triggered_details = []
    
    for symptom_type, record in tracking_records.items():
        category = get_duration_category(record, today)
        if category == DurationCategory.NONE:
            continue
        
        days_active = (record.last_reported_date - record.onset_date).days + 1
        triggered_details.append({
            "symptom": symptom_type.value,
            "days_active": days_active,
            "status": category.value,
        })
        
        if severity_rank[category] > severity_rank[worst_category]:
            worst_category = category
    
    return worst_category, triggered_details