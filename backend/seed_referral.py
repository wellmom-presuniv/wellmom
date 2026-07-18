import asyncio
import uuid
from app.database import AsyncSessionLocal
from app.models.referral import ReferralMapping


async def seed():
    data = [
        {
            "risk_level": "LOW",
            "facility_type": "Mandiri",
            "recommendation": "Kondisi baik. Tetap jaga pola makan, "
                              "konsumsi suplemen, dan lakukan ANC rutin.",
            "urgency_label": "Saat jadwal ANC rutin",
        },
        {
            "risk_level": "MEDIUM",
            "facility_type": "Puskesmas / Bidan",
            "recommendation": "Ada beberapa faktor yang perlu diperhatikan. "
                              "Konsultasikan kondisi ke bidan atau dokter "
                              "pada kunjungan ANC berikutnya.",
            "urgency_label": "Dalam 1–3 hari",
        },
        {
            "risk_level": "HIGH",
            "facility_type": "Rumah Sakit",
            "recommendation": "Terdapat tanda bahaya kehamilan. "
                              "Segera ke fasilitas kesehatan terdekat "
                              "dan jangan tunda.",
            "urgency_label": "Segera / Hari ini",
        },
    ]

    async with AsyncSessionLocal() as db:
        for d in data:
            db.add(ReferralMapping(
                mapping_id=uuid.uuid4(),
                is_active=True,
                **d,
            ))
        await db.commit()
        print("✅ Seed referral berhasil — 3 record inserted.")


asyncio.run(seed())