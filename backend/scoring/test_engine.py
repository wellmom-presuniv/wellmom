from engine import (
    Question, AnswerItem, RiskThreshold,
    RiskCategory, BPStatus,
    calculate_risk
)

# ── Data dummy (simulasi data dari DB) ─────────────────────────────────────

QUESTIONS = [
    Question(id="q1", question_text="Mudah lelah berlebihan?",
             weight=1, is_red_flag=False, is_active=True, order_index=1),
    Question(id="q2", question_text="Pusing atau mata berkunang?",
             weight=1, is_red_flag=False, is_active=True, order_index=2),
    Question(id="q3", question_text="Mual muntah terus-menerus?",
             weight=1, is_red_flag=False, is_active=True, order_index=3),
    Question(id="q4", question_text="Tidak konsumsi tablet tambah darah?",
             weight=1, is_red_flag=False, is_active=True, order_index=4),
    Question(id="q5", question_text="Perdarahan atau flek?",
             weight=0, is_red_flag=True, is_active=True, order_index=5),
    Question(id="q6", question_text="Sakit kepala berat?",
             weight=0, is_red_flag=True, is_active=True, order_index=6),
    Question(id="q7", question_text="Bengkak pada wajah/tangan?",
             weight=0, is_red_flag=True, is_active=True, order_index=7),
    Question(id="q8", question_text="Gerakan janin berkurang (trimester lanjut)?",
             weight=0, is_red_flag=True, is_active=True, order_index=8),
]

THRESHOLDS = [
    RiskThreshold(min_score=0, max_score=2, category=RiskCategory.LOW),
    RiskThreshold(min_score=3, max_score=4, category=RiskCategory.MEDIUM),
    RiskThreshold(min_score=5, max_score=999, category=RiskCategory.HIGH),
]


# ── Test cases ─────────────────────────────────────────────────────────────

def test_all_no():
    """Semua jawaban Tidak → LOW, skor 0"""
    answers = [AnswerItem(question_id=f"q{i}", answer=False) for i in range(1, 9)]
    result = calculate_risk(answers, QUESTIONS, THRESHOLDS)
    assert result.risk_category == RiskCategory.LOW
    assert result.red_flag_triggered == False
    assert result.total_score == 0
    assert result.triggered_red_flags == []
    print("✅ test_all_no passed")


def test_score_low_boundary():
    """2 jawaban Ya di non-red-flag → LOW (batas atas LOW = 2)"""
    answers = [
        AnswerItem(question_id="q1", answer=True),
        AnswerItem(question_id="q2", answer=True),
        AnswerItem(question_id="q3", answer=False),
        AnswerItem(question_id="q4", answer=False),
        AnswerItem(question_id="q5", answer=False),
        AnswerItem(question_id="q6", answer=False),
        AnswerItem(question_id="q7", answer=False),
        AnswerItem(question_id="q8", answer=False),
    ]
    result = calculate_risk(answers, QUESTIONS, THRESHOLDS)
    assert result.risk_category == RiskCategory.LOW
    assert result.red_flag_triggered == False
    assert result.total_score == 2
    print("✅ test_score_low_boundary passed")


def test_score_medium():
    """3 jawaban Ya di non-red-flag → MEDIUM"""
    answers = [
        AnswerItem(question_id="q1", answer=True),
        AnswerItem(question_id="q2", answer=True),
        AnswerItem(question_id="q3", answer=True),
        AnswerItem(question_id="q4", answer=False),
        AnswerItem(question_id="q5", answer=False),
        AnswerItem(question_id="q6", answer=False),
        AnswerItem(question_id="q7", answer=False),
        AnswerItem(question_id="q8", answer=False),
    ]
    result = calculate_risk(answers, QUESTIONS, THRESHOLDS)
    assert result.risk_category == RiskCategory.MEDIUM
    assert result.red_flag_triggered == False
    assert result.total_score == 3
    print("✅ test_score_medium passed")


def test_score_medium_boundary():
    """4 jawaban Ya di non-red-flag → MEDIUM (batas atas MEDIUM = 4)"""
    answers = [
        AnswerItem(question_id="q1", answer=True),
        AnswerItem(question_id="q2", answer=True),
        AnswerItem(question_id="q3", answer=True),
        AnswerItem(question_id="q4", answer=True),
        AnswerItem(question_id="q5", answer=False),
        AnswerItem(question_id="q6", answer=False),
        AnswerItem(question_id="q7", answer=False),
        AnswerItem(question_id="q8", answer=False),
    ]
    result = calculate_risk(answers, QUESTIONS, THRESHOLDS)
    assert result.risk_category == RiskCategory.MEDIUM
    assert result.red_flag_triggered == False
    assert result.total_score == 4
    print("✅ test_score_medium_boundary passed")


