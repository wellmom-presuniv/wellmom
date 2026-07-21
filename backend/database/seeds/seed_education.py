import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

import asyncio
import uuid
from app.database import AsyncSessionLocal
from sqlalchemy import text

EDUCATION_CONTENT = [
    # ===== NUTRISI PER TRIMESTER =====
    {
        "title": "Nutrisi Trimester 1",
        "category": "nutrisi",
        "trimester": 1,
        "order_in_category": 1,
        "body": """Trimester pertama adalah masa kritis pembentukan organ vital bayi. Fokus utama nutrisi pada periode ini adalah:

**Asam Folat (B9)**
Sangat penting untuk mencegah cacat tabung saraf (neural tube defect). Kebutuhan: 400-800 mcg/hari. Sumber: bayam, brokoli, kacang-kacangan, hati ayam, dan suplemen asam folat.

**Vitamin B6**
Membantu mengurangi gejala mual (morning sickness). Sumber: pisang, ubi jalar, ayam, dan ikan tuna.

**Zat Besi**
Mencegah anemia dan mendukung pembentukan sel darah merah. Kebutuhan: 27 mg/hari. Sumber: daging merah, hati, bayam, dan kacang-kacangan.

**Tips Penting:**
- Konsumsi suplemen asam folat sejak sebelum hamil hingga trimester pertama
- Hindari daging mentah, ikan bermerkuri tinggi (tuna sirip biru, ikan todak), dan produk susu yang tidak dipasteurisasi
- Makan dalam porsi kecil tapi sering untuk mengatasi mual"""
    },
    {
        "title": "Nutrisi Trimester 2",
        "category": "nutrisi",
        "trimester": 2,
        "order_in_category": 2,
        "body": """Trimester kedua adalah masa pertumbuhan pesat tulang, otot, dan sistem saraf bayi. Kebutuhan kalori mulai meningkat sekitar 340 kalori/hari.

**Kalsium & Vitamin D**
Penting untuk pembentukan tulang dan gigi bayi. Kebutuhan kalsium: 1.000 mg/hari. Sumber: susu, yogurt, keju, tahu, tempe, dan ikan teri.

**Zat Besi**
Volume darah ibu meningkat signifikan, zat besi sangat penting untuk mencegah anemia. Konsumsi bersama vitamin C untuk penyerapan optimal.

**Protein**
Mendukung pertumbuhan jaringan bayi. Kebutuhan: 70-100 g/hari. Sumber: daging ayam, ikan, telur, tahu, tempe, dan kacang-kacangan.

**Omega-3 (DHA)**
Penting untuk perkembangan otak dan mata bayi. Sumber: ikan salmon, sarden, dan suplemen minyak ikan.

**Tips Penting:**
- Mulai perhatikan pertambahan berat badan (ideal: 0,5 kg/minggu di trimester 2)
- Perbanyak serat untuk mencegah sembelit yang umum terjadi"""
    },
    {
        "title": "Nutrisi Trimester 3",
        "category": "nutrisi",
        "trimester": 3,
        "order_in_category": 3,
        "body": """Trimester ketiga adalah persiapan akhir bayi sebelum lahir. Kebutuhan kalori meningkat sekitar 450 kalori/hari.

**Kalsium**
Bayi menyerap kalsium besar-besaran untuk perkembangan tulang. Pastikan asupan 1.000 mg/hari terpenuhi.

**Zat Besi**
Bayi mulai menyimpan cadangan zat besi untuk 6 bulan pertama kehidupannya. Kebutuhan tetap 27 mg/hari.

**Vitamin K**
Penting untuk pembekuan darah bayi saat lahir. Sumber: sayuran hijau (bayam, kangkung, brokoli).

**Serat & Air**
Penting untuk mencegah sembelit dan wasir yang umum di trimester 3. Minum minimal 8-10 gelas air/hari.

**Tips Penting:**
- Makan dalam porsi kecil dan sering karena rahim yang membesar menekan lambung
- Hindari makanan pedas dan berlemak yang memicu heartburn
- Persiapkan nutrisi untuk menyusui setelah melahirkan"""
    },

    # ===== TABLET TAMBAH DARAH =====
    {
        "title": "Tablet Tambah Darah untuk Ibu Hamil",
        "category": "tablet_tambah_darah",
        "trimester": None,
        "order_in_category": 1,
        "body": """Tablet Tambah Darah (TTD) adalah suplemen zat besi dan asam folat yang wajib dikonsumsi ibu hamil untuk mencegah anemia.

**Mengapa Penting?**
Anemia pada ibu hamil dapat menyebabkan:
- Kelahiran prematur
- Bayi lahir dengan berat badan rendah (BBLR)
- Perdarahan berlebih saat persalinan
- Kelelahan dan penurunan imunitas ibu

**Anjuran Konsumsi**
- Diminum 1 tablet setiap hari selama kehamilan
- Minum pada malam hari sebelum tidur untuk mengurangi efek samping mual
- Minum bersama air putih atau jus jeruk (vitamin C membantu penyerapan)
- JANGAN minum bersama teh, kopi, atau susu (menghambat penyerapan)

**Efek Samping yang Normal**
- Tinja berwarna hitam (normal, tidak berbahaya)
- Mual ringan
- Sembelit (atasi dengan perbanyak minum air dan serat)

**Kapan Mulai?**
Sejak trimester pertama hingga 3 bulan setelah melahirkan (untuk yang menyusui).

**Program Pemerintah**
TTD tersedia gratis di Puskesmas dan Posyandu dalam program kesehatan ibu hamil Kementerian Kesehatan RI."""
    },

    # ===== MAKANAN SEHAT =====
    {
        "title": "Panduan Makanan Sehat Ibu Hamil",
        "category": "makanan_sehat",
        "trimester": None,
        "order_in_category": 1,
        "body": """Pola makan sehat selama kehamilan sangat menentukan kesehatan ibu dan tumbuh kembang bayi.

**Prinsip Gizi Seimbang**
Setiap kali makan, usahakan terdiri dari:
- Karbohidrat kompleks (nasi merah, ubi, jagung)
- Protein (daging, ikan, telur, tahu, tempe)
- Lemak sehat (alpukat, minyak zaitun, kacang-kacangan)
- Sayuran berwarna-warni
- Buah-buahan

**Makanan yang Dianjurkan**
✅ Ikan salmon, sarden, kembung (kaya omega-3, rendah merkuri)
✅ Telur matang sempurna (protein dan kolin untuk otak bayi)
✅ Bayam, kangkung, brokoli (zat besi, kalsium, folat)
✅ Ubi jalar (beta karoten, vitamin C, serat)
✅ Kacang-kacangan (protein, serat, magnesium)
✅ Alpukat (folat, kalium, lemak sehat)
✅ Susu dan produk olahannya (kalsium, protein)

**Makanan yang Perlu Dihindari**
❌ Ikan bermerkuri tinggi (tuna sirip biru, ikan todak, hiu)
❌ Daging dan telur mentah atau setengah matang
❌ Susu dan keju yang tidak dipasteurisasi
❌ Makanan olahan tinggi garam dan gula
❌ Kafein berlebih (maksimal 200mg/hari)
❌ Alkohol (tidak ada batas aman selama kehamilan)"""
    },

    # ===== TANDA BAHAYA KEHAMILAN =====
    {
        "title": "Mengenali Tanda Bahaya Kehamilan",
        "category": "tanda_bahaya",
        "trimester": None,
        "order_in_category": 1,
        "body": """Mengenali tanda bahaya kehamilan sejak dini sangat penting untuk mencegah komplikasi yang mengancam jiwa ibu dan bayi.

**Segera ke Fasilitas Kesehatan Jika Mengalami:**

🔴 **Perdarahan dari jalan lahir**
Perdarahan kapanpun selama kehamilan harus segera dievaluasi. Bisa menandakan plasenta previa, solusio plasenta, atau ancaman keguguran.

🔴 **Sakit kepala berat yang tidak membaik**
Terutama jika disertai pandangan kabur, nyeri ulu hati, atau pembengkakan. Bisa merupakan tanda preeklamsia.

🔴 **Bengkak tiba-tiba pada wajah, tangan, atau kaki**
Bengkak yang muncul mendadak dan parah bisa menandakan preeklamsia, terutama jika disertai tekanan darah tinggi.

🔴 **Gerakan janin berkurang drastis (Trimester 3)**
Normalnya bayi bergerak minimal 10 kali dalam 2 jam. Jika gerakan berkurang signifikan, segera periksa.

🔴 **Demam tinggi (≥38°C)**
Demam selama kehamilan bisa berbahaya bagi janin dan menandakan infeksi yang perlu segera ditangani.

🔴 **Nyeri perut hebat**
Terutama jika terlokalisir, tidak mereda, atau disertai perdarahan.

🔴 **Kontraksi teratur sebelum 37 minggu**
Bisa menandakan persalinan prematur yang membutuhkan penanganan segera.

**Ingat:** Lebih baik memeriksakan diri dan ternyata baik-baik saja, daripada menunggu dan terlambat mendapat pertolongan."""
    },

    # ===== PERSIAPAN PERSALINAN =====
    {
        "title": "Persiapan Menjelang Persalinan",
        "category": "persiapan_persalinan",
        "trimester": 3,
        "order_in_category": 1,
        "body": """Persiapan yang matang menjelang persalinan membantu ibu menghadapi proses kelahiran dengan lebih tenang dan siap.

**Persiapan Fisik**

*Senam Hamil*
Lakukan senam hamil atau yoga prenatal secara rutin untuk melatih otot panggul dan pernapasan. Konsultasikan dengan dokter/bidan sebelum memulai.

*Teknik Pernapasan*
Latih teknik pernapasan dalam untuk membantu mengelola nyeri saat kontraksi. Tarik napas perlahan melalui hidung, hembuskan melalui mulut.

*Istirahat Cukup*
Simpan energi untuk persalinan dengan tidur 8-9 jam malam dan istirahat siang.

**Persiapan Mental**
- Ikuti kelas persiapan persalinan
- Diskusikan birth plan dengan dokter/bidan
- Pelajari tahapan proses persalinan
- Bangun support system dengan pasangan dan keluarga

**Tas Persalinan — Yang Perlu Disiapkan**

Untuk Ibu:
- Dokumen (KTP, kartu BPJS, buku KIA, hasil USG)
- Pakaian ganti ibu (2-3 stel)
- Perlengkapan mandi dan perawatan diri
- Makanan ringan dan minuman

Untuk Bayi:
- Pakaian bayi (3-5 stel berbagai ukuran)
- Popok bayi
- Selimut dan bedong
- Topi dan kaos kaki bayi

**Tanda-tanda Persalinan Sudah Dekat**
- Kontraksi teratur yang semakin kuat dan sering
- Pecah ketuban (segera ke RS)
- Keluar lendir bercampur darah (bloody show)
- Bayi terasa 'turun' ke panggul

**Kapan Harus ke Rumah Sakit?**
Aturan 5-1-1: kontraksi setiap 5 menit, berlangsung 1 menit, selama 1 jam."""
    },
]

async def seed():
    async with AsyncSessionLocal() as db:
        result = await db.execute(text("SELECT COUNT(*) FROM education_contents"))
        count = result.scalar()
        if count > 0:
            print(f"⚠️  education_contents sudah ada {count} data, skip seeding.")
            return

        for item in EDUCATION_CONTENT:
            await db.execute(text("""
                INSERT INTO education_contents (content_id, title, body, category, trimester, order_in_category, is_published, created_at)
                VALUES (:content_id, :title, :body, :category, :trimester, :order_in_category, true, NOW())
            """), {
                "content_id": str(uuid.uuid4()),
                "title": item["title"],
                "body": item["body"],
                "category": item["category"],
                "trimester": item["trimester"],
                "order_in_category": item["order_in_category"],
            })

        await db.commit()
        print(f"✅ {len(EDUCATION_CONTENT)} education content di-seed.")

if __name__ == "__main__":
    asyncio.run(seed())