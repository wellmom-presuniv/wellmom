from risk_combiner import combine_final_risk, FinalRiskCategory


def test_both_low_and_none():
    """Skor LOW, durasi NONE -> hasil akhir LOW"""
    score_result = {
        "risk_category": "LOW",
        "red_flag_triggered": False,
        "triggered_red_flags": [],
        "total_score": 2,
    }
    result = combine_final_risk(score_result, "NONE", [])
    assert result.risk_category == FinalRiskCategory.LOW
    assert result.total_score == 2
    print("✅ test_both_low_and_none passed")


def test_score_medium_duration_none():
    """Skor MEDIUM, durasi NONE -> hasil akhir MEDIUM (skor menang karena durasi kosong)"""
    score_result = {
        "risk_category": "MEDIUM",
        "red_flag_triggered": False,
        "triggered_red_flags": [],
        "total_score": 3,
    }
    result = combine_final_risk(score_result, "NONE", [])
    assert result.risk_category == FinalRiskCategory.MEDIUM
    print("✅ test_score_medium_duration_none passed")


def test_score_low_duration_warning():
    """Skor LOW, tapi durasi WARNING (gejala hari 1) -> risk_category MEDIUM (WARNING di-map ke storage), 
    tapi duration_triggered_symptoms tetap simpan status asli WARNING"""
    score_result = {
        "risk_category": "LOW",
        "red_flag_triggered": False,
        "triggered_red_flags": [],
        "total_score": 1,
    }
    duration_symptoms = [{"symptom": "BLEEDING", "days_active": 1, "status": "WARNING"}]
    result = combine_final_risk(score_result, "WARNING", duration_symptoms)
    assert result.risk_category == FinalRiskCategory.MEDIUM  # bukan WARNING lagi
    assert result.total_score == 1
    assert len(result.duration_triggered_symptoms) == 1
    assert result.duration_triggered_symptoms[0]["status"] == "WARNING"  # detail asli tetap ada
    print("✅ test_score_low_duration_warning passed")


def test_score_medium_duration_high():
    """Skor cuma MEDIUM, tapi durasi sudah HIGH (gejala hari 2+) -> hasil akhir HIGH"""
    score_result = {
        "risk_category": "MEDIUM",
        "red_flag_triggered": False,
        "triggered_red_flags": [],
        "total_score": 3,
    }
    duration_symptoms = [{"symptom": "HIGH_FEVER", "days_active": 2, "status": "HIGH"}]
    result = combine_final_risk(score_result, "HIGH", duration_symptoms)
    assert result.risk_category == FinalRiskCategory.HIGH
    print("✅ test_score_medium_duration_high passed")


def test_red_flag_overrides_everything():
    """Red-flag trigger (dari compute_risk) -> HIGH, walau durasi cuma NONE"""
    score_result = {
        "risk_category": "HIGH",
        "red_flag_triggered": True,
        "triggered_red_flags": [{"question_id": "q6", "question_text": "Sakit kepala berat?"}],
        "total_score": None,
    }
    result = combine_final_risk(score_result, "NONE", [])
    assert result.risk_category == FinalRiskCategory.HIGH
    assert result.red_flag_triggered == True
    assert result.total_score is None
    print("✅ test_red_flag_overrides_everything passed")


def test_bp_category_informational_only():
    """bp_category CRISIS tidak mengubah risk_category kalau skor & durasi rendah"""
    score_result = {
        "risk_category": "LOW",
        "red_flag_triggered": False,
        "triggered_red_flags": [],
        "total_score": 1,
    }
    result = combine_final_risk(score_result, "NONE", [], bp_category="CRISIS")
    assert result.risk_category == FinalRiskCategory.LOW  # TIDAK berubah jadi HIGH
    assert result.bp_category == "CRISIS"  # tapi tetap tercatat buat ditampilkan
    print("✅ test_bp_category_informational_only passed")


def test_duration_high_beats_score_high_no_conflict():
    """Skor HIGH dan durasi HIGH bersamaan -> tetap HIGH, tidak error"""
    score_result = {
        "risk_category": "HIGH",
        "red_flag_triggered": False,
        "triggered_red_flags": [],
        "total_score": 5,
    }
    duration_symptoms = [{"symptom": "BLEEDING", "days_active": 3, "status": "HIGH"}]
    result = combine_final_risk(score_result, "HIGH", duration_symptoms)
    assert result.risk_category == FinalRiskCategory.HIGH
    print("✅ test_duration_high_beats_score_high_no_conflict passed")

def test_map_to_storage_category():
    """Verifikasi WARNING -> MEDIUM, kategori lain tidak berubah"""
    from risk_combiner import map_to_storage_category
    assert map_to_storage_category(FinalRiskCategory.WARNING) == FinalRiskCategory.MEDIUM
    assert map_to_storage_category(FinalRiskCategory.LOW) == FinalRiskCategory.LOW
    assert map_to_storage_category(FinalRiskCategory.MEDIUM) == FinalRiskCategory.MEDIUM
    assert map_to_storage_category(FinalRiskCategory.HIGH) == FinalRiskCategory.HIGH
    print("✅ test_map_to_storage_category passed")

# ── Run all tests ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    test_both_low_and_none()
    test_score_medium_duration_none()
    test_score_low_duration_warning()
    test_score_medium_duration_high()
    test_red_flag_overrides_everything()
    test_bp_category_informational_only()
    test_duration_high_beats_score_high_no_conflict()
    test_map_to_storage_category()
    print("\n🎉 Semua test passed!")