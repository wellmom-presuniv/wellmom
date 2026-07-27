import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from app.api.deps import get_db, require_admin
from app.schemas.referral import ReferralResponse, UpsertReferralRequest
from app.crud import referral as referral_crud
from app.models.assessment import AssessmentQuestion
from app.models.risk_threshold import RiskThreshold
from app.models.content import EducationContent
from app.models.checklist import ChecklistItem
from pydantic import BaseModel

router = APIRouter()

VALID_RISK_LEVELS = {"LOW", "MEDIUM", "HIGH"}


# ─── Inline schemas untuk admin read endpoints ────────────────────────────────

class AdminQuestionResponse(BaseModel):
    question_id: uuid.UUID
    question_text: str
    order_index: int
    is_red_flag: bool
    weight: int
    category: Optional[str]
    is_active: bool
    model_config = {"from_attributes": True}


class ScoreCutoffItem(BaseModel):
    min_score: int
    max_score: int


class ScoreCutoffsResponse(BaseModel):
    low: ScoreCutoffItem
    medium: ScoreCutoffItem
    high: ScoreCutoffItem


class PatchScoreCutoffRequest(BaseModel):
    min_score: int
    max_score: int


class AdminEducationResponse(BaseModel):
    content_id: uuid.UUID
    title: str
    trimester: Optional[int]  # Diubah jadi Optional agar tidak crash jika trimester NULL
    category: Optional[str]
    body: Optional[str]
    status: str            # "published" | "draft"
    order_in_category: Optional[int]
    model_config = {"from_attributes": True}


class AdminChecklistResponse(BaseModel):
    item_id: uuid.UUID
    label: str
    category: Optional[str]
    is_active: bool
    order_index: Optional[int]
    model_config = {"from_attributes": True}


# ─── Request schemas untuk write endpoints ────────────────────────────────────

class UpsertQuestionRequest(BaseModel):
    question_text: str
    order_index: int
    is_red_flag: bool = False
    weight: int = 1
    category: Optional[str] = None
    is_active: bool = True


class UpsertEducationRequest(BaseModel):
    title: str
    body: str
    trimester: Optional[int] = None
    category: Optional[str] = None
    order_in_category: Optional[int] = None
    is_published: bool = False


class UpsertChecklistItemRequest(BaseModel):
    label: str
    category: Optional[str] = None
    order_index: int
    is_active: bool = True


# ─── Helper Functions ─────────────────────────────────────────────────────────

def _serialize_education(item: EducationContent) -> dict:
    return {
        "content_id": item.content_id,
        "title": item.title,
        "trimester": item.trimester,
        "category": item.category,
        "body": item.body,
        "status": "published" if item.is_published else "draft",
        "order_in_category": item.order_in_category,
    }


# ─── 1. Assessment Questions ──────────────────────────────────────────────────

@router.get(
    "/admin/assessment-questions",
    response_model=list[AdminQuestionResponse],
)
async def admin_get_questions(
    db: AsyncSession = Depends(get_db),
    _: uuid.UUID = Depends(require_admin),
):
    result = await db.execute(
        select(AssessmentQuestion).order_by(AssessmentQuestion.order_index)
    )
    return result.scalars().all()


@router.post("/admin/assessment-questions",
             response_model=AdminQuestionResponse, status_code=201)
async def admin_create_question(
    payload: UpsertQuestionRequest,
    db: AsyncSession = Depends(get_db),
    _: uuid.UUID = Depends(require_admin),
):
    question = AssessmentQuestion(
        question_text=payload.question_text,
        order_index=payload.order_index,
        is_red_flag=payload.is_red_flag,
        weight=payload.weight,
        category=payload.category,
        is_active=payload.is_active,
    )
    db.add(question)
    await db.flush()
    await db.commit()
    return question


@router.put("/admin/assessment-questions/{question_id}",
            response_model=AdminQuestionResponse)
