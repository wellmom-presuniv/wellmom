import pytest
from pydantic import ValidationError

from app.schemas.monitoring import MaternalLogRequest


def _payload(**overrides):
    data = {"weight_kg": 60, "height_cm": 160, "lila_cm": 25}
    data.update(overrides)
    return data


@pytest.mark.parametrize("lila", [10, 23.5, 45])
def test_lila_within_range_accepted(lila):
    assert MaternalLogRequest(**_payload(lila_cm=lila)).lila_cm == lila


@pytest.mark.parametrize("lila", [9.9, 45.1, 50, 0, -1])
def test_lila_out_of_range_rejected(lila):
    with pytest.raises(ValidationError):
        MaternalLogRequest(**_payload(lila_cm=lila))


def test_lila_optional():
    assert MaternalLogRequest(weight_kg=60, height_cm=160).lila_cm is None


@pytest.mark.parametrize("weight", [20, 250])
def test_weight_boundaries_accepted(weight):
    MaternalLogRequest(**_payload(weight_kg=weight))


@pytest.mark.parametrize("weight", [19.9, 250.1])
def test_weight_out_of_range_rejected(weight):
    with pytest.raises(ValidationError):
        MaternalLogRequest(**_payload(weight_kg=weight))


@pytest.mark.parametrize("height", [100, 220])
def test_height_boundaries_accepted(height):
    MaternalLogRequest(**_payload(height_cm=height))


@pytest.mark.parametrize("height", [99.9, 220.1])
def test_height_out_of_range_rejected(height):
    with pytest.raises(ValidationError):
        MaternalLogRequest(**_payload(height_cm=height))
