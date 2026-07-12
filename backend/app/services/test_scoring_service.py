"""
Unit test untuk logic compute_risk.
Fungsi di-copy langsung dari scoring_service.py biar tidak
perlu import chain ke app.models/database/config.
Kalau scoring_service.py diubah, update fungsi di sini juga.
"""
from unittest.mock import MagicMock


# ── Copy fungsi compute_risk dari scoring_service.py ──────────────────────

def compute_risk(answers, questions, thresholds):
    question_map = {q.question_id: q for q in questions}

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
            "total_score": None,
        }

    total_score = sum(
        question_map[item["question_id"]].weight
        for item in answers
        if item["answer"] and question_map.get(item["question_id"])
        and not question_map[item["question_id"]].is_red_flag
    )

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


# ── Helper ─────────────────────────────────────────────────────────────────

def make_question(question_id, question_text, weight, is_red_flag):
    q = MagicMock()
    q.question_id = question_id
    q.question_text = question_text
    q.weight = weight
    q.is_red_flag = is_red_flag
    return q


def make_threshold(min_score, max_score, category):
    t = MagicMock()
    t.min_score = min_score
    t.max_score = max_score
    t.category = category
    return t


# ── Data dummy ─────────────────────────────────────────────────────────────

QUESTIONS = [
    make_question("q1", "Mudah lelah berlebihan?", 1, False),
    make_question("q2", "Pusing atau mata berkunang?", 1, False),
    make_question("q3", "Mual muntah terus-menerus?", 1, False),
    make_question("q4", "Tidak konsumsi tablet tambah darah?", 1, False),
    make_question("q5", "Perdarahan atau flek?", 0, True),
    make_question("q6", "Sakit kepala berat?", 0, True),
    make_question("q7", "Bengkak pada wajah/tangan?", 0, True),
    make_question("q8", "Gerakan janin berkurang (trimester lanjut)?", 0, True),
]

THRESHOLDS = [
    make_threshold(0, 2, "LOW"),
    make_threshold(3, 4, "MEDIUM"),
    make_threshold(5, 999, "HIGH"),
]


# ── Test cases ─────────────────────────────────────────────────────────────

def test_all_no():
    answers = [{"question_id": f"q{i}", "answer": False} for i in range(1, 9)]
    result = compute_risk(answers, QUESTIONS, THRESHOLDS)
    assert result["risk_category"] == "LOW"
    assert result["red_flag_triggered"] == False
    assert result["total_score"] == 0
    assert result["triggered_red_flags"] == []
    print("✅ test_all_no passed")


def test_score_low_boundary():
    answers = [
        {"question_id": "q1", "answer": True},
        {"question_id": "q2", "answer": True},
        {"question_id": "q3", "answer": False},
        {"question_id": "q4", "answer": False},
        {"question_id": "q5", "answer": False},
        {"question_id": "q6", "answer": False},
        {"question_id": "q7", "answer": False},
        {"question_id": "q8", "answer": False},
    ]
    result = compute_risk(answers, QUESTIONS, THRESHOLDS)
    assert result["risk_category"] == "LOW"
    assert result["total_score"] == 2
    print("✅ test_score_low_boundary passed")


def test_score_medium():
    answers = [
        {"question_id": "q1", "answer": True},
        {"question_id": "q2", "answer": True},
        {"question_id": "q3", "answer": True},
        {"question_id": "q4", "answer": False},
        {"question_id": "q5", "answer": False},
        {"question_id": "q6", "answer": False},
        {"question_id": "q7", "answer": False},
        {"question_id": "q8", "answer": False},
    ]
    result = compute_risk(answers, QUESTIONS, THRESHOLDS)
    assert result["risk_category"] == "MEDIUM"
    assert result["total_score"] == 3
    print("✅ test_score_medium passed")


def test_score_medium_boundary():
    answers = [
        {"question_id": "q1", "answer": True},
        {"question_id": "q2", "answer": True},
        {"question_id": "q3", "answer": True},
        {"question_id": "q4", "answer": True},
        {"question_id": "q5", "answer": False},
        {"question_id": "q6", "answer": False},
        {"question_id": "q7", "answer": False},
        {"question_id": "q8", "answer": False},
    ]
    result = compute_risk(answers, QUESTIONS, THRESHOLDS)
    assert result["risk_category"] == "MEDIUM"
    assert result["total_score"] == 4
    print("✅ test_score_medium_boundary passed")


def test_red_flag_single():
    answers = [
        {"question_id": "q1", "answer": False},
        {"question_id": "q2", "answer": False},
        {"question_id": "q3", "answer": False},
        {"question_id": "q4", "answer": False},
        {"question_id": "q5", "answer": True},
        {"question_id": "q6", "answer": False},
        {"question_id": "q7", "answer": False},
        {"question_id": "q8", "answer": False},
    ]
    result = compute_risk(answers, QUESTIONS, THRESHOLDS)
    assert result["risk_category"] == "HIGH"
    assert result["red_flag_triggered"] == True
    assert result["total_score"] is None
    assert len(result["triggered_red_flags"]) == 1
    assert result["triggered_red_flags"][0]["question_id"] == "q5"
    print("✅ test_red_flag_single passed")


def test_red_flag_multiple():
    answers = [
        {"question_id": "q1", "answer": False},
        {"question_id": "q2", "answer": False},
        {"question_id": "q3", "answer": False},
        {"question_id": "q4", "answer": False},
        {"question_id": "q5", "answer": True},
        {"question_id": "q6", "answer": True},
        {"question_id": "q7", "answer": False},
        {"question_id": "q8", "answer": False},
    ]
    result = compute_risk(answers, QUESTIONS, THRESHOLDS)
    assert result["risk_category"] == "HIGH"
    assert result["red_flag_triggered"] == True
    assert result["total_score"] is None
    assert len(result["triggered_red_flags"]) == 2
    print("✅ test_red_flag_multiple passed")


def test_red_flag_overrides_low_score():
    answers = [
        {"question_id": "q1", "answer": True},
        {"question_id": "q2", "answer": False},
        {"question_id": "q3", "answer": False},
        {"question_id": "q4", "answer": False},
        {"question_id": "q5", "answer": False},
        {"question_id": "q6", "answer": False},
        {"question_id": "q7", "answer": True},
        {"question_id": "q8", "answer": False},
    ]
    result = compute_risk(answers, QUESTIONS, THRESHOLDS)
    assert result["risk_category"] == "HIGH"
    assert result["red_flag_triggered"] == True
    assert result["total_score"] is None
    print("✅ test_red_flag_overrides_low_score passed")


# ── Run all tests ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    test_all_no()
    test_score_low_boundary()
    test_score_medium()
    test_score_medium_boundary()
    test_red_flag_single()
    test_red_flag_multiple()
    test_red_flag_overrides_low_score()
    print("\n🎉 Semua test passed!")