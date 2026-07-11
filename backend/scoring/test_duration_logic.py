from datetime import date, timedelta
from duration_logic import (
    SymptomType,
    SymptomTrackingRecord,
    DurationCategory,
    update_tracking_record,
    get_duration_category,
    evaluate_all_duration_symptoms,
)


# ── Test: update_tracking_record ───────────────────────────────────────────

def test_new_symptom_creates_onset():
    """Gejala baru muncul (belum ada record) -> onset hari ini"""
    today = date(2026, 7, 10)
    record = update_tracking_record(
        symptom_type=SymptomType.BLEEDING,
        existing_record=None,
        answered_yes=True,
        today=today,
    )
    assert record is not None
    assert record.symptom_type == SymptomType.BLEEDING
    assert record.onset_date == today
    assert record.last_reported_date == today
    assert record.resolved == False
    print("✅ test_new_symptom_creates_onset passed")


def test_symptom_continues_next_day():
    """Gejala hari 1 sudah ada, hari 2 masih dijawab Ya -> onset TETAP, last_reported update"""
    day1 = date(2026, 7, 10)
    day2 = date(2026, 7, 11)
    
    record_day1 = update_tracking_record(
        symptom_type=SymptomType.BLEEDING,
        existing_record=None,
        answered_yes=True,
        today=day1,
    )
    record_day2 = update_tracking_record(
        symptom_type=SymptomType.BLEEDING,
        existing_record=record_day1,
        answered_yes=True,
        today=day2,
    )
    
    assert record_day2.onset_date == day1  # onset tidak berubah
    assert record_day2.last_reported_date == day2
    assert record_day2.resolved == False
    print("✅ test_symptom_continues_next_day passed")


def test_symptom_resolved_when_answered_no():
    """Gejala ada hari 1, hari 2 dijawab Tidak -> resolved jadi True"""
    day1 = date(2026, 7, 10)
    day2 = date(2026, 7, 11)
    
    record_day1 = update_tracking_record(
        symptom_type=SymptomType.HIGH_FEVER,
        existing_record=None,
        answered_yes=True,
        today=day1,
    )
    record_day2 = update_tracking_record(
        symptom_type=SymptomType.HIGH_FEVER,
        existing_record=record_day1,
        answered_yes=False,
        today=day2,
    )
    
    assert record_day2.resolved == True
    print("✅ test_symptom_resolved_when_answered_no passed")


def test_symptom_reappears_after_resolved():
    """Gejala resolved, lalu muncul lagi -> dianggap onset BARU, bukan lanjutan lama"""
    day1 = date(2026, 7, 10)
    day2 = date(2026, 7, 11)
    day5 = date(2026, 7, 14)
    
    record = update_tracking_record(
        symptom_type=SymptomType.BLURRED_VISION,
        existing_record=None,
        answered_yes=True,
        today=day1,
    )
    record = update_tracking_record(
        symptom_type=SymptomType.BLURRED_VISION,
        existing_record=record,
        answered_yes=False,  # resolved di hari 2
        today=day2,
    )
    record = update_tracking_record(
        symptom_type=SymptomType.BLURRED_VISION,
        existing_record=record,
        answered_yes=True,  # muncul lagi di hari 5
        today=day5,
    )
    
    assert record.onset_date == day5  # onset baru, bukan day1
    assert record.resolved == False
    print("✅ test_symptom_reappears_after_resolved passed")


def test_no_symptom_no_record():
    """Tidak pernah ada gejala -> tetap None"""
    today = date(2026, 7, 10)
    record = update_tracking_record(
        symptom_type=SymptomType.BLEEDING,
        existing_record=None,
        answered_yes=False,
        today=today,
    )
    assert record is None
    print("✅ test_no_symptom_no_record passed")


# ── Test: get_duration_category ────────────────────────────────────────────

def test_category_day1_is_warning():
    """Gejala baru muncul hari ini -> WARNING"""
    today = date(2026, 7, 10)
    record = SymptomTrackingRecord(
        symptom_type=SymptomType.BLEEDING,
        onset_date=today,
        last_reported_date=today,
        resolved=False,
    )
    assert get_duration_category(record) == DurationCategory.WARNING
    print("✅ test_category_day1_is_warning passed")


def test_category_day2_is_high():
    """Gejala berlangsung 2 hari -> HIGH"""
    day1 = date(2026, 7, 10)
    day2 = date(2026, 7, 11)
    record = SymptomTrackingRecord(
        symptom_type=SymptomType.HIGH_FEVER,
        onset_date=day1,
        last_reported_date=day2,
        resolved=False,
    )
    assert get_duration_category(record) == DurationCategory.HIGH
    print("✅ test_category_day2_is_high passed")


