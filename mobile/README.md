# WellMom Mobile

Scaffold awal aplikasi mobile WellMom — React Native + Expo + NativeWind.

## Cara menjalankan (di laptop, bukan di sini)

```bash
cd wellmom-mobile
npm install
npx expo start
```

Scan QR code yang muncul pakai app **Expo Go** (Android/iOS) untuk langsung lihat hasilnya di HP. Tidak perlu submit ke App Store/Play Store dulu.

## Struktur folder

```
src/
├── theme/colors.ts        # design token warna (single source of truth)
├── navigation/            # RootNavigator (Auth→Onboarding→Tabs) + BottomTabs
├── screens/
│   ├── auth/              # Login, Register
│   ├── onboarding/        # ProfileSetup (input HPL)
│   ├── home/              # Dashboard utama
│   ├── education/         # Edukasi (placeholder, isi Sprint 2)
│   ├── checklist/         # Checklist harian (placeholder, isi Sprint 2)
│   ├── assessment/        # Self-assessment (kosong, isi setelah API contract final)
│   ├── history/           # Riwayat (placeholder, isi Sprint 2)
│   └── profile/           # Profil & Settings (placeholder, isi Sprint 2)
├── api/client.ts          # axios instance + auth interceptor
├── store/useAuthStore.ts  # Zustand — auth & onboarding state
└── types/index.ts         # TypeScript types, sesuai struktur API Arizal
```

## Status saat ini

- ✅ Navigasi (Auth → Onboarding → 5 bottom tabs) sudah jalan
- ✅ Design token pink (primary) sudah dipasang — ganti dari sky blue ErgoAlert
- ✅ Home screen sudah di-style sesuai mockup yang divalidasi dr. Nucky
- ✅ Auth screens (UI saja, belum konek API asli)
- ⏳ Edukasi, Checklist, Riwayat, Profil — masih placeholder, isi sesuai Jira Sprint 2
- ⏳ Self-Assessment — belum dibuat sama sekali, **tunggu Arizal+Alek finalisasi 2 poin revisi** (red-flag granularity & status BP) sebelum bangun form & halaman hasil, biar nggak bongkar ulang struktur data
- ⏳ Semua API call masih dummy/stub — ganti `BASE_URL` di `src/api/client.ts` begitu backend Alek staging ready

## Catatan teknis

- **NativeWind v2** dipakai (bukan v4) — setup lebih simpel untuk RN, tinggal babel plugin + tailwind config, tanpa perlu setup global.css/metro css transformer.
- **expo-linear-gradient** dipakai di Home screen untuk gradient pink→purple di kartu trimester — sudah Expo-maintained package, aman dipakai.
- Field dinamis (lebar progress bar, warna kategori risiko) pakai inline `style`, bukan className, karena NativeWind v2 tidak generate class untuk value dinamis di runtime.
