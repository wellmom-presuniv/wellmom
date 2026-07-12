import asyncio
import uuid

from app.database import AsyncSessionLocal
from app.models.content import EducationContent


async def seed():
    contents = [
        {
            "title": "Pentingnya Asam Folat",
            "body": "Asam folat membantu mencegah cacat tabung saraf pada janin.",
            "trimester": 1,
            "category": "Nutrisi",
            "order_in_category": 1,
        },
        {
            "title": "Menjaga Hidrasi",
            "body": "Minumlah minimal 8 gelas air setiap hari selama kehamilan.",
            "trimester": None,
            "category": "Gaya Hidup",
            "order_in_category": 1,
        },
        {
            "title": "Olahraga Ringan",
            "body": "Lakukan aktivitas ringan seperti jalan kaki atau yoga ibu hamil.",
            "trimester": 2,
            "category": "Aktivitas",
            "order_in_category": 1,
        },
        {
            "title": "Persiapan Persalinan",
            "body": "Mulailah mempersiapkan perlengkapan persalinan sejak trimester ketiga.",
            "trimester": 3,
            "category": "Persalinan",
            "order_in_category": 1,
        },
    ]

    async with AsyncSessionLocal() as db:
        for item in contents:
            db.add(
                EducationContent(
                    content_id=uuid.uuid4(),
                    title=item["title"],
                    body=item["body"],
                    trimester=item["trimester"],
                    category=item["category"],
                    order_in_category=item["order_in_category"],
                    is_published=True,
                )
            )

        await db.commit()
        print(f"✅ Seed education berhasil — {len(contents)} contents inserted.")


asyncio.run(seed())