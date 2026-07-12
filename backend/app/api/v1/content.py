from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_id, get_db
from app.schemas.content import EducationContentResponse
from app.services.content_service import get_education_content_for_user

router = APIRouter(prefix="/content", tags=["Education Content"])


@router.get(
    "",
    response_model=list[EducationContentResponse],
)
async def get_education_content(
    db: AsyncSession = Depends(get_db),
    user_id: UUID = Depends(get_current_user_id),
):
    return await get_education_content_for_user(
        db=db,
        user_id=user_id,
    )