from lila_check import check_lila, LILA_NORMAL, LILA_KEK_RISK


def test_lila_at_cutoff_is_normal():
    assert check_lila(23.5)["status"] == LILA_NORMAL


def test_lila_above_cutoff_is_normal():
    assert check_lila(28)["status"] == LILA_NORMAL


def test_lila_below_cutoff_is_kek_risk():
    result = check_lila(23.4)
    assert result["status"] == LILA_KEK_RISK
    assert "KEK" in result["message"]
