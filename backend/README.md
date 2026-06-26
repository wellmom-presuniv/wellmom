# WellMom Backend

FastAPI + PostgreSQL. Reuse auth system (JWT) dari project sebelumnya (ErgoAlert).

## Status

Belum di-setup — ini placeholder folder. Alek, silakan init project di sini (`uvicorn`, struktur folder `app/`, dst) sesuai konvensi yang biasa dipakai.

## Yang perlu diingat dari diskusi tim

- Schema harus generic/config-driven untuk modul yang kontennya masih bisa berubah (assessment_questions, education_content, risk_thresholds) — baca dokumen "Scoring Engine Design" dari Arizal di Notion sebagai acuan.
- Modul Monitoring (BB/TB ibu+bayi) masih `[BLOCKED]` — bikin struktur tabel generic dulu, jangan isi data referensi sampai dr. Nucky kasih tabel WHO/Kemenkes.
