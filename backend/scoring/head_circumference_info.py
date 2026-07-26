"""
Info lingkar kepala janin trimester 3 -- MURNI TAMPILAN INFORMASI, 
BUKAN evaluasi/warning system.

Keputusan (confirmed Chelsea, 11 Juli 2026): head circumference cuma 
ditampilkan sebagai referensi angka, TIDAK dievaluasi jadi status 
kurang/normal/lebih seperti berat badan. Alasan: saran pembimbing 
klinis untuk tidak overclaim pada hal yang berhubungan dengan 
keselamatan maternal tanpa dasar riset yang matang.

Ini BEDA arsitektur dari fetal_weight_check.py -- tidak ada fungsi 
evaluasi, tidak ada enum status, cuma data statis untuk ditampilkan FE.

Owner: Arizal.
"""

# Rentang referensi (confirmed Chelsea, BUKAN threshold evaluasi -- 
# murni info untuk ditampilkan apa adanya)
HEAD_CIRCUMFERENCE_REFERENCE_CM = {
    "min": 33,
    "max": 35,
}


def get_head_circumference_info() -> dict:
    """
    Ambil info referensi lingkar kepala trimester 3 untuk ditampilkan FE.
    
    TIDAK menerima input pengukuran, TIDAK mengevaluasi apapun -- fungsi 
    ini cuma mengembalikan teks info statis. Kalau nanti FE mau tampilkan 
    input lingkar kepala dari user, itu sekadar disimpan sebagai data 
    (misal untuk riwayat), bukan dibandingkan/dinilai oleh sistem.
    
    Returns:
        dict berisi rentang referensi dan teks info siap tampil
    """
    min_cm = HEAD_CIRCUMFERENCE_REFERENCE_CM["min"]
    max_cm = HEAD_CIRCUMFERENCE_REFERENCE_CM["max"]
    
    return {
        "reference_min_cm": min_cm,
        "reference_max_cm": max_cm,
        "info_text": f"Referensi lingkar kepala bayi saat lahir: {min_cm}-{max_cm} cm",
        "is_evaluated": False,  # penanda eksplisit -- ini BUKAN warning system
    }