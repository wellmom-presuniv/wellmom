# WellMom — Backend API

FastAPI + PostgreSQL backend untuk aplikasi **WellMom**: edukasi gizi kehamilan dan deteksi dini risiko kehamilan.

Kolaborasi Fakultas Ilmu Komputer × Fakultas Kedokteran, Universitas Presiden.

---

## Tech Stack

- **Runtime:** Python 3.10+
- **Framework:** FastAPI + Uvicorn
- **Database:** PostgreSQL 13 (via Docker)
- **ORM:** SQLAlchemy (async)
- **Migration:** Alembic
- **Auth:** JWT (python-jose) + bcrypt (passlib)

---

## Prasyarat

- Python 3.10+
- Docker Desktop
- Git

---

## Setup Lokal

### 1. Clone dan masuk ke folder backend

```bash
git clone https://github.com/wellmom-presuniv/wellmom.git
cd wellmom/backend
```

### 2. Buat virtual environment

```bash
python -m venv venv

# Windows (PowerShell)
.\venv\Scripts\Activate.ps1

# macOS / Linux
source venv/bin/activate
```

> **Windows:** Kalau muncul error execution policy, jalankan sekali:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Buat file `.env`

Salin dari contoh dan sesuaikan nilainya:

```bash
cp .env.example .env
```

Isi `.env`:

```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/wellmom
SECRET_KEY=ganti-dengan-string-random-panjang
ACCESS_TOKEN_EXPIRE_MINUTES=60
ALGORITHM=HS256
```

> **Jangan commit `.env` ke Git.** File ini sudah masuk `.gitignore`.

### 5. Jalankan PostgreSQL via Docker

```bash
docker-compose up -d
```

Verifikasi container berjalan:

```bash
docker ps
```

Harus ada container `wellmom_db` dengan status `Up`.

### 6. Jalankan migrasi database

```bash
alembic upgrade head
```

Verifikasi tabel terbuat:

```bash
docker exec -it wellmom_db psql -U postgres -d wellmom -c "\dt"
```

### 7. Seed data awal

Jalankan script seed berurutan — **wajib dijalankan setelah migrasi pertama**:

```bash
# Data pertanyaan self-assessment dan risk thresholds
python seed_assessment.py

# Data referral mapping (LOW / MEDIUM / HIGH)
python seed_referral.py

# Data checklist harian
python seed_checklist.py

# Data konten edukasi (placeholder — diganti konten final dari dr. Nucky)
python seed_education.py
```

### 8. Jalankan server

```bash
uvicorn app.main:app --reload
```

Server berjalan di: `http://localhost:8000`

Dokumentasi API (Swagger): `http://localhost:8000/docs`

---

