import asyncio
import uuid
from datetime import date
from types import SimpleNamespace

from app.services import checklist_service


def run(coro):
    return asyncio.run(coro)


class _FakeDb:
    def __init__(self):
        self.commits = 0
        self.calls = []

    async def commit(self):
        self.commits += 1
        self.calls.append("commit")


def _patch_crud(monkeypatch, db, item_id):
    item = SimpleNamespace(item_id=item_id, label="Minum TTD", category=None, order_index=1, is_active=True)
    profile = SimpleNamespace(profile_id=uuid.uuid4())

    async def get_item_by_id(_db, _item_id):
        return item

    async def get_active_items(_db):
        return [item]

    async def get_active_profile(_db, _user_id):
        return profile

    async def toggle_log(**kwargs):
        db.calls.append("write")
        return SimpleNamespace(log_id=uuid.uuid4(), is_completed=True)

    async def set_log_status(**kwargs):
        db.calls.append("write")

    async def get_logs_by_date(_db, _user_id, _date):
        db.calls.append("read")
        return []

    monkeypatch.setattr(checklist_service.crud.checklist, "get_item_by_id", get_item_by_id)
    monkeypatch.setattr(checklist_service.crud.checklist, "get_active_items", get_active_items)
    monkeypatch.setattr(checklist_service.crud.pregnancy, "get_active_profile", get_active_profile)
    monkeypatch.setattr(checklist_service.crud.checklist, "toggle_log", toggle_log)
    monkeypatch.setattr(checklist_service.crud.checklist, "set_log_status", set_log_status)
    monkeypatch.setattr(checklist_service.crud.checklist, "get_logs_by_date", get_logs_by_date)


def test_toggle_item_commits_before_returning(monkeypatch):
    db, item_id = _FakeDb(), uuid.uuid4()
    _patch_crud(monkeypatch, db, item_id)

    run(checklist_service.toggle_item(db, uuid.uuid4(), item_id))

    assert db.commits == 1
    assert db.calls == ["write", "commit"]


def test_submit_checklist_commits_before_reading_back(monkeypatch):
    db, item_id = _FakeDb(), uuid.uuid4()
    _patch_crud(monkeypatch, db, item_id)

    run(
        checklist_service.submit_checklist_for_date(
            db,
            uuid.uuid4(),
            date(2026, 10, 6),
            [{"item_id": item_id, "is_completed": True}],
        )
    )

    assert db.commits == 1
    # tulis -> commit -> baca ulang (respons memuat data yang sudah ter-commit)
    assert db.calls == ["write", "commit", "read"]
