from dataclasses import dataclass, field
from enum import Enum
from typing import Optional


# ── Enums ──────────────────────────────────────────────────────────────────

class RiskCategory(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class BPStatus(str, Enum):
    NOT_PROVIDED = "NOT_PROVIDED"
    PENDING_THRESHOLD = "PENDING_THRESHOLD"
    NORMAL = "NORMAL"
    FLAGGED = "FLAGGED"


# ── Data classes (representasi data dari DB) ───────────────────────────────

@dataclass
class Question:
    id: str
    question_text: str
    weight: int
    is_red_flag: bool
    is_active: bool
    order_index: int


@dataclass
class AnswerItem:
    question_id: str
    answer: bool


@dataclass
class RiskThreshold:
    min_score: int
    max_score: int
    category: RiskCategory


# ── Output ─────────────────────────────────────────────────────────────────

@dataclass
class ScoringResult:
    risk_category: RiskCategory
    red_flag_triggered: bool
    triggered_red_flags: list[dict]  # list of { question_id, question_text }
    total_score: Optional[int]
    bp_assessment_status: BPStatus


# ── Scoring Engine ─────────────────────────────────────────────────────────

def calculate_risk(
    answers: list[AnswerItem],
    questions: list[Question],
    thresholds: list[RiskThreshold],
    systolic_bp: Optional[int] = None,
    diastolic_bp: Optional[int] = None,
) -> ScoringResult:

    # Buat lookup question by id
    question_map = {q.id: q for q in questions if q.is_active}

    # STEP 1 — Red flag check
    triggered_red_flags = []
    for item in answers:
        question = question_map.get(item.question_id)
        if question and question.is_red_flag and item.answer:
            triggered_red_flags.append({
                "question_id": question.id,
                "question_text": question.question_text,
            })

    if triggered_red_flags:
        return ScoringResult(
            risk_category=RiskCategory.HIGH,
            red_flag_triggered=True,
            triggered_red_flags=triggered_red_flags,
            total_score=None,
            bp_assessment_status=_get_bp_status(systolic_bp, diastolic_bp),
        )

    # STEP 2 — Score accumulation
    total_score = sum(
        question_map[item.question_id].weight
        for item in answers
        if item.question_id in question_map
        and not question_map[item.question_id].is_red_flag
        and item.answer
    )

    # STEP 3 — Category lookup dari thresholds
    risk_category = _get_category(total_score, thresholds)

    return ScoringResult(
        risk_category=risk_category,
        red_flag_triggered=False,
        triggered_red_flags=[],
        total_score=total_score,
        bp_assessment_status=_get_bp_status(systolic_bp, diastolic_bp),
    )


# ── Helpers ────────────────────────────────────────────────────────────────

def _get_bp_status(systolic: Optional[int], diastolic: Optional[int]) -> BPStatus:
    if systolic is None or diastolic is None:
        return BPStatus.NOT_PROVIDED
    # TODO: pending dr. Nucky confirmation — threshold belum dikonfirmasi
    return BPStatus.PENDING_THRESHOLD


def _get_category(score: int, thresholds: list[RiskThreshold]) -> RiskCategory:
    for threshold in thresholds:
        if threshold.min_score <= score <= threshold.max_score:
            return threshold.category
    # Fallback kalau score di luar semua range
    return RiskCategory.HIGH