async def admin_update_question(
    question_id: uuid.UUID,
    payload: UpsertQuestionRequest,
    db: AsyncSession = Depends(get_db),
    _: uuid.UUID = Depends(require_admin),
):
    result = await db.execute(
        select(AssessmentQuestion).where(
            AssessmentQuestion.question_id == question_id
        )
    )
    question = result.scalar_one_or_none()
    if not question:
        raise HTTPException(status_code=404, detail="Pertanyaan tidak ditemukan")

    question.question_text = payload.question_text
    question.order_index   = payload.order_index
    question.is_red_flag   = payload.is_red_flag
    question.weight        = payload.weight
    question.category      = payload.category
    question.is_active     = payload.is_active
    db.add(question)
    await db.commit()
    return question


@router.delete("/admin/assessment-questions/{question_id}", status_code=204)
async def admin_deactivate_question(
    question_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: uuid.UUID = Depends(require_admin),
):
    """Soft delete — set is_active=False, data tetap ada untuk audit trail."""
    result = await db.execute(
        select(AssessmentQuestion).where(
            AssessmentQuestion.question_id == question_id
        )
    )
    question = result.scalar_one_or_none()
    if not question:
        raise HTTPException(status_code=404, detail="Pertanyaan tidak ditemukan")
    question.is_active = False
    db.add(question)
    await db.commit()

# ─── 2. Score Cutoffs ─────────────────────────────────────────────────────────

@router.get("/admin/score-cutoffs", response_model=ScoreCutoffsResponse)
async def admin_get_score_cutoffs(
    db: AsyncSession = Depends(get_db),
    _: uuid.UUID = Depends(require_admin),
):
    result = await db.execute(
        select(RiskThreshold).where(RiskThreshold.is_active == True)
    )
    thresholds = result.scalars().all()
    cutoffs = {t.category.lower(): t for t in thresholds}

    for level in ("low", "medium", "high"):
        if level not in cutoffs:
            raise HTTPException(
                status_code=500,
                detail=f"Threshold '{level}' tidak ditemukan di database. "
                       "Pastikan seed data sudah dijalankan."
            )

    return {
        "low":    {"min_score": cutoffs["low"].min_score,    "max_score": cutoffs["low"].max_score},
        "medium": {"min_score": cutoffs["medium"].min_score, "max_score": cutoffs["medium"].max_score},
        "high":   {"min_score": cutoffs["high"].min_score,   "max_score": cutoffs["high"].max_score},
    }


@router.patch(
    "/admin/score-cutoffs/{category}",
    response_model=ScoreCutoffItem,
)
async def admin_patch_score_cutoff(
    category: str,
    payload: PatchScoreCutoffRequest,
    db: AsyncSession = Depends(get_db),
    _: uuid.UUID = Depends(require_admin),
):
    if category.lower() not in ("low", "medium", "high"):
        raise HTTPException(status_code=422, detail="category harus low, medium, atau high")

    result = await db.execute(
        select(RiskThreshold).where(
            RiskThreshold.category == category.upper(),
            RiskThreshold.is_active == True,
        )
    )
    threshold = result.scalar_one_or_none()
    if not threshold:
        raise HTTPException(status_code=404, detail=f"Threshold '{category}' tidak ditemukan")

    threshold.min_score = payload.min_score
    threshold.max_score = payload.max_score

    db.add(threshold)
    await db.commit()
    await db.refresh(threshold)

    return {
        "min_score": threshold.min_score,
        "max_score": threshold.max_score,
    }

# ─── 3. Education Content ─────────────────────────────────────────────────────

@router.get(
    "/admin/education-content",
    response_model=list[AdminEducationResponse],
)
async def admin_get_education_content(
    db: AsyncSession = Depends(get_db),
    _: uuid.UUID = Depends(require_admin),
):
    result = await db.execute(
        select(EducationContent).order_by(
            EducationContent.trimester, EducationContent.order_in_category
        )
    )
    items = result.scalars().all()
    return [_serialize_education(item) for item in items]


@router.post("/admin/education-content",
             response_model=AdminEducationResponse, status_code=201)
async def admin_create_education(
    payload: UpsertEducationRequest,
    db: AsyncSession = Depends(get_db),
    _: uuid.UUID = Depends(require_admin),
):
    item = EducationContent(
        title=payload.title,
        body=payload.body,
        trimester=payload.trimester,
        category=payload.category,
        order_in_category=payload.order_in_category,
        is_published=payload.is_published,
    )
    db.add(item)
    await db.flush()
    await db.commit()
    return _serialize_education(item)


