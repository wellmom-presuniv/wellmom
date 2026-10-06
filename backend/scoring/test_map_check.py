from map_check import MAP_RISK_CUTOFF, calculate_map, is_map_at_risk


def test_cutoff_constant():
    assert MAP_RISK_CUTOFF == 90


def test_map_exactly_90_is_not_at_risk():
    # 120/75 -> (120 + 150) / 3 = 90.0
    assert calculate_map(120, 75) == 90.0
    assert is_map_at_risk(120, 75) is False


def test_map_just_above_90_is_at_risk():
    # 120/76 -> 272 / 3 = 90.67
    assert calculate_map(120, 76) == 90.7
    assert is_map_at_risk(120, 76) is True
    # 121/75 -> 271 / 3 = 90.33 (paling dekat di atas 90 dengan sistolik 121)
    assert calculate_map(121, 75) == 90.3
    assert is_map_at_risk(121, 75) is True


def test_map_just_below_90_is_not_at_risk():
    # 120/74 -> 268 / 3 = 89.33
    assert is_map_at_risk(120, 74) is False


def test_normal_pressure_not_at_risk():
    assert is_map_at_risk(110, 70) is False


def test_high_pressure_at_risk():
    assert is_map_at_risk(160, 110) is True


def test_missing_values_have_no_effect():
    assert calculate_map(None, None) is None
    assert calculate_map(120, None) is None
    assert calculate_map(None, 80) is None
    assert is_map_at_risk(None, None) is False
    assert is_map_at_risk(120, None) is False
    assert is_map_at_risk(None, 80) is False


def test_extreme_values():
    assert is_map_at_risk(300, 200) is True
    assert is_map_at_risk(1, 1) is False
    assert calculate_map(300, 200) == 233.3


def test_rounding_does_not_shift_boundary():
    # Selisih sangat kecil di atas 90 tetap berisiko walau tampilan dibulatkan
    assert is_map_at_risk(121, 75) is True  # 271/3 = 90.33
