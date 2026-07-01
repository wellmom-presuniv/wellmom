from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.content import EducationContent


async def get_published_content(
    db: AsyncSession,
    trimester: int,
):
    result = await db.execute(
        select(EducationContent)
        .where(
            EducationContent.is_published == True,
            (
                (EducationContent.trimester == trimester)
                | (EducationContent.trimester.is_(None))
            ),
        )
        .order_by(
            EducationContent.trimester,
            EducationContent.order_in_category,
        )
    )

    return result.scalars().all()