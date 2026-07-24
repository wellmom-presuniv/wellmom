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
    submitChecklist: "Simpan Checklist",
    savingChecklist: "Sedang menyimpan...",
    done: "{done}/{total} Selesai",
    noChecklist: "Belum ada item checklist.\nTim medis akan segera menambahkan.",
    days: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    months: ["Jan", "Feb", "Mar", "Apr", "Mei", "Juni", "Juli", "Agus", "Sept", "Okt", "Nov", "Des"],

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
    daysLabel: "hari",

    // Profile
    accountSection: "AKUN & PREFERENSI",
    supportSection: "DUKUNGAN",
    editProfile: "Edit Profil",
    language: "Bahasa",
    languageValue: "Indonesia",
    notifications: "Notifikasi",
    notificationsOn: "Aktif",
    notificationsOff: "Mati",
    notificationsOffText: "Notifikasi dimatikan. Aktifkan di Profil untuk melihat pengingat.",
    notificationsDeniedTitle: "Izin Notifikasi Ditolak",
    notificationsDeniedBody: "Buka pengaturan perangkat untuk mengaktifkan notifikasi dan menerima pengingat kesehatan.",
    notificationDefault: "Ketuk ikon ini untuk melihat pengingat kesehatan terbaru.",
    notificationChecklistPending: "Jangan lupa isi checklist hari ini jika belum selesai.",
    notificationChecklistDone: "Checklist hari ini sudah lengkap. Kerja bagus!",
    notificationChecklistSelectDate: "Pilih hari ini untuk melihat checklist sehatmu.",
    notificationEducation: "Jangan lupa pahami kesehatan Anda melalui edukasi yang tersedia.",
    notificationEducationProfile: "Baca materi edukasi untuk trimestermu agar semakin sadar kondisi kesehatannya.",
    notificationHistoryAssessment: "Check self assessment kamu, ini bisa diisi sekali setiap hari.",
    notificationHistoryChecklist: "Kamu konsisten 6/6 minggu ini. Terus pertahankan kebiasaan sehatmu!",
    notificationHighRisk: "Self assessment menunjukkan risiko tinggi. Pertimbangkan konsultasi segera.",
    notificationMediumRisk: "Risiko sedang. Pantau gejala dan konsultasikan bila perlu.",
    notificationLowRisk: "Kamu dalam kondisi baik. Terus jaga kebiasaan sehat hari ini.",
 
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
    updating: "Memperbarui...",
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

    aboutSections: [
      { title: "Apa itu WellMom?", body: "WellMom adalah aplikasi pendamping kesehatan ibu hamil yang membantu memantau kehamilan secara mandiri di antara kunjungan ANC (Antenatal Care)." },
      { title: "Fitur Utama", body: "• Edukasi gizi berbasis trimester\n• Self-assessment risiko kehamilan harian\n• Checklist kepatuhan kesehatan\n• Panduan rujukan ke fasilitas kesehatan" },
      { title: "Disclaimer Penting", body: "Aplikasi ini bersifat edukatif dan TIDAK menggantikan konsultasi medis. Seluruh konten telah divalidasi oleh dr. Nucky Indra Praja, Sp.OT, M.Kes." },
      { title: "Dikembangkan oleh", body: "Mahasiswa Universitas Presiden\nFakultas Ilmu Komputer × Fakultas Kedokteran\n\nTim: Arka, Alek, Thoriq, Arizal\nLiaison Medis: Chelsea Venustine" },
    ] as { title: string; body: string }[],

    guideSections: [
      {
        id: "danger",
        title: "Kapan Harus Segera ke Faskes?",
        subtitle: "Tanda bahaya yang memerlukan penanganan segera",
        items: [
          "Perdarahan atau flek dari jalan lahir",
          "Sakit kepala berat disertai pandangan kabur",
          "Bengkak tiba-tiba pada wajah, tangan, atau kaki",
          "Demam tinggi (≥38°C) yang tidak membaik",
          "Gerakan janin berkurang drastis (trimester 3)",
          "Nyeri perut hebat yang tidak mereda",
        ],
      },
      {
        id: "risk",
        title: "Memahami Kategori Risiko",
        subtitle: "Apa arti hasil self-assessment kamu",
        items: [
          "Risiko Rendah (0–2 poin): Kondisi baik. Tetap rutin ANC dan jaga pola makan.",
          "Risiko Sedang (3–4 poin): Ada hal yang perlu diperhatikan. Konsultasikan saat kunjungan ANC.",
          "Risiko Tinggi (≥5 poin): Segera konsultasi ke tenaga kesehatan.",
          "Red Flag: Jawab 'Ya' pada tanda bahaya → langsung Risiko Tinggi tanpa melihat skor.",
        ],
      },
      {
        id: "howto",
        title: "Cara Menggunakan WellMom",
        subtitle: "Panduan singkat penggunaan aplikasi",
        items: [
          "Daftar akun dan masukkan HPHT saat onboarding.",
          "Isi self-assessment setiap hari untuk memantau kondisi kehamilan.",
          "Centang checklist harian untuk memastikan kebiasaan kesehatan terpenuhi.",
          "Baca materi edukasi sesuai trimester kamu.",
          "Cek riwayat assessment untuk melihat perkembangan kondisi dari waktu ke waktu.",
        ],
      },
      {
        id: "anc",
        title: "Jadwal ANC yang Dianjurkan",
        subtitle: "Frekuensi kunjungan antenatal care",
        items: [
          "Trimester 1 (0–13 minggu): Minimal 2 kali kunjungan",
          "Trimester 2 (14–26 minggu): Minimal 1 kali kunjungan",
          "Trimester 3 (27–40 minggu): Minimal 3 kali kunjungan",
          "Total minimal 6 kali kunjungan selama kehamilan (standar Kemenkes RI)",
        ],
      },
    ] as { id: string; title: string; subtitle: string; items: string[] }[],

    faq: [
      { q: "Apa itu HPHT?", a: "HPHT adalah Hari Pertama Haid Terakhir — tanggal pertama menstruasi terakhir sebelum hamil. Digunakan untuk menghitung usia kehamilan dan perkiraan tanggal lahir." },
      { q: "Apa yang dimaksud Red Flag?", a: "Red Flag adalah tanda bahaya kehamilan yang memerlukan perhatian segera, seperti perdarahan, sakit kepala berat, bengkak pada wajah/tangan, atau gerakan janin berkurang." },
      { q: "Bagaimana cara mengisi self-assessment?", a: "Jawab 8 pertanyaan berdasarkan kondisi Anda hari ini dengan memilih 'Ya' atau 'Tidak'. Opsional: masukkan nilai tekanan darah jika tersedia." },
      { q: "Apa arti kategori risiko?", a: "• Risiko Rendah (0–2 poin): Kondisi baik, tetap rutin ANC\n• Risiko Sedang (3–4 poin): Ada hal yang perlu diperhatikan\n• Risiko Tinggi (≥5 poin atau Red Flag): Segera konsultasi ke tenaga kesehatan" },
      { q: "Apakah data saya aman?", a: "Data Anda disimpan secara terenkripsi dan hanya dapat diakses oleh Anda sendiri. Kami tidak membagikan data ke pihak ketiga." },
      { q: "Kapan harus segera ke fasilitas kesehatan?", a: "Segera ke fasilitas kesehatan jika mengalami: perdarahan, sakit kepala berat disertai pandangan kabur, bengkak tiba-tiba pada wajah/tangan, atau gerakan janin berkurang drastis." },
    ] as { q: string; a: string }[],

    createAccount: "Buat Akun", createAccountSubtitle: "Mulai perjalanan kehamilan sehatmu bersama kami.",

    educationBanner: "Menampilkan konten {trimester} · {week}",

    educationTitles: {} as Record<string, string>,

    educationBodies: {} as Record<string, string>,

    menuMonitoring: "Monitoring",
    monitoring: "Monitoring",
    monitoringJanin: "Monitoring Janin",
    monitoringBayi: "Monitoring Bayi",
    fetalWeight: "Cek Berat Janin",
    fetalWeightInput: "Berat Janin (kg)",
    fetalWeightPlaceholder: "Contoh: 3.2",
    fetalWeightDesc: "Masukkan berat janin dari hasil USG",
    headCircInfo: "Info Lingkar Kepala Janin",
    headCircDesc: "Lingkar kepala normal trimester 3: 33–35 cm",
    checkNowBtn: "Cek Sekarang",
    normalResult: "Normal",
    belowNormal: "Di Bawah Normal",
    aboveNormal: "Di Atas Normal",
    babyData: "Data Bayi",
    babySex: "Jenis Kelamin",
    female: "Perempuan",
    male: "Laki-laki",
    babyAge: "Umur Bayi (bulan)",
    babyAgePlaceholder: "Contoh: 8",
    months: "bulan",
    measurementType: "Jenis Pengukuran",
    measurementValue: "Nilai Pengukuran",
    weightKg: "Berat (kg)",
    lengthCm: "Panjang (cm)",
    headCircCm: "Lingkar Kepala (cm)",
    evaluateGrowth: "Evaluasi Pertumbuhan",
    zScore: "Z-Score",
    referenceMonth: "Referensi Bulan",
    zoneNormal: "Normal",
    zoneConcern: "Perlu Perhatian",
    zoneSevere: "Serius",
    consultDoctor: "Segera konsultasikan kondisi bayi ke dokter atau tenaga kesehatan.",
    belowNormalMsg: "Berat janin di bawah normal. Konsultasikan ke dokter.",
    aboveNormalMsg: "Berat janin di atas normal. Konsultasikan ke dokter.",
    normalMsg: "Berat janin dalam rentang normal (2,5–4 kg).",
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
    submitChecklist: "Save Checklist",
    savingChecklist: "Saving...",
    done: "{done}/{total} Done",
    noChecklist: "No checklist items yet.\nThe medical team will add them soon.",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    months: ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],

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
    daysLabel: "days",

    // Profile
    accountSection: "ACCOUNT & PREFERENCES",
    supportSection: "SUPPORT",
    editProfile: "Edit Profile",
    language: "Language",
    languageValue: "English",
    notifications: "Notifications",
    notificationsOn: "On",
    notificationsOff: "Off",
    notificationsOffText: "Notifications are turned off. Enable them in Profile to see reminders.",
    notificationsDeniedTitle: "Notifications Permission Denied",
    notificationsDeniedBody: "Open your device settings to allow notifications and receive health reminders.",
    notificationDefault: "Tap this icon to view your latest health reminder.",
    notificationChecklistPending: "Don't forget to fill today's checklist if it's not done yet.",
    notificationChecklistDone: "You've already completed today's checklist. Great job!",
    notificationChecklistSelectDate: "Select today to review your healthy habits checklist.",
    notificationEducation: "Don't forget to understand your health with the available education materials.",
    notificationEducationProfile: "Check the education content for your trimester and stay informed about your health.",
    notificationHistoryAssessment: "Review your self-assessment. You can fill it once every day.",
    notificationHistoryChecklist: "You've been consistent 6/6 this week. Keep your healthy streak going!",
    notificationHighRisk: "Self assessment shows a high risk. Consider consulting a healthcare provider.",
    notificationMediumRisk: "Medium risk detected. Keep monitoring symptoms and consult if needed.",
    notificationLowRisk: "You're in a good condition. Keep up your healthy habits today.",
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
    updating: "Updating...",
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

    aboutSections: [
      { title: "What is WellMom?", body: "WellMom is a maternal health companion app that helps pregnant women monitor their pregnancy independently between ANC visits." },
      { title: "Key Features", body: "• Trimester-based nutrition education\n• Daily pregnancy risk self-assessment\n• Daily health habit checklist\n• Healthcare facility referral guidance" },
      { title: "Important Disclaimer", body: "This app is educational and does NOT replace medical consultation. All content has been validated by dr. Nucky Indra Praja, Sp.OT, M.Kes." },
      { title: "Developed by", body: "Students of President University\nFaculty of Computer Science × Faculty of Medicine\n\nTeam: Arka, Alek, Thoriq, Arizal\nMedical Liaison: Chelsea Venustine" },
    ] as { title: string; body: string }[],

    guideSections: [
      {
        id: "danger",
        title: "When to Go to a Healthcare Facility Immediately?",
        subtitle: "Danger signs requiring immediate care",
        items: [
          "Vaginal bleeding or spotting",
          "Severe headache with blurred vision",
          "Sudden swelling of face, hands, or feet",
          "High fever (≥38°C) that doesn't improve",
          "Significantly reduced fetal movement (3rd trimester)",
          "Severe abdominal pain that doesn't subside",
        ],
      },
      {
        id: "risk",
        title: "Understanding Risk Categories",
        subtitle: "What your self-assessment result means",
        items: [
          "Low Risk (0–2 pts): Good condition. Keep routine ANC and maintain diet.",
          "Medium Risk (3–4 pts): Some things to watch. Discuss at your next ANC visit.",
          "High Risk (≥5 pts): Consult a healthcare professional immediately.",
          "Red Flag: Answering 'Yes' to a danger sign → automatically High Risk.",
        ],
      },
      {
        id: "howto",
        title: "How to Use WellMom",
        subtitle: "Quick guide to using the app",
        items: [
          "Register and enter your LMP date during onboarding.",
          "Complete the daily self-assessment to monitor your pregnancy.",
          "Check off the daily checklist to ensure healthy habits.",
          "Read educational content tailored to your trimester.",
          "View assessment history to track your condition over time.",
        ],
      },
      {
        id: "anc",
        title: "Recommended ANC Schedule",
        subtitle: "Antenatal care visit frequency",
        items: [
          "1st Trimester (0–13 weeks): At least 2 visits",
          "2nd Trimester (14–26 weeks): At least 1 visit",
          "3rd Trimester (27–40 weeks): At least 3 visits",
          "Total minimum 6 visits throughout pregnancy (Indonesian Ministry of Health standard)",
        ],
      },
    ] as { id: string; title: string; subtitle: string; items: string[] }[],

    faq: [
      { q: "What is LMP (HPHT)?", a: "LMP stands for Last Menstrual Period — the first day of your last period before pregnancy. It is used to calculate gestational age and estimated due date." },
      { q: "What is a Red Flag?", a: "A Red Flag is a pregnancy danger sign that requires immediate attention, such as bleeding, severe headache, sudden swelling of face/hands, or reduced fetal movement." },
      { q: "How do I fill in the self-assessment?", a: "Answer 8 questions based on your condition today by selecting 'Yes' or 'No'. Optionally, enter your blood pressure value if available." },
      { q: "What do the risk categories mean?", a: "• Low Risk (0–2 points): Good condition, keep your routine ANC\n• Medium Risk (3–4 points): Some things to watch\n• High Risk (≥5 points or Red Flag): Consult a healthcare professional immediately" },
      { q: "Is my data safe?", a: "Your data is stored encrypted and can only be accessed by you. We do not share your data with third parties." },
      { q: "When should I go to a healthcare facility immediately?", a: "Go immediately if you experience: bleeding, severe headache with blurred vision, sudden swelling of face/hands, or significantly reduced fetal movement." },
    ] as { q: string; a: string }[],

    createAccount: "Create Account", createAccountSubtitle: "Start your healthy pregnancy journey with us.",

    educationBanner: "Showing content for {trimester} · {week}",

    educationTitles: {
      "Gizi Seimbang Ibu Hamil": "Balanced Nutrition for Pregnant Women",
      "Nutrisi Penting Trimester 1": "Essential Nutrition - 1st Trimester",
      "Nutrisi Penting Trimester 2": "Essential Nutrition - 2nd Trimester",
      "Nutrisi Penting Trimester 3": "Essential Nutrition - 3rd Trimester",
      "Tablet Tambah Darah untuk Ibu Hamil": "Iron Supplement for Pregnant Women",
      "Mengatasi Mual di Trimester Pertama": "Managing Morning Sickness",
      "Makanan yang Perlu Dihindari Ibu Hamil": "Foods to Avoid During Pregnancy",
      "Persiapan Menjelang Persalinan": "Preparing for Childbirth",
      "Persiapan Nutrisi untuk Menyusui": "Nutrition for Breastfeeding",
      "Mengenali Tanda Bahaya Kehamilan": "Recognizing Pregnancy Danger Signs",
    } as Record<string, string>,

    educationBodies: {
      "Gizi Seimbang Ibu Hamil": `Pregnant women must consume a variety of foods in proper proportions and amounts to meet nutritional needs for both themselves and their baby's growth and development.

    **13 General Messages of Balanced Nutrition (Indonesian Ministry of Health)**
    1. Eat a variety of foods
    2. Eat foods that meet your energy needs
    3. Get half your energy from carbohydrates
    4. Limit fat to a quarter of your energy needs
    5. Use iodized salt
    6. Eat iron-rich foods
    7. Get used to eating breakfast
    8. Drink clean, safe, and sufficient water
    9. Exercise regularly
    10. Avoid alcoholic beverages
    11. Eat food that is safe for health
    12. Read labels on packaged foods

    **4 Special Messages for Pregnant Women:**
    - Eat a variety of foods regularly
    - Limit salt intake
    - Drink plenty of water
    - Limit coffee consumption

    **Foods to Avoid:**
    ❌ Foods preserved with harmful additives
    ❌ Undercooked or raw meat/eggs/fish
    ❌ Excessive caffeine (coffee, chocolate) — can raise blood pressure
    ❌ High-sugar and high-fat foods (chips, cakes, fast food)
    ❌ Gas-producing foods (jackfruit, cabbage, sweet potato)
    ❌ Soft drinks

    Source: Indonesian Ministry of Health, Balanced Nutrition Guidelines 2014`,

      "Nutrisi Penting Trimester 1": `The first trimester is a critical period for the formation of the baby's vital organs. Key nutrients during this period include:

    **Folate and Folic Acid**
    Essential for preventing neural tube defects in the baby's brain and spinal cord. ACOG recommends 600–800 mcg of folate per day during pregnancy.

    Sources: chicken liver, legumes, eggs, dark leafy greens, peas.

    Folic acid supplements are proven to reduce the risk of premature birth. Ideally started 3 months before conception.

    **Iron**
    The body needs twice as much iron as a non-pregnant woman — 27 mg/day. Iron is needed to make hemoglobin, which carries oxygen to the baby.

    Iron deficiency causes iron deficiency anemia, which can lead to:
    - Premature birth
    - Low birth weight (LBW)
    - Excessive fatigue in the mother

    Sources: lean red meat, poultry, fish, iron-fortified cereals, legumes, vegetables.

    **Vitamin B6**
    Helps reduce nausea (morning sickness).
    Sources: bananas, sweet potatoes, chicken, fish.

    **1st Trimester Tips:**
    - Eat small, frequent meals to manage nausea
    - Avoid food smells that trigger nausea
    - Get enough rest

    Source: Indonesian Ministry of Health; UNICEF Maternal Nutrition`,

      "Nutrisi Penting Trimester 2": `The second trimester is a period of rapid growth of the baby's bones, muscles, and nervous system. Calorie needs increase by approximately 340 calories/day.

    **Calcium**
    Important for building strong bones and teeth for the baby, and supporting the mother's circulatory system, muscles, and nerves.

    Requirement: 1,000 mg/day (can be split into 2 doses of 500 mg). Sources: milk, yogurt, cheese, salmon, shrimp, tofu, dark leafy greens.

    **Vitamin D**
    Helps build the baby's strong bones and teeth. Requirement: 600 IU/day.
    Sources: fatty fish (salmon), milk, orange juice.

    **Protein**
    Supports growth of baby's tissues and organs including the brain, and growth of the mother's breast and uterine tissue.

    Requirement: 70–100 g/day (depending on weight and trimester).
    Sources: lean beef, chicken, salmon, legumes, peanut butter, cottage cheese.

    **Omega-3 (DHA)**
    Important for the baby's brain and eye development.
    Sources: salmon, sardines, fish oil supplements.

    **2nd Trimester Tips:**
    - Monitor weight gain (ideal: 0.5 kg/week)
    - Increase fiber intake to prevent constipation
    - Start light exercise like walking or prenatal yoga

    Source: Indonesian Ministry of Health; UNICEF Maternal Nutrition`,

      "Nutrisi Penting Trimester 3": `The third trimester is the baby's final preparation before birth. Calorie needs increase by approximately 450 calories/day.

    **Calcium & Vitamin D**
    The baby absorbs large amounts of calcium for bone development. Ensure 1,000 mg of calcium and 600 IU of vitamin D daily.

    **Iron**
    The baby begins storing iron reserves for the first 6 months of life. Continue consuming 27 mg of iron/day and take with vitamin C for optimal absorption.

    **Vitamin K**
    Important for the baby's blood clotting at birth.
    Sources: green vegetables (spinach, kale, broccoli).

    **Fiber & Water**
    Prevents constipation and hemorrhoids common in the 3rd trimester. Drink at least 8–10 glasses of water/day.

    **3rd Trimester Tips:**
    - Eat small, frequent meals (enlarged uterus presses on the stomach)
    - Avoid spicy and fatty foods (triggers heartburn)
    - Prepare nutrition for breastfeeding after delivery
    - Consult your doctor about additional supplements needed

    Source: Indonesian Ministry of Health; UNICEF Maternal Nutrition`,

      "Tablet Tambah Darah untuk Ibu Hamil": `Iron Supplement (Tablet Tambah Darah/TTD) is an iron and folic acid supplement that pregnant women must take to prevent iron deficiency anemia.

    **Why Is It Important?**
    During pregnancy, the mother's blood volume increases significantly and the body needs twice as much iron. Iron deficiency can cause:
    - Premature birth
    - Low birth weight (LBW)
    - Excessive bleeding during delivery
    - Fatigue and reduced immunity in the mother
    - Postpartum depression

    **Consumption Guidelines**
    - 1 tablet every day throughout pregnancy
    - Take at night before bed (reduces nausea side effects)
    - Take with plain water or orange juice (vitamin C improves absorption)
    - DO NOT take with tea, coffee, or milk (inhibits iron absorption)

    **Normal Side Effects**
    - Black stool (normal, not harmful)
    - Mild nausea
    - Constipation → manage by drinking more water and eating more fiber

    **When to Start?**
    From the first trimester until 3 months after delivery (for breastfeeding mothers).

    **Government Program**
    Iron supplements are available free of charge at Puskesmas and Posyandu as part of the Indonesian Ministry of Health's maternal health program.

    Source: Indonesian Ministry of Health, Balanced Nutrition Guidelines; UNICEF Maternal Nutrition`,

      "Mengatasi Mual di Trimester Pertama": `Nausea and vomiting (morning sickness) is a very common complaint in the first trimester — experienced by about 70-80% of pregnant women. This condition is generally normal and improves after weeks 12 to 14.

    **Why Does It Happen?**
    Nausea is triggered by a sharp increase in hCG and estrogen hormones in early pregnancy.

    **Tips for Managing Nausea**

    *Eating Pattern*
    - Eat small, frequent meals (5–6 times a day)
    - Don't let your stomach get empty
    - Eat plain crackers before getting out of bed
    - Avoid fatty, spicy, and strong-smelling foods

    *Helpful Foods*
    ✅ Ginger — proven effective (ginger tea, ginger candy)
    ✅ Bananas — easy to digest, rich in vitamin B6
    ✅ Clear broth — provides fluids and nutrients without burdening the stomach
    ✅ Plain crackers
    ✅ Cold fruit (watermelon, melon)

    *Fluids*
    - Drink water little by little but often
    - Avoid drinking a lot during meals
    - Try cold water or small ice cubes

    *Lifestyle Changes*
    - Get enough rest — fatigue worsens nausea
    - Avoid smells that trigger nausea
    - Good room ventilation

    **When to See a Doctor?**
    🔴 Unable to eat or drink at all for 24 hours
    🔴 Very little urine and dark-colored (dehydration)
    🔴 Significant weight loss
    🔴 Vomiting more than 3–4 times a day continuously

    Severe nausea and vomiting is called Hyperemesis Gravidarum and requires medical treatment.

    Source: Indonesian Ministry of Health; UNICEF Maternal Nutrition`,

      "Makanan yang Perlu Dihindari Ibu Hamil": `During pregnancy, the mother's immune system is more vulnerable to infection. Some foods should be avoided to protect the mother and baby.

    **Foods to Avoid**

    🔴 **Raw or undercooked meat, fish, and eggs**
    Can contain Salmonella, Listeria bacteria, or Toxoplasma parasites.
    - Avoid: sashimi, raw fish sushi, medium-rare steak, soft-boiled eggs

    🔴 **Fish with high mercury content**
    Mercury can damage the baby's nervous system.
    - Avoid: bluefin tuna, swordfish, shark, king mackerel
    - Safe: salmon, sardines, mackerel, catfish, shrimp

    🔴 **Unpasteurized dairy products and cheese**
    Risk of containing Listeria bacteria.
    - Avoid: raw fresh milk, unpasteurized soft cheese

    🔴 **Foods preserved with harmful additives**

    **Foods to Limit**

    ⚠️ **Caffeine** — maximum 200 mg/day (equivalent to 1 cup of coffee)
    Excessive caffeine increases the risk of miscarriage and low birth weight.

    ⚠️ **Excess salt** — can worsen swelling and high blood pressure

    ⚠️ **High sugar and fat** — causes excessive weight gain

    ⚠️ **Gas-producing foods** (jackfruit, cabbage, sweet potato) — causes bloating and heartburn

    **Drinks to Avoid**
    ❌ Alcohol — no safe limit during pregnancy
    ❌ Energy drinks — contain caffeine and harmful stimulants
    ❌ Excess soft drinks — high in sugar, not nutritious

    Source: Indonesian Ministry of Health, Balanced Nutrition Guidelines; UNICEF Maternal Nutrition`,

      "Persiapan Menjelang Persalinan": `Thorough preparation before childbirth helps mothers face the birth process more calmly and ready.

    **Physical Preparation**

    *Pregnancy Exercise & Prenatal Yoga*
    Trains pelvic muscles and breathing. Consult your doctor/midwife before starting.

    *Breathing Techniques*
    Practice deep breathing to manage pain during contractions. Breathe in slowly through the nose, exhale through the mouth.

    *Pre-Delivery Nutrition*
    Maintain iron, calcium, and protein intake. Ensure adequate water intake (8–10 glasses/day). Save energy with adequate rest (8–9 hours/night).

    **Mental Preparation**
    - Attend childbirth preparation classes
    - Discuss birth plan with your doctor/midwife
    - Learn the stages of the birth process
    - Build a support system with your partner and family

    **Hospital Bag — What to Prepare**

    For the Mother:
    - Documents (ID, BPJS card, maternal health book, ultrasound results)
    - Change of clothes (2–3 sets)
    - Toiletries and personal care items
    - Snacks and drinks

    For the Baby:
    - Baby clothes (3–5 sets in various sizes)
    - Diapers
    - Blankets and swaddles
    - Baby hat and socks

    **Signs Labor Is Near**
    - Regular contractions that get stronger and more frequent
    - Water breaking (go to the hospital immediately)
    - Bloody show (mucus mixed with blood)
    - Baby feels like it has "dropped" into the pelvis

    **When to Go to the Hospital?**
    The 5-1-1 rule: contractions every 5 minutes, lasting 1 minute, for 1 hour.

    Source: Indonesian Ministry of Health; UNICEF Maternal Nutrition`,

      "Persiapan Nutrisi untuk Menyusui": `Nutritional preparation for breastfeeding should ideally begin in the third trimester. The quality of breast milk is greatly influenced by the mother's nutrition.

    **Why Is It Important?**
    During breastfeeding, the mother's calorie needs increase by about 500 calories/day. If intake is insufficient, the mother's own nutritional reserves will be depleted.

    **Key Nutrients for Breastfeeding**

    **Fluids**
    Breast milk production requires a lot of fluids. Drink at least 8–12 glasses of water/day. Make a habit of drinking a glass of water every time you breastfeed.

    **Protein**
    70–100 g/day to maintain breast milk quality and body recovery.
    Sources: chicken, fish, eggs, tofu, tempeh, legumes.

    **Calcium**
    Still 1,000 mg/day — if insufficient, the body takes from the mother's bones.
    Sources: milk, yogurt, cheese, anchovies, green vegetables.

    **Iron**
    Continue iron supplements for 3 months after delivery (as recommended by the Indonesian Ministry of Health).

    **Breast Milk Boosting Foods**
    ✅ Katuk leaves — proven to increase breast milk production
    ✅ Nuts (almonds, peanuts)
    ✅ Oatmeal
    ✅ Green vegetables (spinach, kale)

    **What to Limit While Breastfeeding**
    - Caffeine — can pass into breast milk and make the baby fussy
    - Alcohol — avoid completely
    - High-mercury fish — mercury can pass into breast milk

    **Tips for Successful Breastfeeding**
    - Breastfeed as often as possible in the beginning (8–12 times/24 hours)
    - Ensure correct latch to prevent sore nipples
    - Get enough rest — fatigue can reduce milk production
    - Family support is crucial

    Source: Indonesian Ministry of Health; UNICEF Maternal and Breastfeeding Nutrition`,

      "Mengenali Tanda Bahaya Kehamilan": `Recognizing pregnancy danger signs early is crucial to prevent complications that threaten the lives of mother and baby. UNICEF states that awareness of danger signs is a fundamental strategy in antenatal care.

    **Go to a Healthcare Facility Immediately If You Experience:**

    🔴 **Vaginal bleeding**
    Bleeding at any point during pregnancy must be evaluated immediately. Can indicate placenta previa, placental abruption, or threatened miscarriage.

    🔴 **Severe headache that doesn't improve**
    Especially if accompanied by blurred vision, upper abdominal pain, or swelling. Can be a sign of preeclampsia.

    🔴 **Sudden swelling of the face, hands, or feet**
    Sudden and severe swelling can indicate preeclampsia, especially if accompanied by high blood pressure.

    🔴 **Significantly reduced fetal movement (3rd Trimester)**
    Normally the baby moves at least 10 times in 2 hours. If movement decreases significantly, get checked immediately.

    🔴 **High fever (≥38°C)**
    Fever during pregnancy is dangerous for the baby and indicates an infection that needs immediate treatment.

    🔴 **Severe abdominal pain**
    Especially if localized, does not subside, or is accompanied by bleeding.

    🔴 **Regular contractions before 37 weeks**
    Can indicate premature labor that requires immediate treatment.

    **Remember:** It's better to get checked and find out everything is fine, than to wait and be too late to get help.

    Source: UNICEF Maternal Nutrition; Indonesian Ministry of Health`,
    } as Record<string, string>,

    menuMonitoring: "Monitoring",
    monitoring: "Monitoring",
    monitoringJanin: "Fetal Monitoring",
    monitoringBayi: "Baby Monitoring",
    fetalWeight: "Check Fetal Weight",
    fetalWeightInput: "Fetal Weight (kg)",
    fetalWeightPlaceholder: "Example: 3.2",
    fetalWeightDesc: "Enter fetal weight from ultrasound results",
    headCircInfo: "Fetal Head Circumference Info",
    headCircDesc: "Normal head circumference in 3rd trimester: 33–35 cm",
    checkNowBtn: "Check Now",
    normalResult: "Normal",
    belowNormal: "Below Normal",
    aboveNormal: "Above Normal",
    babyData: "Baby Data",
    babySex: "Sex",
    female: "Female",
    male: "Male",
    babyAge: "Baby Age (months)",
    babyAgePlaceholder: "Example: 8",
    months: "months",
    measurementType: "Measurement Type",
    measurementValue: "Measurement Value",
    weightKg: "Weight (kg)",
    lengthCm: "Length (cm)",
    headCircCm: "Head Circ. (cm)",
    evaluateGrowth: "Evaluate Growth",
    zScore: "Z-Score",
    referenceMonth: "Reference Month",
    zoneNormal: "Normal",
    zoneConcern: "Needs Attention",
    zoneSevere: "Serious",
    consultDoctor: "Please consult a doctor or healthcare professional about your baby's condition.",
    belowNormalMsg: "Fetal weight is below normal. Please consult your doctor.",
    aboveNormalMsg: "Fetal weight is above normal. Please consult your doctor.",
    normalMsg: "Fetal weight is within normal range (2.5–4 kg).",
  },
};

export type TranslationKey = keyof typeof translations.id;