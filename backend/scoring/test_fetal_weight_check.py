from fetal_weight_check import check_fetal_weight, FetalWeightStatus


def test_below_normal():
    """Berat 2.0kg -> BELOW_NORMAL"""
    result = check_fetal_weight(2.0)
    assert result["status"] == FetalWeightStatus.BELOW_NORMAL.value
    assert "di bawah" in result["message"]
    print("✅ test_below_normal passed")


def test_normal_middle():
    """Berat 3.2kg (tengah-tengah rentang) -> NORMAL"""
    result = check_fetal_weight(3.2)
    assert result["status"] == FetalWeightStatus.NORMAL.value
    print("✅ test_normal_middle passed")


def test_above_normal():
    """Berat 4.5kg -> ABOVE_NORMAL"""
    result = check_fetal_weight(4.5)
    assert result["status"] == FetalWeightStatus.ABOVE_NORMAL.value
    assert "di atas" in result["message"]
    print("✅ test_above_normal passed")


def test_boundary_lower():
    """Tepat 2.5kg -> NORMAL (batas bawah inklusif)"""
    result = check_fetal_weight(2.5)
    assert result["status"] == FetalWeightStatus.NORMAL.value
    print("✅ test_boundary_lower passed")


def test_boundary_upper():
    """Tepat 4.0kg -> NORMAL (batas atas inklusif)"""
    result = check_fetal_weight(4.0)
    assert result["status"] == FetalWeightStatus.NORMAL.value
    print("✅ test_boundary_upper passed")


def test_just_below_boundary():
    """2.49kg -> BELOW_NORMAL (sedikit di bawah batas)"""
    result = check_fetal_weight(2.49)
    assert result["status"] == FetalWeightStatus.BELOW_NORMAL.value
    print("✅ test_just_below_boundary passed")


def test_just_above_boundary():
    """4.01kg -> ABOVE_NORMAL (sedikit di atas batas)"""
    result = check_fetal_weight(4.01)
    assert result["status"] == FetalWeightStatus.ABOVE_NORMAL.value
    print("✅ test_just_above_boundary passed")


if __name__ == "__main__":
    test_below_normal()
    test_normal_middle()
    test_above_normal()
    test_boundary_lower()
    test_boundary_upper()
    test_just_below_boundary()
    test_just_above_boundary()
    print("\n🎉 Semua test passed!")