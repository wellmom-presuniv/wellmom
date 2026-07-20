import uuid
from typing import Optional
from pydantic import BaseModel


class ChecklistItemStatus(BaseModel):
    item_id:      uuid.UUID
    label:        str
    category:     Optional[str]
    order_index:  Optional[int]
    is_completed: bool
    log_id:       Optional[uuid.UUID]  # null kalau belum pernah di-toggle hari ini


class ChecklistSummary(BaseModel):
    total:     int
    completed: int
    label:     str   # "4/6 selesai" — siap render langsung di FE


class TodayChecklistResponse(BaseModel):
    date:    str
    items:   list[ChecklistItemStatus]
    summary: ChecklistSummary


class ToggleResponse(BaseModel):
    item_id:      uuid.UUID
    label:        str
    is_completed: bool
    log_id:       uuid.UUID
    date:         str

class ChecklistHistoryItemStatus(BaseModel):
    item_id: uuid.UUID
    label: str
    is_completed: bool


class ChecklistHistoryDay(BaseModel):
    date: str
    items: list[ChecklistHistoryItemStatus]
    summary: ChecklistSummary