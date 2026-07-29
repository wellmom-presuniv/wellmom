import asyncio
import uuid
from datetime import date, datetime, timezone
from types import SimpleNamespace

import pytest
from fastapi import HTTPException
from sqlalchemy.dialects import postgresql

from app.api.deps import get_current_user_id, require_admin
from app.api.v1.admin import admin_get_high_risk_assessment_alerts
from app.core.security import create_access_token
from app.crud import assessment as assessment_crud
from app.services import assessment_service


def run(coro):
    return asyncio.run(coro)


class _ScalarResult:
    def __init__(self, value):
        self._value = value

    def scalars(self):
        return self

    def first(self):
        return self._value


class _AdminDb:
    def __init__(self, user):
        self.user = user

    async def execute(self, statement):
        return _ScalarResult(self.user)


class _RowsResult:
    def __init__(self, rows):
        self._rows = rows

    def all(self):
        return self._rows


class _QueryDb:
    def __init__(self, rows=None):
        self.rows = rows or []
        self.statement = None

    async def execute(self, statement):
        self.statement = statement
        return _RowsResult(self.rows)


def _make_row(
    *,
    assessment_date,
    risk_level,
    triggered_red_flags,
    hpht=date(2026, 1, 1),
    total_score=5,
):
    user_id = uuid.uuid4()
    profile_id = uuid.uuid4()
    response = SimpleNamespace(
        response_id=uuid.uuid4(),
        user_id=user_id,
        pregnancy_profile_id=profile_id,
        assessment_date=assessment_date,
    )
    result = SimpleNamespace(
        result_id=uuid.uuid4(),
        response_id=response.response_id,
        total_score=total_score,
        risk_level=risk_level,
        triggered_red_flags=triggered_red_flags,
        created_at=assessment_date,
    )
    user = SimpleNamespace(
        id=user_id,
        full_name="Ibu Demo WellMom",
        email="demo.wellmom.2907@test.com",
    )
    profile = SimpleNamespace(
        profile_id=profile_id,
        hpht=hpht,
        hpl=date(2026, 10, 8) if hpht else None,
    )
    return response, result, user, profile


def test_admin_can_retrieve_high_risk_alerts(monkeypatch):
    admin_id = uuid.uuid4()
    token = create_access_token(admin_id, "admin")
    authenticated_id = run(get_current_user_id(token))
    authorized_id = run(
        require_admin(
            user_id=authenticated_id,
            db=_AdminDb(SimpleNamespace(id=admin_id, role="admin")),
        )
    )

    expected = [{"response_id": uuid.uuid4()}]

    async def fake_list(*, db, limit, offset):
        assert limit == 20
        assert offset == 0
        return expected

    monkeypatch.setattr(
        assessment_service,
        "list_high_risk_assessment_alerts",
        fake_list,
    )

    response = run(
        admin_get_high_risk_assessment_alerts(
            limit=20,
            offset=0,
            db=object(),
            _=authorized_id,
        )
    )
    assert response == expected


def test_mother_is_forbidden():
    mother_id = uuid.uuid4()
    token = create_access_token(mother_id, "mother")
    authenticated_id = run(get_current_user_id(token))

    with pytest.raises(HTTPException) as exc_info:
        run(
            require_admin(
                user_id=authenticated_id,
                db=_AdminDb(SimpleNamespace(id=mother_id, role="mother")),
            )
        )

    assert exc_info.value.status_code == 403


def test_query_uses_required_joins_filters_sorting_and_pagination():
    db = _QueryDb()
    rows = run(
        assessment_crud.get_high_risk_assessment_alerts(
            db=db,
            limit=7,
            offset=3,
        )
    )
    assert rows == []

    sql = str(
        db.statement.compile(
            dialect=postgresql.dialect(),
            compile_kwargs={"literal_binds": True},
        )
    ).lower()

    assert "join assessment_results" in sql
    assert "join users" in sql
    assert "join pregnancy_profiles" in sql
    assert "assessment_results.risk_level = 'high'" in sql
    assert "jsonb_typeof(assessment_results.triggered_red_flags)" in sql
    assert "jsonb_array_length(assessment_results.triggered_red_flags)" in sql
    assert " or " in sql
    assert "assessment_responses.assessment_date desc" in sql
    assert "assessment_results.created_at desc" in sql
    assert "limit 7" in sql
    assert "offset 3" in sql


