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

## Struktur Folder
src/
├── layouts/      # AdminLayout (sidebar + outlet)
├── pages/        # Halaman per modul CMS
├── types/        # Type definitions seluruh entitas CMS
├── lib/          # Axios instance, utilities
└── contexts/     # AuthContext (JWT storage)

## Modul CMS
| Modul | Path | Status |
|---|---|---|
| Pertanyaan Assessment | `/assessment-questions` | Sprint 2 |
| Konfigurasi Cutoff | `/score-cutoffs` | Sprint 2 |
| Konten Edukasi | `/education-content` | Sprint 2 |
| Checklist Harian | `/checklist-items` | Sprint 2 |
| Mapping Rujukan | `/referral-mapping` | Sprint 2 |