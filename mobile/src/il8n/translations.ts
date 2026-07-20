export type Language = "id" | "en";

export const translations = {
  id: {
    // Auth
    tagline: "Healthy Mom, Healthy Baby 💗",
    email: "Email",
    password: "Password",
    login: "Masuk",
    register: "Daftar Sekarang",
    noAccount: "Belum punya akun?",
    hasAccount: "Sudah punya akun?",
    fullName: "Nama Lengkap",
    namePlaceholder: "Masukkan nama Anda",
    emailPlaceholder: "nama@email.com",
    passwordPlaceholder: "Buat kata sandi",
    terms: "Dengan mendaftar, kamu menyetujui",
    termsLink: "Syarat & Ketentuan",

    // Onboarding
    completeProfile: "Lengkapi Profil",
    hphtDesc: "Masukkan Hari Pertama Haid Terakhir (HPHT) Anda untuk menghitung usia kehamilan dan mendapatkan panduan yang personal.",
    pickHpht: "Pilih Tanggal HPHT",
    hphtSelected: "HPHT TERPILIH",
    continueBtn: "Lanjutkan",
    skip: "Lewati",

    // Home
    greeting: "Hi, {name}! 👋",
    goodMorning: "Selamat pagi, Bunda.",
    trimester: "Trimester {n}",
    week: "Minggu ke-{n}",
    hplLabel: "Perkiraan HPL: {date}",
    currentRisk: "Risiko Saat Ini",
    quickMenu: "Menu Cepat",
    seeAll: "Lihat Semua",
    tipsTitle: "Tips Hari Ini",
    tipsBody: "Bunda, jangan lupa minum setidaknya 8 gelas air hari ini untuk menjaga hidrasi ketuban yang optimal.",
    riskLow: "Risiko Rendah",
    riskMedium: "Risiko Sedang",
    riskHigh: "Risiko Tinggi",
    riskLowDesc: "Terus jaga pola makan dan lakukan pemeriksaan kehamilan rutin.",
    riskMediumDesc: "Ada beberapa hal yang perlu diperhatikan. Konsultasikan saat kunjungan ANC.",
    riskHighDesc: "Segera konsultasikan kondisi Anda ke tenaga kesehatan.",

    // Menu items
    menuEducation: "Edukasi",
    menuChecklist: "Checklist",
    menuAssessment: "Self-Assessment",
    menuDiary: "Catatan Harian",
    menuGuide: "Panduan",
    menuProfile: "Profil",

    // Assessment Form
    assessmentTitle: "Self-Assessment Risiko",
    assessmentSubtitle: "Jawab pertanyaan berikut berdasarkan kondisi Anda hari ini",
    yes: "Ya",
    no: "Tidak",
    bloodPressure: "Tensi Darah",
    optional: "Opsional",
    systolic: "Sistol",
    diastolic: "Diastol",
    viewResult: "Lihat Hasil",
    answerMore: "Jawab {n} pertanyaan lagi",

    // Assessment Result
    needsAttention: "Yang perlu diperhatikan",
    ongoingSymptoms: "Gejala Berlangsung",
    bloodPressureLabel: "Tekanan Darah",
    totalScore: "Total Skor",
    goToFaskes: "Segera ke Fasilitas Kesehatan",
    backHome: "Kembali ke Beranda",
    monitorOn: "Pantau terus",
    checkNow: "Segera periksa",
    caution: "WASPADA",
    danger: "BAHAYA",
    symptomBleeding: "Perdarahan/Flek",
    symptomBlurredVision: "Pusing/Pandangan Kabur",
    symptomFever: "Demam Tinggi",
    bpElevated: "Elevated — pantau secara rutin",
    bpStage1: "Hipertensi Tahap 1 — konsultasikan ke dokter",
    bpStage2: "Hipertensi Tahap 2 — segera ke dokter",
    bpCrisis: "Krisis Hipertensi — segera ke UGD",
    riskLowResult: "Kondisi Anda baik. Tetap jaga pola makan dan lakukan pemeriksaan kehamilan rutin.",
    riskMediumResult: "Ada beberapa faktor yang perlu diperhatikan. Konsultasikan saat kunjungan ANC berikutnya.",
    riskHighResult: "Terdapat tanda yang memerlukan perhatian segera. Segera konsultasi ke tenaga kesehatan.",

    // Checklist
    checklistTitle: "Checklist Harian",
    consistency: "Konsistensi hari ini",
    historyLabel: "Riwayat hari ini",
    done: "{done}/{total} Selesai",
    noChecklist: "Belum ada item checklist.\nTim medis akan segera menambahkan.",
    days: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],

    // Education
    educationTitle: "Edukasi",
    educationSubtitle: "Pilih Topik",
    searchPlaceholder: "Cari topik edukasi...",
    filterAll: "Semua",
    filterTrimester: "Trimester {n}",
    noTopics: "Topik tidak ditemukan.",
    contentLoading: "Konten sedang disiapkan tim medis.",
    markDone: "Tandai Selesai",
    readTime: "{n} Min Baca",

    // History
    historyTitle: "Riwayat",
    tabAssessment: "Assessment",
    tabChecklist: "Checklist",
    noHistory: "Belum ada riwayat assessment.",
    noChecklistHistory: "Belum ada riwayat checklist.",
    scoreLabel: "Skor: {score} · Tensi: {bp}",
    bpNotFilled: "Tidak diisi",

    // Profile
    accountSection: "AKUN & PREFERENSI",
    supportSection: "DUKUNGAN",
    editProfile: "Edit Profil",
    language: "Bahasa",
    languageValue: "Indonesia",
    notifications: "Notifikasi",
    aboutApp: "Tentang WellMom",
    help: "Bantuan",
    logout: "Keluar",
    trimesterBadge: "Trimester {t} · Minggu ke-{w}",

    // Edit Profile
    editProfileTitle: "Edit Profil",
    editProfileInfo: "Perbarui HPHT jika Anda salah memasukkan tanggal sebelumnya.",
    hphtLabel: "Hari Pertama Haid Terakhir (HPHT)",
    hphtHint: "Tanggal pertama menstruasi terakhir sebelum hamil",
    saveChanges: "Simpan Perubahan",
    savingNote: "Perubahan akan aktif setelah endpoint backend tersedia",

    // About
    aboutTitle: "Tentang WellMom",
    version: "Versi 1.0.0",

    // Help
    helpTitle: "Bantuan",
    faqTitle: "Pertanyaan Umum (FAQ)",
    stillQuestion: "Masih ada pertanyaan?",
    stillQuestionBody: "Hubungi tim WellMom melalui koordinator medis Anda atau melalui fasilitas kesehatan terdekat.",

    // Guide
    guideTitle: "Panduan",
    guideSubtitle: "Informasi penting untuk kehamilan sehat",
    disclaimer: "⚕️ Disclaimer",
    disclaimerBody: "WellMom adalah alat bantu edukasi, bukan pengganti konsultasi medis. Selalu konsultasikan kondisi Anda kepada tenaga kesehatan yang berkompeten.",

    // Common
    loading: "Memuat...",
    errorNetwork: "Gagal memuat data. Cek koneksi internet kamu.",
    back: "Kembali",
    contentNotReady: "Konten sedang disiapkan.",
    
    questions: {
      1: "Mudah lelah berlebihan?",
      2: "Pusing atau Pandangan kabur?",
      3: "Mual muntah terus-menerus?",
      4: "Tidak konsumsi tablet tambah darah?",
      5: "Perdarahan atau flek?",
      6: "Sakit kepala berat?",
      7: "Bengkak pada wajah/tangan?",
      8: "Gerakan janin berkurang (trimester lanjut)?",
      9: "Demam tinggi (≥38°C)?",
    } as Record<number, string>,

    redFlags: {} as Record<string, string>,

    checklistItems: {} as Record<string, string>,
  },

  en: {
    // Auth
    tagline: "Healthy Mom, Healthy Baby 💗",
    email: "Email",
    password: "Password",
    login: "Sign In",
    register: "Register Now",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    fullName: "Full Name",
    namePlaceholder: "Enter your name",
    emailPlaceholder: "name@email.com",
    passwordPlaceholder: "Create a password",
    terms: "By registering, you agree to our",
    termsLink: "Terms & Conditions",

    // Onboarding
    completeProfile: "Complete Profile",
    hphtDesc: "Enter your Last Menstrual Period (LMP) date to calculate your gestational age and receive personalized guidance.",
    pickHpht: "Select LMP Date",
    hphtSelected: "SELECTED LMP",
    continueBtn: "Continue",
    skip: "Skip",

    // Home
    greeting: "Hi, {name}! 👋",
    goodMorning: "Good morning, Mama.",
    trimester: "Trimester {n}",
    week: "Week {n}",
    hplLabel: "Estimated Due Date: {date}",
    currentRisk: "Current Risk",
    quickMenu: "Quick Menu",
    seeAll: "See All",
    tipsTitle: "Today's Tip",
    tipsBody: "Mama, don't forget to drink at least 8 glasses of water today to maintain optimal amniotic fluid hydration.",
    riskLow: "Low Risk",
    riskMedium: "Medium Risk",
    riskHigh: "High Risk",
    riskLowDesc: "Keep maintaining your diet and schedule routine antenatal checkups.",
    riskMediumDesc: "There are some things to pay attention to. Discuss with your doctor at your next ANC visit.",
    riskHighDesc: "Please consult a healthcare professional as soon as possible.",

    // Menu items
    menuEducation: "Education",
    menuChecklist: "Checklist",
    menuAssessment: "Self-Assessment",
    menuDiary: "Daily Notes",
    menuGuide: "Guide",
    menuProfile: "Profile",

    // Assessment Form
    assessmentTitle: "Risk Self-Assessment",
    assessmentSubtitle: "Answer the following based on your condition today",
    yes: "Yes",
    no: "No",
    bloodPressure: "Blood Pressure",
    optional: "Optional",
    systolic: "Systolic",
    diastolic: "Diastolic",
    viewResult: "View Result",
    answerMore: "Answer {n} more questions",

    // Assessment Result
    needsAttention: "Things to pay attention to",
    ongoingSymptoms: "Ongoing Symptoms",
    bloodPressureLabel: "Blood Pressure",
    totalScore: "Total Score",
    goToFaskes: "Go to Healthcare Facility Now",
    backHome: "Back to Home",
    monitorOn: "Keep monitoring",
    checkNow: "Seek care now",
    caution: "CAUTION",
    danger: "DANGER",
    symptomBleeding: "Bleeding/Spotting",
    symptomBlurredVision: "Dizziness/Blurred Vision",
    symptomFever: "High Fever",
    bpElevated: "Elevated — monitor regularly",
    bpStage1: "Hypertension Stage 1 — consult your doctor",
    bpStage2: "Hypertension Stage 2 — see a doctor soon",
    bpCrisis: "Hypertensive Crisis — go to emergency immediately",
    riskLowResult: "Your condition is good. Keep maintaining your diet and schedule routine checkups.",
    riskMediumResult: "There are some factors to watch. Discuss at your next ANC visit.",
    riskHighResult: "There are signs that require immediate attention. Please consult a healthcare professional.",

    // Checklist
    checklistTitle: "Daily Checklist",
    consistency: "Today's consistency",
    historyLabel: "Today's history",
    done: "{done}/{total} Done",
    noChecklist: "No checklist items yet.\nThe medical team will add them soon.",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],

    // Education
    educationTitle: "Education",
    educationSubtitle: "Choose a Topic",
    searchPlaceholder: "Search education topics...",
    filterAll: "All",
    filterTrimester: "Trimester {n}",
    noTopics: "No topics found.",
    contentLoading: "Content is being prepared by the medical team.",
    markDone: "Mark as Done",
    readTime: "{n} Min Read",

    // History
    historyTitle: "History",
    tabAssessment: "Assessment",
    tabChecklist: "Checklist",
    noHistory: "No assessment history yet.",
    noChecklistHistory: "No checklist history yet.",
    scoreLabel: "Score: {score} · BP: {bp}",
    bpNotFilled: "Not provided",

    // Profile
    accountSection: "ACCOUNT & PREFERENCES",
    supportSection: "SUPPORT",
    editProfile: "Edit Profile",
    language: "Language",
    languageValue: "English",
    notifications: "Notifications",
    aboutApp: "About WellMom",
    help: "Help",
    logout: "Sign Out",
    trimesterBadge: "Trimester {t} · Week {w}",

    // Edit Profile
    editProfileTitle: "Edit Profile",
    editProfileInfo: "Update your LMP date if you entered it incorrectly.",
    hphtLabel: "Last Menstrual Period (LMP)",
    hphtHint: "First day of your last menstrual period before pregnancy",
    saveChanges: "Save Changes",
    savingNote: "Changes will take effect once the backend endpoint is available",

    // About
    aboutTitle: "About WellMom",
    version: "Version 1.0.0",

    // Help
    helpTitle: "Help",
    faqTitle: "Frequently Asked Questions (FAQ)",
    stillQuestion: "Still have questions?",
    stillQuestionBody: "Contact the WellMom team through your medical coordinator or the nearest healthcare facility.",

    // Guide
    guideTitle: "Guide",
    guideSubtitle: "Important information for a healthy pregnancy",
    disclaimer: "⚕️ Disclaimer",
    disclaimerBody: "WellMom is an educational tool and does not replace medical consultation. Always consult a qualified healthcare professional.",

    // Common
    loading: "Loading...",
    errorNetwork: "Failed to load data. Check your internet connection.",
    back: "Back",
    contentNotReady: "Content is being prepared.",

    questions: {
      1: "Excessive fatigue?",
      2: "Dizziness or blurred vision?",
      3: "Persistent nausea and vomiting?",
      4: "Not taking iron supplements?",
      5: "Bleeding or spotting?",
      6: "Severe headache?",
      7: "Swelling of face/hands?",
      8: "Reduced fetal movement (late trimester)?",
      9: "High fever (≥38°C)?",
    } as Record<number, string>,

    redFlags: {
      "Sakit kepala berat?": "Severe headache?",
      "Bengkak pada wajah/tangan?": "Swelling of face/hands?",
      "Gerakan janin berkurang (trimester lanjut)?": "Reduced fetal movement (late trimester)?",
      "Perdarahan atau flek?": "Bleeding or spotting?",
      "Pusing atau Pandangan kabur?": "Dizziness or blurred vision?",
      "Demam tinggi (>=38°C)?": "High fever (≥38°C)?",
    } as Record<string, string>,

    checklistItems: {
      "Minum tablet tambah darah": "Take iron supplement",
      "Minum air minimal 8 gelas": "Drink at least 8 glasses of water",
      "Makan makanan sumber protein": "Eat protein-rich foods",
      "Makan sayur dan buah": "Eat vegetables and fruits",
      "Konsumsi susu/kalsium": "Consume milk/calcium",
      "Istirahat cukup (7-8 jam)": "Get enough rest (7-8 hours)",
    } as Record<string, string>,
  },
};

export type TranslationKey = keyof typeof translations.id;