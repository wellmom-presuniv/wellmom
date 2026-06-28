import asyncio, json, uuid
from app.database import AsyncSessionLocal
from app.models.assessment import AssessmentQuestion
from app.models.risk_threshold import RiskThreshold

async def seed():
    with open("assessment_questions.json") as f:
        questions = json.load(f)
    with open("risk_thresholds.json") as f:
        thresholds = json.load(f)

    async with AsyncSessionLocal() as db:
        for q in questions:
            db.add(AssessmentQuestion(
                question_id=uuid.uuid4(),
                question_text=q["question_text"],
                order_index=q["order_index"],
                is_red_flag=q["is_red_flag"],
                weight=q["weight"],
                is_active=q["is_active"],
            ))
        for t in thresholds:
            db.add(RiskThreshold(
                threshold_id=uuid.uuid4(),
                min_score=t["min_score"],
                max_score=t["max_score"],
                category=t["category"],
                is_active=True,
            ))
        await db.commit()
        print("Seed berhasil.")

asyncio.run(seed())