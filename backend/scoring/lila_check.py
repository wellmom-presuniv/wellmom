"""
Klasifikasi Lingkar Lengan Atas (LiLA) ibu hamil.

Acuan: Buku KIA 2024 hal. 12 (konfirmasi Chelsea):
- LiLA >= 23,5 cm -> normal / tidak berisiko KEK
- LiLA <  23,5 cm -> berisiko KEK (Kurang Energi Kronis)

Informasional saja -- tidak mempengaruhi risk_category self-assessment.
"""

LILA_KEK_CUTOFF_CM = 23.5

LILA_NORMAL = "NORMAL"
LILA_KEK_RISK = "KEK_RISK"


def check_lila(lila_cm: float) -> dict:
    if lila_cm >= LILA_KEK_CUTOFF_CM:
        return {
            "status": LILA_NORMAL,
            "message": "LiLA normal (≥ 23,5 cm), tidak berisiko KEK.",
        }
    return {
        "status": LILA_KEK_RISK,
        "message": (
            "LiLA < 23,5 cm: berisiko KEK (Kurang Energi Kronis). "
            "Konsultasikan dengan tenaga kesehatan untuk pemeriksaan dan "
            "tambahan asupan gizi."
        ),
    }
