from datetime import date, timedelta

from app.services.assessment_service import _gestational_week_or_none
from scoring.map_check import is_map_at_risk

TODAY = date(2026, 10, 6)


class _Profile:
    def __init__(self, hpht):
        self.hpht = hpht


def _week(days_pregnant):
    return _gestational_week_or_none(_Profile(TODAY - timedelta(days=days_pregnant)), TODAY)


def test_19_weeks_6_days_is_week_19_and_flagged():
    days = 19 * 7 + 6
    assert _week(days) == 19
    assert is_map_at_risk(160, 110, _week(days)) is True


def test_20_weeks_0_days_is_week_20_and_not_flagged():
    days = 20 * 7
    assert _week(days) == 20
    assert is_map_at_risk(160, 110, _week(days)) is False


def test_missing_hpht_or_profile_returns_none_without_error():
    assert _gestational_week_or_none(None, TODAY) is None
    assert _gestational_week_or_none(_Profile(None), TODAY) is None
    assert is_map_at_risk(160, 110, _gestational_week_or_none(_Profile(None), TODAY)) is False


def test_hpht_in_the_future_clamps_to_week_zero():
    assert _gestational_week_or_none(_Profile(TODAY + timedelta(days=5)), TODAY) == 0
