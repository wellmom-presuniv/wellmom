from head_circumference_info import get_head_circumference_info


def test_returns_correct_reference_range():
    """Rentang referensi harus 33-35 cm sesuai konfirmasi Chelsea"""
    result = get_head_circumference_info()
    assert result["reference_min_cm"] == 33
    assert result["reference_max_cm"] == 35
    print("✅ test_returns_correct_reference_range passed")


def test_info_text_format():
    """Teks info harus sesuai format yang ditampilkan ke user"""
    result = get_head_circumference_info()
    assert result["info_text"] == "Referensi lingkar kepala bayi saat lahir: 33-35 cm"
    print("✅ test_info_text_format passed")


def test_is_evaluated_flag_is_false():
    """Penanda is_evaluated harus False -- ini BUKAN warning system,
    beda dari fetal_weight_check.py yang punya status evaluasi"""
    result = get_head_circumference_info()
    assert result["is_evaluated"] == False
    print("✅ test_is_evaluated_flag_is_false passed")


def test_no_status_field_exists():
    """Pastikan TIDAK ada field 'status' seperti di fetal_weight_check.py -- 
    ini menegaskan modul ini murni info, tidak ada hasil evaluasi apapun"""
    result = get_head_circumference_info()
    assert "status" not in result
    print("✅ test_no_status_field_exists passed")


if __name__ == "__main__":
    test_returns_correct_reference_range()
    test_info_text_format()
    test_is_evaluated_flag_is_false()
    test_no_status_field_exists()
    print("\n🎉 Semua test passed!")