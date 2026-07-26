import uuid
from datetime import date

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.schemas.monitoring import (
    BiologicalSex,
    FetalWeightLogRequest,
    GrowthEvaluateRequest,
    GrowthIndicator,
    HeadCircumferenceLogRequest,
    MaternalLogRequest,
    MonitoringType,
)
from app.services.pregnancy_service import _compute_stats
from app.crud import monitoring as monitoring_crud
from scoring.fetal_weight_check import check_fetal_weight
from scoring.growth_zscore import Indicator, evaluate_growth
from scoring.head_circumference_info import get_head_circumference_info


def _resolve_measurement_date(measurement_date: date | None) -> date:
    selected_date = measurement_date or date.today()

    if selected_date > date.today():
        raise HTTPException(
            status_code=422,
            detail="Tanggal pengukuran tidak boleh di masa depan",
        )

    return selected_date


async def _require_pregnancy_profile(
    db: AsyncSession,
    user_id: uuid.UUID,
    measurement_date: date,
):
    profile = await crud.pregnancy.get_active_profile(db, user_id)

    if not profile:
        raise HTTPException(
            status_code=404,
            detail=(
                "Profil kehamilan belum dibuat. "
                "Selesaikan onboarding terlebih dahulu."
            ),
        )

    if profile.hpht is None or profile.hpl is None:
        raise HTTPException(
            status_code=422,
            detail="Data HPHT/HPL pada profil kehamilan belum lengkap",
        )

    stats = _compute_stats(
        hpht=profile.hpht,
        hpl=profile.hpl,
        today=measurement_date,
    )

    return profile, stats


async def _require_trimester_three_profile(
    db: AsyncSession,
    user_id: uuid.UUID,
    measurement_date: date,
):
    profile, stats = await _require_pregnancy_profile(
        db=db,
        user_id=user_id,
        measurement_date=measurement_date,
    )

    if stats["trimester"] != 3:
        raise HTTPException(
            status_code=422,
            detail="Monitoring ini hanya tersedia pada trimester 3",
        )

    return profile


async def log_fetal_weight(
    db: AsyncSession,
    user_id: uuid.UUID,
    payload: FetalWeightLogRequest,
) -> dict:
    measurement_date = _resolve_measurement_date(payload.measurement_date)

    profile, stats = await _require_pregnancy_profile(
        db=db,
        user_id=user_id,
        measurement_date=measurement_date,
    )

    weight_kg = payload.weight_grams / 1000

    evaluation = (
        check_fetal_weight(weight_kg)
        if stats["trimester"] == 3
        else None
    )

    record = await monitoring_crud.create_record(
        db=db,
        user_id=user_id,
        pregnancy_profile_id=profile.profile_id,
        record_type=MonitoringType.FETAL_WEIGHT.value,
        check_date=measurement_date,
        fetal_weight_grams=payload.weight_grams,
        evaluation_status=(
            evaluation["status"]
            if evaluation is not None
            else None
        ),
        evaluation_message=(
            evaluation["message"]
            if evaluation is not None
            else None
        ),
    )

    return {
        "record_id": record.record_id,
        "date": record.check_date,
        "weight_grams": record.fetal_weight_grams,
        "status": record.evaluation_status,
        "message": record.evaluation_message,
    }


async def log_head_circumference(
    db: AsyncSession,
    user_id: uuid.UUID,
    payload: HeadCircumferenceLogRequest,
) -> dict:
    measurement_date = _resolve_measurement_date(payload.measurement_date)

    profile, _ = await _require_pregnancy_profile(
        db=db,
        user_id=user_id,
        measurement_date=measurement_date,
    )

    info = get_head_circumference_info()

    record = await monitoring_crud.create_record(
        db=db,
        user_id=user_id,
        pregnancy_profile_id=profile.profile_id,
        record_type=MonitoringType.HEAD_CIRC.value,
        check_date=measurement_date,
        head_circumference_cm=payload.head_circumference_cm,
        evaluation_message=info["info_text"],
    )

    return {
        "record_id": record.record_id,
        "date": record.check_date,
        "head_circumference_cm": record.head_circumference_cm,
        "normal_range": (
            f"{info['reference_min_cm']}-"
            f"{info['reference_max_cm']} cm"
        ),
        "message": info["info_text"],
        "is_evaluated": info["is_evaluated"],
    }


