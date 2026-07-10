import json
import os
from bp_classifier import classify_blood_pressure, BPCategory


# ── Load thresholds dari file JSON asli ────────────────────────────────────

_THRESHOLDS_PATH = os.path.join(
    os.path.dirname(__file__), "..", "database", "seeds", "bp_thresholds.json"
)

with open(_THRESHOLDS_PATH) as f:
    THRESHOLDS = json.load(f)


# ── Test cases ─────────────────────────────────────────────────────────────

def test_normal():
    """Sistol dan diastol normal -> NORMAL"""
    result = classify_blood_pressure(110, 70, THRESHOLDS)
    assert result == BPCategory.NORMAL
    print("✅ test_normal passed")


def test_elevated():
    """Sistol 125 (elevated), diastol 70 (normal) -> ELEVATED"""
    result = classify_blood_pressure(125, 70, THRESHOLDS)
    assert result == BPCategory.ELEVATED
    print("✅ test_elevated passed")


def test_stage_1_via_systolic():
    """Sistol 135 (stage 1), diastol 70 (normal) -> STAGE_1"""
    result = classify_blood_pressure(135, 70, THRESHOLDS)
    assert result == BPCategory.STAGE_1
    print("✅ test_stage_1_via_systolic passed")


def test_stage_1_via_diastolic():
    """Sistol 125 (elevated), diastol 85 (stage 1) -> STAGE_1 (diastol menang)"""
    result = classify_blood_pressure(125, 85, THRESHOLDS)
    assert result == BPCategory.STAGE_1
    print("✅ test_stage_1_via_diastolic passed")


def test_stage_2_via_systolic():
    """Sistol 150 (stage 2), diastol 70 (normal) -> STAGE_2"""
    result = classify_blood_pressure(150, 70, THRESHOLDS)
    assert result == BPCategory.STAGE_2
    print("✅ test_stage_2_via_systolic passed")


def test_stage_2_via_diastolic():
    """Sistol 125 (elevated), diastol 95 (stage 2) -> STAGE_2 (diastol menang)"""
    result = classify_blood_pressure(125, 95, THRESHOLDS)
    assert result == BPCategory.STAGE_2
    print("✅ test_stage_2_via_diastolic passed")


def test_crisis_via_systolic():
    """Sistol 190 (crisis), diastol 70 (normal) -> CRISIS"""
    result = classify_blood_pressure(190, 70, THRESHOLDS)
    assert result == BPCategory.CRISIS
    print("✅ test_crisis_via_systolic passed")


def test_crisis_via_diastolic():
    """Sistol 125 (elevated), diastol 125 (crisis) -> CRISIS (diastol menang)"""
    result = classify_blood_pressure(125, 125, THRESHOLDS)
    assert result == BPCategory.CRISIS
    print("✅ test_crisis_via_diastolic passed")


def test_boundary_normal_elevated():
    """Sistol tepat 119 -> NORMAL, sistol tepat 120 -> ELEVATED"""
    assert classify_blood_pressure(119, 70, THRESHOLDS) == BPCategory.NORMAL
    assert classify_blood_pressure(120, 70, THRESHOLDS) == BPCategory.ELEVATED
    print("✅ test_boundary_normal_elevated passed")


def test_boundary_stage2_crisis():
    """Sistol tepat 180 -> STAGE_2, sistol tepat 181 -> CRISIS"""
    assert classify_blood_pressure(180, 70, THRESHOLDS) == BPCategory.STAGE_2
    assert classify_blood_pressure(181, 70, THRESHOLDS) == BPCategory.CRISIS
    print("✅ test_boundary_stage2_crisis passed")

def test_rejects_zero_systolic():
    """Sistol 0 harus raise ValueError, bukan diam-diam jadi NORMAL"""
    try:
        classify_blood_pressure(0, 70, THRESHOLDS)
        assert False, "Harusnya raise ValueError"
    except ValueError:
        print("✅ test_rejects_zero_systolic passed")


def test_rejects_negative_diastolic():
    """Diastol negatif harus raise ValueError"""
    try:
        classify_blood_pressure(120, -10, THRESHOLDS)
        assert False, "Harusnya raise ValueError"
    except ValueError:
        print("✅ test_rejects_negative_diastolic passed")
# ── Run all tests ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    test_normal()
    test_elevated()
    test_stage_1_via_systolic()
    test_stage_1_via_diastolic()
    test_stage_2_via_systolic()
    test_stage_2_via_diastolic()
    test_crisis_via_systolic()
    test_crisis_via_diastolic()
    test_boundary_normal_elevated()
    test_boundary_stage2_crisis()
    test_rejects_zero_systolic()
    test_rejects_negative_diastolic()
    print("\n🎉 Semua test passed!")