@router.put("/admin/education-content/{content_id}",
            response_model=AdminEducationResponse)
async def admin_update_education(
    content_id: uuid.UUID,
    payload: UpsertEducationRequest,
    db: AsyncSession = Depends(get_db),
    _: uuid.UUID = Depends(require_admin),
):
    result = await db.execute(
        select(EducationContent).where(EducationContent.content_id == content_id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Konten tidak ditemukan")

    item.title             = payload.title
    item.body              = payload.body
    item.trimester         = payload.trimester
    item.category          = payload.category
    item.order_in_category = payload.order_in_category
    item.is_published      = payload.is_published
    db.add(item)
    await db.commit()
    return _serialize_education(item)


@router.delete("/admin/education-content/{content_id}", status_code=204)
async def admin_delete_education(
    content_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: uuid.UUID = Depends(require_admin),
):
    """Hard delete — konten edukasi tidak perlu soft delete."""
    result = await db.execute(
        select(EducationContent).where(EducationContent.content_id == content_id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Konten tidak ditemukan")
    await db.delete(item)
    await db.commit()


# ─── 4. Checklist Items ───────────────────────────────────────────────────────

@router.get(
    "/admin/checklist-items",
    response_model=list[AdminChecklistResponse],
)
async def admin_get_checklist_items(
    db: AsyncSession = Depends(get_db),
    _: uuid.UUID = Depends(require_admin),
):
    result = await db.execute(
        select(ChecklistItem).order_by(ChecklistItem.order_index)
    )
    return result.scalars().all()


@router.post("/admin/checklist-items",
             response_model=AdminChecklistResponse, status_code=201)
async def admin_create_checklist_item(
    payload: UpsertChecklistItemRequest,
    db: AsyncSession = Depends(get_db),
    _: uuid.UUID = Depends(require_admin),
):
    item = ChecklistItem(
        label=payload.label,
        category=payload.category,
        order_index=payload.order_index,
        is_active=payload.is_active,
    )
    db.add(item)
    await db.flush()
    await db.commit()
    return item


@router.put("/admin/checklist-items/{item_id}",
            response_model=AdminChecklistResponse)
async def admin_update_checklist_item(
    item_id: uuid.UUID,
    payload: UpsertChecklistItemRequest,
    db: AsyncSession = Depends(get_db),
    _: uuid.UUID = Depends(require_admin),
):
    result = await db.execute(
        select(ChecklistItem).where(ChecklistItem.item_id == item_id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item tidak ditemukan")

    item.label       = payload.label
    item.category    = payload.category
    item.order_index = payload.order_index
    item.is_active   = payload.is_active
    db.add(item)
    await db.commit()
    return item


@router.delete("/admin/checklist-items/{item_id}", status_code=204)
async def admin_deactivate_checklist_item(
    item_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: uuid.UUID = Depends(require_admin),
):
    """Soft delete — is_active=False agar checklist_logs history tidak orphan."""
    result = await db.execute(
        select(ChecklistItem).where(ChecklistItem.item_id == item_id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item tidak ditemukan")
    item.is_active = False
    db.add(item)
    await db.commit()


# ─── 5. Referral Mapping ─────────────────────────────────────────────────────

@router.get(
    "/admin/referral-mapping",
    response_model=list[ReferralResponse],
)
async def admin_get_referral_mappings(
    db: AsyncSession = Depends(get_db),
    _: uuid.UUID = Depends(require_admin),
):
    return await referral_crud.get_all_referrals(db)


@router.put(
    "/admin/referral-mapping/{risk_level}",
    response_model=ReferralResponse,
)
async def admin_update_referral_mapping(
    risk_level: str,
    payload: UpsertReferralRequest,
    db: AsyncSession = Depends(get_db),
    _: uuid.UUID = Depends(require_admin),
):
    if risk_level.upper() not in VALID_RISK_LEVELS:
        raise HTTPException(
            status_code=422,
            detail=f"risk_level harus salah satu dari: {VALID_RISK_LEVELS}",
        )
    return await referral_crud.upsert_referral(
        db=db,
        risk_level=risk_level,
        facility_type=payload.facility_type,
        recommendation=payload.recommendation,
        urgency_label=payload.urgency_label,
    )