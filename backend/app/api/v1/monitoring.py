import uuid

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user_id, get_db
from app.schemas.monitoring import (
    FetalWeightLogRequest,
    FetalWeightLogResponse,
    GrowthEvaluateRequest,
    GrowthEvaluateResponse,
    HeadCircumferenceLogRequest,
    HeadCircumferenceLogResponse,
    MaternalLogRequest,
    MaternalLogResponse,
    MonitoringHistoryItem,
    MonitoringType,
)
from app.services import monitoring_service


router = APIRouter()


@router.post(
    "/monitoring/fetal-weight/log",
    response_model=FetalWeightLogResponse,
    status_code=201,
)
async def log_fetal_weight(
    payload: FetalWeightLogRequest,
    db: AsyncSession = Depends(get_db),
    user_id: uuid.UUID = Depends(get_current_user_id),
):
    return await monitoring_service.log_fetal_weight(
        db=db,
        user_id=user_id,
        payload=payload,
    )


@router.post(
    "/monitoring/head-circumference/log",
    response_model=HeadCircumferenceLogResponse,
    status_code=201,
)
async def log_head_circumference(
    payload: HeadCircumferenceLogRequest,
    db: AsyncSession = Depends(get_db),
    user_id: uuid.UUID = Depends(get_current_user_id),
):
    return await monitoring_service.log_head_circumference(
        db=db,
        user_id=user_id,
        payload=payload,
    )


@router.post(
    "/monitoring/maternal/log",
    response_model=MaternalLogResponse,
    status_code=201,
)
async def log_maternal_measurement(
    payload: MaternalLogRequest,
    db: AsyncSession = Depends(get_db),
    user_id: uuid.UUID = Depends(get_current_user_id),
):
    return await monitoring_service.log_maternal_measurement(
        db=db,
        user_id=user_id,
        payload=payload,
    )


@router.post(
    "/monitoring/growth/evaluate",
    response_model=GrowthEvaluateResponse,
    status_code=201,
)
async def evaluate_growth(
    payload: GrowthEvaluateRequest,
    db: AsyncSession = Depends(get_db),
    user_id: uuid.UUID = Depends(get_current_user_id),
):
    return await monitoring_service.evaluate_and_log_growth(
        db=db,
        user_id=user_id,
        payload=payload,
    )


@router.get(
    "/monitoring/history",
    response_model=list[MonitoringHistoryItem],
)
async def get_monitoring_history(
    record_type: MonitoringType = Query(alias="type"),
    limit: int = Query(default=30, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
    user_id: uuid.UUID = Depends(get_current_user_id),
):
    return await monitoring_service.get_monitoring_history(
        db=db,
        user_id=user_id,
        record_type=record_type,
        limit=limit,
        offset=offset,
    )


@router.delete(
    "/monitoring/{record_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_monitoring_record(
    record_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user_id: uuid.UUID = Depends(get_current_user_id),
):
    await monitoring_service.delete_monitoring_record(
        db=db,
        user_id=user_id,
        record_id=record_id,
    )

    return Response(status_code=status.HTTP_204_NO_CONTENT)