import asyncio
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))  # biar bisa import app.*

from sqlalchemy import select
from app.database import AsyncSessionLocal
from app.models.assessment import AssessmentQuestion
from app.models.risk_threshold import RiskThreshold

SEEDS_DIR = Path(__file__).parent


async def seed_assessment_questions(session):
    result = await session.execute(select(AssessmentQuestion))
    if result.first():
        print("⚠️  assessment_questions sudah ada data, skip seeding.")
        return

    with open(SEEDS_DIR / "assessment_questions.json") as f:
        data = json.load(f)

    for item in data:
        session.add(AssessmentQuestion(**item))

    print(f"✅ {len(data)} assessment_questions di-seed.")


async def seed_risk_thresholds(session):
    result = await session.execute(select(RiskThreshold))
    if result.first():
        print("⚠️  risk_thresholds sudah ada data, skip seeding.")
        return

    with open(SEEDS_DIR / "risk_thresholds.json") as f:
        data = json.load(f)

    for item in data:
        session.add(RiskThreshold(**item))

    print(f"✅ {len(data)} risk_thresholds di-seed.")


async def main():
    async with AsyncSessionLocal() as session:
        await seed_assessment_questions(session)
        await seed_risk_thresholds(session)
        await session.commit()
    print("\n🎉 Seeding selesai.")


if __name__ == "__main__":
    asyncio.run(main())