def test_category_resolved_is_none():
    """Gejala sudah resolved -> NONE, walau onset_date masih ada"""
    today = date(2026, 7, 10)
    record = SymptomTrackingRecord(
        symptom_type=SymptomType.BLURRED_VISION,
        onset_date=today,
        last_reported_date=today,
        resolved=True,
    )
    assert get_duration_category(record) == DurationCategory.NONE
    print("✅ test_category_resolved_is_none passed")


def test_category_none_record_is_none():
    """Tidak ada record sama sekali -> NONE"""
    today = date(2026, 7, 10)
    assert get_duration_category(None) == DurationCategory.NONE
    print("✅ test_category_none_record_is_none passed")


# ── Test: evaluate_all_duration_symptoms ───────────────────────────────────

def test_evaluate_all_takes_worst_case():
    """1 gejala WARNING + 1 gejala HIGH -> ambil HIGH (paling parah)"""
    day1 = date(2026, 7, 10)
    day2 = date(2026, 7, 11)
    
    records = {
        SymptomType.BLURRED_VISION: SymptomTrackingRecord(
            symptom_type=SymptomType.BLURRED_VISION,
            onset_date=day2,
            last_reported_date=day2,
            resolved=False,
        ),  # baru hari 1 -> WARNING
        SymptomType.BLEEDING: SymptomTrackingRecord(
            symptom_type=SymptomType.BLEEDING,
            onset_date=day1,
            last_reported_date=day2,
            resolved=False,
        ),  # sudah hari 2 -> HIGH
    }
    
    category, details = evaluate_all_duration_symptoms(records)
    
    assert category == DurationCategory.HIGH
    assert len(details) == 2  # kedua gejala tercatat di detail
    print("✅ test_evaluate_all_takes_worst_case passed")


def test_evaluate_all_none_active():
    """Semua gejala resolved/tidak ada -> NONE, detail kosong"""
    today = date(2026, 7, 10)
    records = {
        SymptomType.BLEEDING: SymptomTrackingRecord(
            symptom_type=SymptomType.BLEEDING,
            onset_date=today,
            last_reported_date=today,
            resolved=True,
        ),
    }
    
    category, details = evaluate_all_duration_symptoms(records)
    
    assert category == DurationCategory.NONE
    assert details == []
    print("✅ test_evaluate_all_none_active passed")

def test_symptom_resets_after_skip_day():
    """Hari 1 = Ya, hari 2 = SKIP (tidak submit), hari 3 = Ya -> dianggap onset BARU, bukan lanjutan"""
    day1 = date(2026, 7, 10)
    # hari 2 dilewati sama sekali -- tidak ada pemanggilan fungsi untuk hari itu
    day3 = date(2026, 7, 12)
    
    record_day1 = update_tracking_record(
        symptom_type=SymptomType.BLEEDING,
        existing_record=None,
        answered_yes=True,
        today=day1,
    )
    # Langsung lompat ke hari 3, simulasikan user skip hari 2 sepenuhnya
    record_day3 = update_tracking_record(
        symptom_type=SymptomType.BLEEDING,
        existing_record=record_day1,
        answered_yes=True,
        today=day3,
    )
    
    assert record_day3.onset_date == day3  # onset BARU, bukan day1
    assert record_day3.last_reported_date == day3
    print("✅ test_symptom_resets_after_skip_day passed")


def test_symptom_continues_with_no_gap():
    """Pastikan submission berturut-turut TANPA gap tetap dianggap lanjutan (regresi check)"""
    day1 = date(2026, 7, 10)
    day2 = date(2026, 7, 11)  # persis 1 hari setelah day1, tidak ada gap
    
    record_day1 = update_tracking_record(
        symptom_type=SymptomType.HIGH_FEVER,
        existing_record=None,
        answered_yes=True,
        today=day1,
    )
    record_day2 = update_tracking_record(
        symptom_type=SymptomType.HIGH_FEVER,
        existing_record=record_day1,
        answered_yes=True,
        today=day2,
    )
    
    assert record_day2.onset_date == day1  # onset TETAP, karena tidak ada gap
    assert record_day2.last_reported_date == day2
    print("✅ test_symptom_continues_with_no_gap passed")


# ── Run all tests ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    test_new_symptom_creates_onset()
    test_symptom_continues_next_day()
    test_symptom_resolved_when_answered_no()
    test_symptom_reappears_after_resolved()
    test_no_symptom_no_record()
    test_category_day1_is_warning()
    test_category_day2_is_high()
    test_category_resolved_is_none()
    test_category_none_record_is_none()
    test_evaluate_all_takes_worst_case()
    test_evaluate_all_none_active()
    test_symptom_resets_after_skip_day()
    test_symptom_continues_with_no_gap()
    print("\n🎉 Semua test passed!")