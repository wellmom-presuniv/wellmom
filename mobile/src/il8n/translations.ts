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

    educationBanner: "Menampilkan konten untuk {trimester} · {week}",

    educationTitles: {} as Record<string, string>,
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
  },
};

export type TranslationKey = keyof typeof translations.id;