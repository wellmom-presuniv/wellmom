import pytest

from app.services.assessment_service import _gestational_week_or_none, _resolve_bp_status
from scoring.bp_classifier import is_bp_at_risk
from scoring.map_check import is_map_at_risk
from scoring.risk_combiner import combine_final_risk

_LOW = {"risk_category": "LOW", "red_flag_triggered": False, "triggered_red_flags": [], "total_score": 0}
_MEDIUM = {**_LOW, "risk_category": "MEDIUM", "total_score": 3}
_HIGH = {
    "risk_category": "HIGH",
    "red_flag_triggered": True,
    "triggered_red_flags": [{"question_id": "x", "question_text": "y"}],
    "total_score": None,
}


def assess(sys_bp, dia_bp, week, score=_LOW, duration="NONE"):
    """Jalur yang sama dengan submit_assessment: AHA -> bp_at_risk, MAP -> map_at_risk -> combine."""
    _, bp_category = _resolve_bp_status(sys_bp, dia_bp)
    return combine_final_risk(
        score,
        duration,
        [],
        bp_category=bp_category,
        map_at_risk=is_map_at_risk(sys_bp, dia_bp, week),
        bp_at_risk=is_bp_at_risk(bp_category),
    )


def test_120_76_week_10_medium_via_map():
    r = assess(120, 76, 10)
    assert r.risk_category.value == "MEDIUM"
    assert r.map_at_risk is True
    assert r.bp_at_risk is False  # ELEVATED, bukan STAGE_2


def test_120_70_week_30_stays_low():
    r = assess(120, 70, 30)
    assert r.risk_category.value == "LOW"
    assert r.map_at_risk is False and r.bp_at_risk is False


@pytest.mark.parametrize("sys_bp,dia_bp", [(140, 90), (150, 100), (160, 110)])
def test_stage_2_at_week_30_medium_via_bp_path(sys_bp, dia_bp):
    r = assess(sys_bp, dia_bp, 30)
    assert r.risk_category.value == "MEDIUM"
    assert r.bp_at_risk is True
    assert r.map_at_risk is False  # makna map_at_risk tidak berubah


def test_160_110_week_10_both_paths_still_medium_not_high():
    r = assess(160, 110, 10)
    assert r.risk_category.value == "MEDIUM"
    assert r.bp_at_risk is True and r.map_at_risk is True


def test_empty_blood_pressure_has_no_effect():
    assert is_bp_at_risk(None) is False
    r = combine_final_risk(_LOW, "NONE", [], bp_category=None, map_at_risk=False, bp_at_risk=False)
    assert r.risk_category.value == "LOW"


def test_missing_hpht_with_160_110_is_medium():
    week = _gestational_week_or_none(None, None)
    assert week is None
    r = assess(160, 110, week)
    assert r.risk_category.value == "MEDIUM"
    assert r.bp_at_risk is True and r.map_at_risk is False


def test_isolated_high_systolic_140_50_is_bp_at_risk():
    # MAP = 80 (tidak berisiko), tetapi AHA STAGE_2 lewat sistolik
    for week in (10, 30, None):
        r = assess(140, 50, week)
        assert r.risk_category.value == "MEDIUM"
        assert r.bp_at_risk is True and r.map_at_risk is False


@pytest.mark.parametrize("sys_bp,dia_bp", [(120, 70), (125, 75), (135, 85)])
def test_elevated_and_stage_1_unchanged_after_20_weeks(sys_bp, dia_bp):
    r = assess(sys_bp, dia_bp, 30)
    assert r.risk_category.value == "LOW"
    assert r.bp_at_risk is False


def test_crisis_counts_as_at_risk_but_never_high():
    r = assess(200, 130, 30)
    assert r.bp_at_risk is True
    assert r.risk_category.value == "MEDIUM"


_ORDER = {"LOW": 0, "MEDIUM": 1, "HIGH": 2}


@pytest.mark.parametrize("score", [_LOW, _MEDIUM, _HIGH])
@pytest.mark.parametrize("duration", ["NONE", "WARNING", "HIGH"])
@pytest.mark.parametrize("bp", [(None, None), (110, 70), (120, 76), (140, 90), (160, 110), (200, 130)])
@pytest.mark.parametrize("week", [None, 5, 19, 20, 30])
def test_bp_paths_never_lower_risk(score, duration, bp, week):
    baseline = combine_final_risk(score, duration, [])
    sys_bp, dia_bp = bp
    if sys_bp is None:
        r = combine_final_risk(score, duration, [], bp_category=None)
    else:
        r = assess(sys_bp, dia_bp, week, score=score, duration=duration)
    assert _ORDER[r.risk_category.value] >= _ORDER[baseline.risk_category.value]
