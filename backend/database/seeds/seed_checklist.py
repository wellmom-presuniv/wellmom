import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

import asyncio
import uuid
from app.database import AsyncSessionLocal
from sqlalchemy import text


CHECKLIST_ITEMS = [
    {"label": "Minum tablet tambah darah", "category": "suplemen", "order_index": 1},
    {"label": "Minum air minimal 8 gelas", "category": "hidrasi", "order_index": 2},
    {"label": "Makan makanan sumber protein", "category": "nutrisi", "order_index": 3},
    {"label": "Makan sayur dan buah", "category": "nutrisi", "order_index": 4},
    {"label": "Konsumsi susu/kalsium", "category": "suplemen", "order_index": 5},
    {"label": "Istirahat cukup (7-8 jam)", "category": "istirahat", "order_index": 6},
]

async def seed():
    async with AsyncSessionLocal() as db:
        result = await db.execute(text("SELECT COUNT(*) FROM checklist_items"))
        count = result.scalar()
        if count > 0:
            print(f"⚠️  checklist_items sudah ada {count} data, skip seeding.")
            return

        for item in CHECKLIST_ITEMS:
            await db.execute(text("""
                INSERT INTO checklist_items (item_id, label, category, is_active, order_index)
                VALUES (:item_id, :label, :category, true, :order_index)
            """), {
                "item_id": str(uuid.uuid4()),
                "label": item["label"],
                "category": item["category"],
                "order_index": item["order_index"],
            })

        await db.commit()
        print(f"✅ {len(CHECKLIST_ITEMS)} checklist_items di-seed.")

if __name__ == "__main__":
    asyncio.run(seed())