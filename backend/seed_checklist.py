import asyncio
import uuid
from app.database import AsyncSessionLocal
from app.models.checklist import ChecklistItem


async def seed():
    items = [
        {"label": "Minum tablet tambah darah", "category": "suplemen",  "order_index": 1},
        {"label": "Minum air 8 gelas",          "category": "hidrasi",   "order_index": 2},
        {"label": "Makan sumber protein",       "category": "nutrisi",   "order_index": 3},
        {"label": "Makan sayur dan buah",       "category": "nutrisi",   "order_index": 4},
        {"label": "Susu / kalsium",             "category": "suplemen",  "order_index": 5},
        {"label": "Istirahat cukup",            "category": "aktivitas", "order_index": 6},
    ]
    async with AsyncSessionLocal() as db:
        for item in items:
            db.add(ChecklistItem(item_id=uuid.uuid4(), is_active=True, **item))
        await db.commit()
        print(f"✅ Seed checklist berhasil — {len(items)} items inserted.")


asyncio.run(seed())