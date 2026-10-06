from map_check import (
    MAP_MAX_GESTATIONAL_WEEKS,
    MAP_RISK_CUTOFF,
    calculate_map,
    is_map_at_risk,
    is_map_rule_applicable,
)

EARLY = 10  # minggu, di bawah batas 20


def test_constants():
    assert MAP_RISK_CUTOFF == 90
    assert MAP_MAX_GESTATIONAL_WEEKS == 20


def test_map_exactly_90_is_not_at_risk():
    # 120/75 -> (120 + 150) / 3 = 90.0
    assert calculate_map(120, 75) == 90.0
    assert is_map_at_risk(120, 75, EARLY) is False


def test_map_just_above_90_is_at_risk():
    # 120/76 -> 272 / 3 = 90.67
    assert calculate_map(120, 76) == 90.7
    assert is_map_at_risk(120, 76, EARLY) is True
    # 121/75 -> 271 / 3 = 90.33
    assert calculate_map(121, 75) == 90.3
    assert is_map_at_risk(121, 75, EARLY) is True


def test_map_just_below_90_is_not_at_risk():
    # 120/74 -> 268 / 3 = 89.33
    assert is_map_at_risk(120, 74, EARLY) is False


def test_normal_pressure_not_at_risk():
    assert is_map_at_risk(110, 70, EARLY) is False


def test_high_pressure_at_risk_before_20_weeks():
    assert is_map_at_risk(160, 110, EARLY) is True


def test_gestational_week_boundary_is_strict():
    assert is_map_at_risk(160, 110, 19) is True   # 19 minggu 6 hari = minggu penuh 19
    assert is_map_at_risk(160, 110, 20) is False  # 20 minggu 0 hari
    assert is_map_at_risk(160, 110, 40) is False


def test_week_zero_is_applicable():
    assert is_map_rule_applicable(0) is True
    assert is_map_at_risk(160, 110, 0) is True


def test_unknown_gestational_week_has_no_effect():
    assert is_map_rule_applicable(None) is False
    assert is_map_at_risk(160, 110, None) is False


def test_missing_blood_pressure_has_no_effect():
    assert calculate_map(None, None) is None
    assert calculate_map(120, None) is None
    assert calculate_map(None, 80) is None
    assert is_map_at_risk(None, None, EARLY) is False
    assert is_map_at_risk(120, None, EARLY) is False
    assert is_map_at_risk(None, 80, EARLY) is False
    assert is_map_at_risk(None, None, None) is False


def test_extreme_values():
    assert is_map_at_risk(300, 200, EARLY) is True
    assert is_map_at_risk(1, 1, EARLY) is False
    assert calculate_map(300, 200) == 233.3
    # Usia kehamilan ekstrem tidak error
    assert is_map_at_risk(300, 200, 500) is False
    assert is_map_at_risk(300, 200, 0) is True


def test_map_value_still_computed_after_20_weeks():
    """Nilai MAP tetap dihitung untuk ditampilkan; hanya flag risikonya yang tidak berlaku."""
    assert calculate_map(160, 110) == 126.7
    assert is_map_at_risk(160, 110, 25) is False