## Struktur Folder

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── admin.py         # CMS endpoints (role: admin)
│   │       ├── assessment.py    # Self-assessment harian
│   │       ├── auth.py          # Register & login
│   │       ├── checklist.py     # Checklist harian
│   │       ├── education.py     # Konten edukasi + referral mobile
│   │       ├── pregnancy.py     # Profil kehamilan
│   │       └── router.py        # Mount semua router
│   ├── core/
│   │   └── security.py          # JWT encode/decode, bcrypt
│   ├── crud/                    # Database queries (no business logic)
│   ├── models/                  # SQLAlchemy ORM models
│   ├── schemas/                 # Pydantic request/response models
│   ├── services/                # Business logic
│   ├── config.py                # Settings dari .env
│   ├── database.py              # Async engine + session
│   └── main.py                  # FastAPI app + middleware
├── alembic/                     # Migration files
├── seed_assessment.py
├── seed_checklist.py
├── seed_education.py
├── seed_referral.py
├── docker-compose.yml
├── requirements.txt
└── .env.example
```

---

## Endpoint Overview

Semua endpoint (kecuali auth) membutuhkan header:

```
Authorization: Bearer <access_token>
```

### Auth

| Method | Path | Deskripsi |
|--------|------|-----------|
| POST | `/api/v1/auth/register` | Daftar akun baru |
| POST | `/api/v1/auth/login` | Login, dapat JWT token |

### Profil Kehamilan

| Method | Path | Deskripsi |
|--------|------|-----------|
| POST | `/api/v1/profile` | Buat profil (input: HPHT) |
| GET | `/api/v1/profile/me` | Ambil profil + trimester + minggu |

### Self-Assessment

| Method | Path | Deskripsi |
|--------|------|-----------|
| GET | `/api/v1/assessment/questions` | List pertanyaan aktif |
| POST | `/api/v1/assessment/submit` | Submit assessment harian |
| GET | `/api/v1/assessment/today` | Hasil assessment hari ini |
| GET | `/api/v1/assessment/history` | Riwayat assessment |

### Checklist Harian

| Method | Path | Deskripsi |
|--------|------|-----------|
| GET | `/api/v1/checklist/today` | Status checklist hari ini |
| POST | `/api/v1/checklist/{item_id}/log` | Toggle item (centang/batal) |

### Edukasi & Referral

| Method | Path | Deskripsi |
|--------|------|-----------|
| GET | `/api/v1/education` | List konten edukasi (`?trimester=1`) |
| GET | `/api/v1/education/{content_id}` | Detail konten |
| GET | `/api/v1/referral/{risk_level}` | Info rujukan berdasarkan risiko |

### Admin CMS *(role: admin)*

| Method | Path | Deskripsi |
|--------|------|-----------|
| GET/POST/PUT/DELETE | `/api/v1/admin/education-content` | Kelola konten edukasi |
| GET/POST/PUT/DELETE | `/api/v1/admin/assessment-questions` | Kelola pertanyaan |
| GET/POST/PUT/DELETE | `/api/v1/admin/checklist-items` | Kelola item checklist |
| GET/PUT | `/api/v1/admin/referral-mapping` | Kelola mapping rujukan |
| GET/PATCH | `/api/v1/admin/score-cutoffs` | Update cutoff skor risiko |

---

## Membuat Akun Admin

Setelah register akun biasa, ubah role-nya langsung di database:

```bash
docker exec -it wellmom_db psql -U postgres -d wellmom \
  -c "UPDATE users SET role='admin' WHERE email='email@kamu.com';"
```

Login ulang untuk mendapatkan token baru dengan role admin.

---

## Scoring Logic — Self-Assessment

Sistem membaca konfigurasi dari database, bukan hardcode.

1. **Red Flag Check** — jika ada jawaban "Ya" di pertanyaan bertanda `is_red_flag=true` (perdarahan/flek, sakit kepala berat, bengkak wajah/tangan, gerakan janin berkurang) → langsung `HIGH`, `total_score: null`
2. **Score Accumulation** — jumlahkan `weight` semua jawaban "Ya" di pertanyaan non-red-flag
3. **Category Lookup** — cocokkan skor ke tabel `risk_thresholds`

| Skor | Kategori |
|------|----------|
| 0–2 | LOW |
| 3–4 | MEDIUM |
| ≥5 | HIGH |

Cutoff dapat diubah lewat `PATCH /api/v1/admin/score-cutoffs/{category}` tanpa redeploy.

---

## Menjalankan Ulang dari Nol

Kalau perlu reset database lokal:

```bash
docker-compose down -v   # ⚠️ menghapus semua data
docker-compose up -d
alembic upgrade head
python seed_assessment.py
python seed_referral.py
python seed_checklist.py
python seed_education.py
```

> **Jangan jalankan `docker-compose down -v` di environment produksi.**

---

## Catatan untuk Tim

- Konten edukasi (`seed_education.py`) masih berupa **placeholder** — belum direview dr. Nucky. Jangan jadikan rujukan medis. Konten final diisi lewat CMS tool Thoriq.
- Threshold tensi darah (`bp_assessment_status`) masih `PENDING_THRESHOLD` — menunggu konfirmasi klinis dr. Nucky.
- Fitur monitoring (BB/TB ibu + janin, trimester 3) sedang dalam development.
- Model 3 (ML risk predictor) belum diimplementasikan — endpoint `/risk/me` belum tersedia.

---

*WellMom — FCS × FKPU Universitas Presiden, 2026*
