# WellMom CMS

Internal admin tool untuk mengelola konten aplikasi WellMom — 
dikembangkan oleh tim FCS × FKPU President University.

## Tech Stack

- React + TypeScript (Vite)
- Tailwind CSS v4 (`@tailwindcss/vite`)
- shadcn/ui (Radix + Nova preset)
- React Router v6
- TanStack Query + Axios
- React Hook Form + Zod

## Setup

```bash
cd cms
npm install
npm run dev
```

Akses di `http://localhost:5173`

## Authentication

CMS menggunakan JWT token yang disimpan **in-memory** (bukan localStorage).

Alur login:
1. Chelsea buka CMS → otomatis redirect ke `/login`
2. Isi email + password → POST ke `/api/auth/login`
3. Token disimpan di `AuthContext`
4. Semua request Axios otomatis attach `Authorization: Bearer <token>`
5. Kalau token expired (response 401) → otomatis redirect ke `/login`

Kredensial admin dibuat oleh Alek di sisi backend.                                                          

## Struktur Folder
src/
├── contexts/     # AuthContext — brankas JWT token
├── layouts/      # AdminLayout (sidebar + outlet)
├── lib/          # Axios instance + interceptor
├── pages/        # Halaman per modul CMS
└── types/        # Type definitions seluruh entitas CMS

## Modul CMS
| Modul | Path | Status |
|---|---|---|
| Pertanyaan Assessment | `/assessment-questions` | Sprint 2 |
| Konfigurasi Cutoff | `/score-cutoffs` | Sprint 2 |
| Konten Edukasi | `/education-content` | Sprint 2 |
| Checklist Harian | `/checklist-items` | Sprint 2 |
| Mapping Rujukan | `/referral-mapping` | Sprint 2 |