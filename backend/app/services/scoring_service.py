"""
Scoring engine — config-driven, membaca semua parameter dari DB.
Owner: Arizal. Jangan ubah logic ini tanpa koordinasi dengan Arizal.
"""
from app.models.assessment import AssessmentQuestion
from app.models.risk_threshold import RiskThreshold


def compute_risk(
    answers: list[dict],
    questions: list[AssessmentQuestion],
    thresholds: list[RiskThreshold],
) -> dict:
    """
    answers: list of {"question_id": UUID, "answer": bool}
    Mengembalikan dict hasil scoring sebelum disimpan ke DB.
    """
    question_map = {q.question_id: q for q in questions}

    # ── Step 1: Red flag check ─────────────────────────────────────────────
    triggered_red_flags = []
    for item in answers:
        q = question_map.get(item["question_id"])
        if q and q.is_red_flag and item["answer"]:
            triggered_red_flags.append({
                "question_id": str(q.question_id),
                "question_text": q.question_text,
            })

    if triggered_red_flags:
        return {
            "risk_category": "HIGH",
            "red_flag_triggered": True,
            "triggered_red_flags": triggered_red_flags,
            "total_score": None,   # Skor tidak dihitung bila red flag trigger
        }

    # ── Step 2: Score accumulation ─────────────────────────────────────────
    total_score = sum(
        question_map[item["question_id"]].weight
        for item in answers
        if item["answer"] and question_map.get(item["question_id"])
        and not question_map[item["question_id"]].is_red_flag
    )

    # ── Step 3: Category lookup dari DB ───────────────────────────────────
    risk_category = "LOW"
    for threshold in sorted(thresholds, key=lambda t: t.min_score):
        if threshold.min_score <= total_score <= threshold.max_score:
            risk_category = threshold.category
            break

    return {
        "risk_category": risk_category,
        "red_flag_triggered": False,
        "triggered_red_flags": [],
        "total_score": total_score,
    }