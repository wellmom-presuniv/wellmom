import asyncio
import json
import uuid

from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.models.assessment import AssessmentQuestion
from app.models.risk_threshold import RiskThreshold


async def seed():
    with open("assessment_questions.json", encoding="utf-8") as f:
        questions = json.load(f)

    with open("risk_thresholds.json", encoding="utf-8") as f:
        thresholds = json.load(f)

    async with AsyncSessionLocal() as db:
        # Upsert assessment questions by order_index
        for q in questions:
            result = await db.execute(
                select(AssessmentQuestion).where(
                    AssessmentQuestion.order_index == q["order_index"]
                )
            )
            existing = result.scalars().first()

            if existing:
                existing.question_text = q["question_text"]
                existing.is_red_flag = q["is_red_flag"]
                existing.weight = q["weight"]
                existing.is_active = q["is_active"]
            else:
                db.add(
                    AssessmentQuestion(
                        question_id=uuid.uuid4(),
                        question_text=q["question_text"],
                        order_index=q["order_index"],
                        is_red_flag=q["is_red_flag"],
                        weight=q["weight"],
                        is_active=q["is_active"],
                    )
                )

        # Upsert risk thresholds by category
        for t in thresholds:
            result = await db.execute(
                select(RiskThreshold).where(
                    RiskThreshold.category == t["category"],
                    RiskThreshold.is_active == True,
                )
            )
            existing = result.scalars().first()

            if existing:
                existing.min_score = t["min_score"]
                existing.max_score = t["max_score"]
                existing.category = t["category"]
                existing.is_active = True
            else:
                db.add(
                    RiskThreshold(
                        threshold_id=uuid.uuid4(),
                        min_score=t["min_score"],
                        max_score=t["max_score"],
                        category=t["category"],
                        is_active=True,
                    )
                )

        await db.commit()
        print("Seed assessment questions and risk thresholds berhasil di-upsert.")


asyncio.run(seed())