def test_red_flag_single():
    """1 red flag trigger → langsung HIGH, skor tidak dihitung"""
    answers = [
        AnswerItem(question_id="q1", answer=False),
        AnswerItem(question_id="q2", answer=False),
        AnswerItem(question_id="q3", answer=False),
        AnswerItem(question_id="q4", answer=False),
        AnswerItem(question_id="q5", answer=True),  # red flag
        AnswerItem(question_id="q6", answer=False),
        AnswerItem(question_id="q7", answer=False),
        AnswerItem(question_id="q8", answer=False),
    ]
    result = calculate_risk(answers, QUESTIONS, THRESHOLDS)
    assert result.risk_category == RiskCategory.HIGH
    assert result.red_flag_triggered == True
    assert result.total_score is None
    assert len(result.triggered_red_flags) == 1
    assert result.triggered_red_flags[0]["question_id"] == "q5"
    print("✅ test_red_flag_single passed")


def test_red_flag_multiple():
    """Beberapa red flag trigger sekaligus → semua tercatat di list"""
    answers = [
        AnswerItem(question_id="q1", answer=False),
        AnswerItem(question_id="q2", answer=False),
        AnswerItem(question_id="q3", answer=False),
        AnswerItem(question_id="q4", answer=False),
        AnswerItem(question_id="q5", answer=True),  # red flag
        AnswerItem(question_id="q6", answer=True),  # red flag
        AnswerItem(question_id="q7", answer=False),
        AnswerItem(question_id="q8", answer=False),
    ]
    result = calculate_risk(answers, QUESTIONS, THRESHOLDS)
    assert result.risk_category == RiskCategory.HIGH
    assert result.red_flag_triggered == True
    assert result.total_score is None
    assert len(result.triggered_red_flags) == 2
    print("✅ test_red_flag_multiple passed")


def test_red_flag_overrides_low_score():
    """Red flag trigger meski skor non-red-flag rendah → tetap HIGH"""
    answers = [
        AnswerItem(question_id="q1", answer=True),   # skor +1
        AnswerItem(question_id="q2", answer=False),
        AnswerItem(question_id="q3", answer=False),
        AnswerItem(question_id="q4", answer=False),
        AnswerItem(question_id="q5", answer=False),
        AnswerItem(question_id="q6", answer=False),
        AnswerItem(question_id="q7", answer=True),   # red flag
        AnswerItem(question_id="q8", answer=False),
    ]
    result = calculate_risk(answers, QUESTIONS, THRESHOLDS)
    assert result.risk_category == RiskCategory.HIGH
    assert result.red_flag_triggered == True
    assert result.total_score is None
    print("✅ test_red_flag_overrides_low_score passed")


def test_inactive_question_ignored():
    """Pertanyaan is_active=False tidak masuk scoring"""
    questions_with_inactive = QUESTIONS.copy()
    questions_with_inactive[0] = Question(
        id="q1", question_text="Mudah lelah berlebihan?",
        weight=1, is_red_flag=False, is_active=False, order_index=1
    )
    answers = [
        AnswerItem(question_id="q1", answer=True),  # inactive, harusnya diabaikan
        AnswerItem(question_id="q2", answer=False),
        AnswerItem(question_id="q3", answer=False),
        AnswerItem(question_id="q4", answer=False),
        AnswerItem(question_id="q5", answer=False),
        AnswerItem(question_id="q6", answer=False),
        AnswerItem(question_id="q7", answer=False),
        AnswerItem(question_id="q8", answer=False),
    ]
    result = calculate_risk(answers, questions_with_inactive, THRESHOLDS)
    assert result.total_score == 0
    assert result.risk_category == RiskCategory.LOW
    print("✅ test_inactive_question_ignored passed")


def test_bp_not_provided():
    """Tensi tidak diisi → NOT_PROVIDED"""
    answers = [AnswerItem(question_id=f"q{i}", answer=False) for i in range(1, 9)]
    result = calculate_risk(answers, QUESTIONS, THRESHOLDS)
    assert result.bp_assessment_status == BPStatus.NOT_PROVIDED
    print("✅ test_bp_not_provided passed")


def test_bp_pending_threshold():
    """Tensi diisi → PENDING_THRESHOLD (threshold belum confirmed dr. Nucky)"""
    answers = [AnswerItem(question_id=f"q{i}", answer=False) for i in range(1, 9)]
    result = calculate_risk(answers, QUESTIONS, THRESHOLDS,
                            systolic_bp=120, diastolic_bp=80)
    assert result.bp_assessment_status == BPStatus.PENDING_THRESHOLD
    print("✅ test_bp_pending_threshold passed")


# ── Run all tests ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    test_all_no()
    test_score_low_boundary()
    test_score_medium()
    test_score_medium_boundary()
    test_red_flag_single()
    test_red_flag_multiple()
    test_red_flag_overrides_low_score()
    test_inactive_question_ignored()
    test_bp_not_provided()
    test_bp_pending_threshold()
    print("\n🎉 Semua test passed!")