def test_service_maps_high_risk_and_red_flag_rows_newest_first(monkeypatch):
    newest = datetime(2026, 7, 29, 9, 30, tzinfo=timezone.utc)
    older = datetime(2026, 7, 28, 9, 30, tzinfo=timezone.utc)
    red_flag = {
        "question_id": str(uuid.uuid4()),
        "question_text": "Perdarahan atau flek",
    }
    rows = [
        _make_row(
            assessment_date=newest,
            risk_level="MEDIUM",
            triggered_red_flags=[red_flag],
            total_score=3,
        ),
        _make_row(
            assessment_date=older,
            risk_level="HIGH",
            triggered_red_flags=[],
        ),
    ]

    async def fake_query(*, db, limit, offset):
        assert limit == 20
        assert offset == 0
        return rows

    monkeypatch.setattr(
        assessment_crud,
        "get_high_risk_assessment_alerts",
        fake_query,
    )
    alerts = run(
        assessment_service.list_high_risk_assessment_alerts(
            db=object(),
            limit=20,
            offset=0,
        )
    )

    assert [item["assessment_date"] for item in alerts] == [newest, older]
    assert alerts[0]["risk_category"] == "MEDIUM"
    assert alerts[0]["red_flag_triggered"] is True
    assert alerts[0]["triggered_red_flags"] == [red_flag]
    assert alerts[1]["risk_category"] == "HIGH"
    assert alerts[1]["red_flag_triggered"] is False


@pytest.mark.parametrize(
    ("risk_level", "triggered_red_flags", "should_match"),
    [
        ("HIGH", [], True),
        ("MEDIUM", [{"question_text": "Red flag"}], True),
        ("LOW", [], False),
        ("MEDIUM", None, False),
    ],
)
def test_high_risk_filter_cases(risk_level, triggered_red_flags, should_match):
    has_red_flags = (
        isinstance(triggered_red_flags, list)
        and len(triggered_red_flags) > 0
    )
    assert (risk_level == "HIGH" or has_red_flags) is should_match


def test_empty_data_and_pagination_are_forwarded(monkeypatch):
    calls = []

    async def fake_query(*, db, limit, offset):
        calls.append((limit, offset))
        return []

    monkeypatch.setattr(
        assessment_crud,
        "get_high_risk_assessment_alerts",
        fake_query,
    )

    alerts = run(
        assessment_service.list_high_risk_assessment_alerts(
            db=object(),
            limit=2,
            offset=4,
        )
    )
    assert alerts == []
    assert calls == [(2, 4)]


def test_null_hpht_returns_null_gestational_week(monkeypatch):
    row = _make_row(
        assessment_date=datetime(2026, 7, 29, tzinfo=timezone.utc),
        risk_level="HIGH",
        triggered_red_flags=None,
        hpht=None,
    )

    async def fake_query(*, db, limit, offset):
        return [row]

    monkeypatch.setattr(
        assessment_crud,
        "get_high_risk_assessment_alerts",
        fake_query,
    )

    alert = run(
        assessment_service.list_high_risk_assessment_alerts(db=object())
    )[0]
    assert alert["gestational_week"] is None
    assert alert["red_flag_triggered"] is False
    assert alert["triggered_red_flags"] == []


def test_gestational_week_uses_assessment_date(monkeypatch):
    row = _make_row(
        assessment_date=datetime(2026, 7, 29, tzinfo=timezone.utc),
        risk_level="HIGH",
        triggered_red_flags=[],
        hpht=date(2026, 1, 1),
    )

    async def fake_query(*, db, limit, offset):
        return [row]

    monkeypatch.setattr(
        assessment_crud,
        "get_high_risk_assessment_alerts",
        fake_query,
    )

    alert = run(
        assessment_service.list_high_risk_assessment_alerts(db=object())
    )[0]
    assert alert["gestational_week"] == 29
