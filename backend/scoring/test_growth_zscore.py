from growth_zscore import (
    Indicator,
    GrowthZone,
    calculate_zscore,
    classify_zone,
    evaluate_growth,
)


# ── Test: calculate_zscore (rumus LMS murni, tanpa file) ────────────────────

def test_zscore_matches_manual_calculation():
    """Verifikasi hasil sama dengan hitungan manual: HC 38.5cm, bulan 3 FEMALE"""
    L, M, S = 1, 39.5328, 0.0314
    z = calculate_zscore(38.5, L, M, S)
    assert round(z, 2) == -0.83
    print("✅ test_zscore_matches_manual_calculation passed")


def test_zscore_zero_at_median():
    """Kalau value == M, z-score harus 0 (persis median)"""
    L, M, S = 1, 39.5328, 0.0314
    z = calculate_zscore(M, L, M, S)
    assert round(z, 5) == 0.0
    print("✅ test_zscore_zero_at_median passed")


def test_zscore_negative_L():
    """Formula untuk L negatif (dipakai di data berat badan) tetap jalan"""
    # Contoh dari wfa_girls bulan 0: L=0.3809, M=3.2322, S=0.14171
    L, M, S = 0.3809, 3.2322, 0.14171
    z = calculate_zscore(3.2322, L, M, S)  # value == M -> z harus 0
    assert round(z, 5) == 0.0
    print("✅ test_zscore_negative_L passed")


# ── Test: classify_zone ──────────────────────────────────────────────────── 

def test_zone_normal_within_2sd():
    assert classify_zone(0) == GrowthZone.NORMAL
    assert classify_zone(1.5) == GrowthZone.NORMAL
    assert classify_zone(-1.5) == GrowthZone.NORMAL
    assert classify_zone(2.0) == GrowthZone.NORMAL   # boundary tepat 2 -> masih NORMAL
    assert classify_zone(-2.0) == GrowthZone.NORMAL
    print("✅ test_zone_normal_within_2sd passed")


def test_zone_concern_between_2_and_3sd():
    assert classify_zone(2.5) == GrowthZone.CONCERN
    assert classify_zone(-2.5) == GrowthZone.CONCERN
    assert classify_zone(3.0) == GrowthZone.CONCERN   # boundary tepat 3 -> masih CONCERN
    assert classify_zone(-3.0) == GrowthZone.CONCERN
    print("✅ test_zone_concern_between_2_and_3sd passed")


def test_zone_severe_beyond_3sd():
    assert classify_zone(3.1) == GrowthZone.SEVERE
    assert classify_zone(-3.1) == GrowthZone.SEVERE
    assert classify_zone(5.0) == GrowthZone.SEVERE
    print("✅ test_zone_severe_beyond_3sd passed")


# ── Test: evaluate_growth (fungsi utama, baca file JSON asli) ───────────────

def test_evaluate_growth_head_circumference_normal():
    """Bayi perempuan 3 bulan, lingkar kepala 38.5cm -> NORMAL, z=-0.83"""
    result = evaluate_growth(
        indicator=Indicator.HEAD_CIRCUMFERENCE,
        value=38.5,
        age_months=3,
        sex="FEMALE",
    )
    assert result["z_score"] == -0.83
    assert result["zone"] == "NORMAL"
    print("✅ test_evaluate_growth_head_circumference_normal passed")


def test_evaluate_growth_weight_severe_low():
    """Bayi laki-laki 6 bulan, berat cuma 5kg (jauh di bawah M=7.934) -> harus SEVERE"""
    result = evaluate_growth(
        indicator=Indicator.WEIGHT,
        value=5.0,
        age_months=6,
        sex="MALE",
    )
    assert result["zone"] == "SEVERE"
    print("✅ test_evaluate_growth_weight_severe_low passed")


def test_evaluate_growth_length_normal():
    """Bayi perempuan 12 bulan, panjang 74cm (dekat M=74.015) -> NORMAL"""
    result = evaluate_growth(
        indicator=Indicator.LENGTH,
        value=74.0,
        age_months=12,
        sex="FEMALE",
    )
    assert result["zone"] == "NORMAL"
    print("✅ test_evaluate_growth_length_normal passed")


def test_evaluate_growth_uses_closest_month_if_no_exact_match():
    """Length cuma ada data 0-24 bulan -- kalau diminta bulan 30, harus ambil bulan 24 (paling dekat)"""
    result = evaluate_growth(
        indicator=Indicator.LENGTH,
        value=90.0,
        age_months=30,  # di luar range data (cuma ada 0-24)
        sex="MALE",
    )
    assert result["reference_month_used"] == 24  # ambil bulan terakhir yang ada
    print("✅ test_evaluate_growth_uses_closest_month_if_no_exact_match passed")


# ── Run all tests ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    test_zscore_matches_manual_calculation()
    test_zscore_zero_at_median()
    test_zscore_negative_L()
    test_zone_normal_within_2sd()
    test_zone_concern_between_2_and_3sd()
    test_zone_severe_beyond_3sd()
    test_evaluate_growth_head_circumference_normal()
    test_evaluate_growth_weight_severe_low()
    test_evaluate_growth_length_normal()
    test_evaluate_growth_uses_closest_month_if_no_exact_match()
    print("\n🎉 Semua test passed!")