# Simpan ke backend/database/seeds/seed_education.py (replace isi lama)

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

import asyncio
import uuid
from app.database import AsyncSessionLocal
from sqlalchemy import text

EDUCATION_CONTENT = [
    {
        "title": "Gizi Seimbang Ibu Hamil",
        "category": "nutrisi",
        "trimester": None,
        "order_in_category": 1,
        "body": """Ibu hamil harus mengonsumsi makanan yang beranekaragam baik proporsi maupun jumlahnya karena harus memenuhi kebutuhan zat gizi untuk dirinya dan untuk pertumbuhan serta perkembangan janin.

**13 Pesan Umum Gizi Seimbang (Kemenkes RI)**
1. Makan aneka ragam makanan
2. Makan makanan yang memenuhi kebutuhan energi
3. Makan sumber karbohidrat setengah dari kebutuhan energi
4. Batasi lemak seperempat dari kecukupan energi
5. Gunakan garam beryodium
6. Makan makanan sumber zat besi
7. Biasakan makan pagi
8. Minum air bersih, aman, dan cukup jumlahnya
9. Beraktivitas fisik dan olahraga secara teratur
10. Hindari minuman beralkohol
11. Makan makanan yang aman bagi kesehatan
12. Baca label pada makanan kemasan

**4 Pesan Khusus untuk Ibu Hamil:**
- Biasakan mengonsumsi aneka ragam makanan
- Batasi mengonsumsi garam
- Minum air putih yang banyak
- Batasi minum kopi

**Makanan yang Perlu Dihindari:**
❌ Makanan yang diawetkan dengan bahan tambahan berbahaya
❌ Daging/telur/ikan yang dimasak kurang matang
❌ Kafein berlebih (kopi, coklat) — dapat meningkatkan tekanan darah
❌ Makanan tinggi gula dan lemak (keripik, kue)
❌ Makanan yang mengandung gas berlebih (nangka, kol)
❌ Minuman ringan (soft drink)

Sumber: Kemenkes RI, Pedoman Gizi Seimbang 2014"""
    },
    {
        "title": "Nutrisi Penting Trimester 1",
        "category": "nutrisi",
        "trimester": 1,
        "order_in_category": 1,
        "body": """Trimester pertama adalah masa kritis pembentukan organ vital bayi. Berikut nutrisi yang paling penting:

**Folat dan Asam Folat**
Berperan mencegah cacat tabung saraf (neural tube defect) pada otak dan sumsum tulang belakang bayi. ACOG merekomendasikan 600–800 mcg folat per hari selama kehamilan.

Sumber folat: hati ayam, kacang-kacangan, telur, sayuran berdaun hijau tua, kacang polong.

Suplemen asam folat terbukti menurunkan risiko kelahiran prematur. Idealnya dimulai 3 bulan sebelum pembuahan.

**Zat Besi**
Tubuh membutuhkan zat besi 2x lipat dari wanita tidak hamil — yaitu 27 mg/hari. Zat besi dibutuhkan untuk membuat hemoglobin yang mengantarkan oksigen ke bayi.

Kekurangan zat besi menyebabkan anemia defisiensi besi yang dapat memicu:
- Kelahiran prematur
- Bayi lahir berat badan rendah (BBLR)
- Kelelahan berlebih pada ibu

Sumber: daging merah tanpa lemak, unggas, ikan, sereal diperkaya zat besi, kacang-kacangan, sayuran.

**Vitamin B6**
Membantu mengurangi gejala mual (morning sickness).
Sumber: pisang, ubi jalar, ayam, ikan.

**Tips Trimester 1:**
- Makan dalam porsi kecil tapi sering untuk mengatasi mual
- Hindari bau makanan yang memicu mual
- Istirahat cukup

Sumber: Kemenkes RI; UNICEF Maternal Nutrition"""
    },
    {
        "title": "Nutrisi Penting Trimester 2",
        "category": "nutrisi",
        "trimester": 2,
        "order_in_category": 1,
        "body": """Trimester kedua adalah masa pertumbuhan pesat tulang, otot, dan sistem saraf bayi. Kebutuhan kalori meningkat sekitar 340 kalori/hari.

**Kalsium**
Penting untuk membentuk tulang dan gigi bayi yang kuat, serta membantu sistem peredaran darah, otot, dan saraf ibu.

Kebutuhan: 1.000 mg/hari (bisa dibagi 2 dosis 500 mg). Sumber: susu, yogurt, keju, ikan salmon, udang, tahu, sayuran berdaun hijau tua.

**Vitamin D**
Membantu membangun tulang dan gigi bayi yang kuat. Kebutuhan: 600 IU/hari.
Sumber: ikan berlemak (salmon), susu, jus jeruk.

**Protein**
Mendukung pertumbuhan jaringan dan organ bayi termasuk otak, serta pertumbuhan jaringan payudara dan rahim ibu.

Kebutuhan: 70–100 gram/hari (tergantung berat badan dan trimester).
Sumber: daging sapi tanpa lemak, ayam, salmon, kacang-kacangan, selai kacang, keju cottage.

**Omega-3 (DHA)**
Penting untuk perkembangan otak dan mata bayi.
Sumber: ikan salmon, sarden, suplemen minyak ikan.

**Tips Trimester 2:**
- Perhatikan pertambahan berat badan (ideal: 0,5 kg/minggu)
- Perbanyak serat untuk mencegah sembelit
- Mulai latihan ringan seperti jalan kaki atau yoga prenatal

Sumber: Kemenkes RI; UNICEF Maternal Nutrition"""
    },
    {
        "title": "Nutrisi Penting Trimester 3",
        "category": "nutrisi",
        "trimester": 3,
        "order_in_category": 1,
        "body": """Trimester ketiga adalah persiapan akhir bayi sebelum lahir. Kebutuhan kalori meningkat sekitar 450 kalori/hari.

**Kalsium & Vitamin D**
Bayi menyerap kalsium besar-besaran untuk perkembangan tulang. Pastikan 1.000 mg kalsium dan 600 IU vitamin D terpenuhi setiap hari.

**Zat Besi**
Bayi mulai menyimpan cadangan zat besi untuk 6 bulan pertama kehidupannya. Tetap konsumsi 27 mg zat besi/hari dan konsumsi bersama vitamin C untuk penyerapan optimal.

**Vitamin K**
Penting untuk pembekuan darah bayi saat lahir.
Sumber: sayuran hijau (bayam, kangkung, brokoli).

**Serat & Air**
Mencegah sembelit dan wasir yang umum di trimester 3. Minum minimal 8–10 gelas air/hari.

**Tips Trimester 3:**
- Makan dalam porsi kecil dan sering (rahim membesar menekan lambung)
- Hindari makanan pedas dan berlemak (memicu heartburn)
- Persiapkan nutrisi untuk menyusui setelah melahirkan
- Konsultasikan dengan dokter soal suplemen tambahan yang dibutuhkan

Sumber: Kemenkes RI; UNICEF Maternal Nutrition"""
    },
    {
        "title": "Tablet Tambah Darah untuk Ibu Hamil",
        "category": "tablet_tambah_darah",
        "trimester": None,
        "order_in_category": 1,
        "body": """Tablet Tambah Darah (TTD) adalah suplemen zat besi dan asam folat yang wajib dikonsumsi ibu hamil untuk mencegah anemia defisiensi besi.

**Mengapa Penting?**
Selama kehamilan, volume darah ibu meningkat signifikan dan tubuh membutuhkan zat besi 2x lipat. Kekurangan zat besi dapat menyebabkan:
- Kelahiran prematur
- Bayi lahir dengan berat badan rendah (BBLR)
- Perdarahan berlebih saat persalinan
- Kelelahan dan penurunan imunitas ibu
- Depresi postpartum

**Anjuran Konsumsi**
- 1 tablet setiap hari selama kehamilan
- Minum pada malam hari sebelum tidur (mengurangi efek samping mual)
- Minum bersama air putih atau jus jeruk (vitamin C meningkatkan penyerapan)
- JANGAN minum bersama teh, kopi, atau susu (menghambat penyerapan zat besi)

**Efek Samping yang Normal**
- Tinja berwarna hitam (normal, tidak berbahaya)
- Mual ringan
- Sembelit → atasi dengan perbanyak minum air dan makan serat

**Kapan Mulai?**
Sejak trimester pertama hingga 3 bulan setelah melahirkan (untuk yang menyusui).

**Program Pemerintah**
TTD tersedia gratis di Puskesmas dan Posyandu dalam program kesehatan ibu hamil Kementerian Kesehatan RI.

Sumber: Kemenkes RI, Pedoman Gizi Seimbang; UNICEF Maternal Nutrition"""
    },
    {
        "title": "Mengenali Tanda Bahaya Kehamilan",
        "category": "tanda_bahaya",
        "trimester": None,
        "order_in_category": 1,
        "body": """Mengenali tanda bahaya kehamilan sejak dini sangat penting untuk mencegah komplikasi yang mengancam jiwa ibu dan bayi. UNICEF menyebutkan bahwa kesadaran ibu akan tanda bahaya adalah strategi fundamental dalam perawatan antenatal.

**Segera ke Fasilitas Kesehatan Jika Mengalami:**

🔴 **Perdarahan dari jalan lahir**
Perdarahan kapanpun selama kehamilan harus segera dievaluasi. Dapat menandakan plasenta previa, solusio plasenta, atau ancaman keguguran.

🔴 **Sakit kepala berat yang tidak membaik**
Terutama jika disertai pandangan kabur, nyeri ulu hati, atau pembengkakan. Dapat merupakan tanda preeklamsia.

🔴 **Bengkak tiba-tiba pada wajah, tangan, atau kaki**
Bengkak yang muncul mendadak dan parah bisa menandakan preeklamsia, terutama jika disertai tekanan darah tinggi.

🔴 **Gerakan janin berkurang drastis (Trimester 3)**
Normalnya bayi bergerak minimal 10 kali dalam 2 jam. Jika gerakan berkurang signifikan, segera periksa.

🔴 **Demam tinggi (≥38°C)**
Demam selama kehamilan berbahaya bagi janin dan menandakan infeksi yang perlu segera ditangani.

🔴 **Nyeri perut hebat**
Terutama jika terlokalisir, tidak mereda, atau disertai perdarahan.

🔴 **Kontraksi teratur sebelum 37 minggu**
Dapat menandakan persalinan prematur yang membutuhkan penanganan segera.

**Ingat:** Lebih baik memeriksakan diri dan ternyata baik-baik saja, daripada menunggu dan terlambat mendapat pertolongan.

Sumber: UNICEF Maternal Nutrition; Kemenkes RI"""
    },
    {
        "title": "Persiapan Menjelang Persalinan",
        "category": "persiapan_persalinan",
        "trimester": 3,
        "order_in_category": 1,
        "body": """Persiapan yang matang menjelang persalinan membantu ibu menghadapi proses kelahiran dengan lebih tenang dan siap.

**Persiapan Fisik**

*Senam Hamil & Yoga Prenatal*
Melatih otot panggul dan pernapasan. Konsultasikan dengan dokter/bidan sebelum memulai.

*Teknik Pernapasan*
Latih pernapasan dalam untuk mengelola nyeri saat kontraksi. Tarik napas perlahan melalui hidung, hembuskan melalui mulut.

*Nutrisi Jelang Persalinan*
Pertahankan asupan zat besi, kalsium, dan protein. Pastikan minum air cukup (8–10 gelas/hari). Simpan energi dengan istirahat cukup (8–9 jam/malam).

**Persiapan Mental**
- Ikuti kelas persiapan persalinan
- Diskusikan birth plan dengan dokter/bidan
- Pelajari tahapan proses persalinan
- Bangun support system dengan pasangan dan keluarga

**Tas Persalinan — Yang Perlu Disiapkan**

Untuk Ibu:
- Dokumen (KTP, kartu BPJS, buku KIA, hasil USG)
- Pakaian ganti (2–3 stel)
- Perlengkapan mandi dan perawatan diri
- Makanan ringan dan minuman

Untuk Bayi:
- Pakaian bayi (3–5 stel berbagai ukuran)
- Popok bayi
- Selimut dan bedong
- Topi dan kaos kaki bayi

**Tanda-tanda Persalinan Sudah Dekat**
- Kontraksi teratur yang semakin kuat dan sering
- Pecah ketuban (segera ke RS)
- Keluar lendir bercampur darah (bloody show)
- Bayi terasa 'turun' ke panggul

**Kapan Harus ke Rumah Sakit?**
Aturan 5-1-1: kontraksi setiap 5 menit, berlangsung 1 menit, selama 1 jam berturut-turut.

Sumber: Kemenkes RI; UNICEF Maternal Nutrition"""
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