async def log_maternal_measurement(
    db: AsyncSession,
    user_id: uuid.UUID,
    payload: MaternalLogRequest,
) -> dict:
    measurement_date = _resolve_measurement_date(payload.measurement_date)

    profile, _ = await _require_pregnancy_profile(
        db=db,
        user_id=user_id,
        measurement_date=measurement_date,
    )

    record = await monitoring_crud.create_record(
        db=db,
        user_id=user_id,
        pregnancy_profile_id=profile.profile_id,
        record_type=MonitoringType.MATERNAL.value,
        check_date=measurement_date,
        maternal_weight_kg=payload.weight_kg,
        maternal_height_cm=payload.height_cm,
    )

    return {
        "record_id": record.record_id,
        "date": record.check_date,
        "weight_kg": record.maternal_weight_kg,
        "height_cm": record.maternal_height_cm,
    }


async def evaluate_and_log_growth(
    db: AsyncSession,
    user_id: uuid.UUID,
    payload: GrowthEvaluateRequest,
) -> dict:
    measurement_date = _resolve_measurement_date(payload.measurement_date)

    result = evaluate_growth(
        indicator=Indicator(payload.indicator.value),
        value=payload.value,
        age_months=payload.age_months,
        sex=payload.sex.value,
    )

    if result.get("error"):
        raise HTTPException(
            status_code=422,
            detail=result["error"],
        )

    record = await monitoring_crud.create_record(
        db=db,
        user_id=user_id,
        pregnancy_profile_id=None,
        record_type=MonitoringType.GROWTH.value,
        check_date=measurement_date,
        growth_indicator=payload.indicator.value,
        measurement_value=payload.value,
        age_months=payload.age_months,
        sex=payload.sex.value,
        evaluation_status=result["zone"],
        z_score=result["z_score"],
        reference_month_used=result["reference_month_used"],
    )

    return {
        "record_id": record.record_id,
        "date": record.check_date,
        "indicator": record.growth_indicator,
        "value": record.measurement_value,
        "age_months": record.age_months,
        "sex": record.sex,
        "z_score": record.z_score,
        "zone": record.evaluation_status,
        "reference_month_used": record.reference_month_used,
    }


async def get_monitoring_history(
    db: AsyncSession,
    user_id: uuid.UUID,
    record_type: MonitoringType,
    limit: int = 30,
    offset: int = 0,
) -> list[dict]:
    records = await monitoring_crud.get_history(
        db=db,
        user_id=user_id,
        record_type=record_type.value,
        limit=limit,
        offset=offset,
    )

    history = []

    for record in records:
        history.append(
            {
                "record_id": record.record_id,
                "date": record.check_date,
                "type": record.record_type,

                "fetal_weight_grams": record.fetal_weight_grams,
                "head_circumference_cm": record.head_circumference_cm,

                "maternal_weight_kg": record.maternal_weight_kg,
                "maternal_height_cm": record.maternal_height_cm,

                "indicator": record.growth_indicator,
                "value": record.measurement_value,
                "age_months": record.age_months,
                "sex": record.sex,

                "status": (
                    record.evaluation_status
                    if record.record_type == MonitoringType.FETAL_WEIGHT.value
                    else None
                ),
                "zone": (
                    record.evaluation_status
                    if record.record_type == MonitoringType.GROWTH.value
                    else None
                ),
                "message": record.evaluation_message,
                "z_score": record.z_score,
                "reference_month_used": record.reference_month_used,
            }
        )

    return history