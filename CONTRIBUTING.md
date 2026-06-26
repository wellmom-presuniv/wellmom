# Contributing Guide — WellMom

## Branch Naming

Format: `feature/<area>-<deskripsi-singkat>` atau `fix/<area>-<deskripsi-singkat>`

Area: `mobile`, `backend`, `cms`, `scoring`

Contoh:
- `feature/mobile-self-assessment-form`
- `feature/backend-assessment-endpoint`
- `fix/cms-question-editor-bug`

Kalau mau dikaitkan ke nomor ticket Jira, tambahkan kode ticket di depan:
- `feature/WM-12-self-assessment-form`

## Commit Message

Pakai format singkat, awali dengan tipe:

```
feat: tambah form self-assessment generic
fix: perbaiki kalkulasi progress trimester di Home screen
chore: setup NativeWind config
docs: update README struktur folder
```

## Pull Request Flow

1. Branch baru dari `main`, kerjakan task.
2. Push, buka PR ke `main`. Judul PR jelas, isi deskripsi singkat (apa yang berubah, ticket Jira terkait kalau ada).
3. Minimal 1 anggota lain baca diff sebelum merge — kalau urgent dan ga ada yang available, boleh self-merge, tapi infokan di grup tim.
4. **Jangan push langsung ke `main`.** Semua perubahan lewat PR, sekecil apapun — supaya histori perubahan kelihatan dan gampang di-rollback kalau ada yang error.

## Catatan untuk Modul yang Masih `[BLOCKED]`

Kalau kerjaan kamu menyentuh modul yang masih nunggu konfirmasi tim medis (lihat label `blocked-by-medical` di Jira — Monitoring, threshold tensi darah, dll), commit tetap boleh jalan untuk bagian struktural (schema generic, UI skeleton), tapi jangan hardcode angka/logic klinis yang belum confirmed. Tandai dengan komentar `// TODO: pending dr. Nucky confirmation` di kode supaya gampang dicari nanti.
