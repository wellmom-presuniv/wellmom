# Tambahkan ke backend/database/seeds/seed_education_tambahan.py

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

import asyncio
import uuid
from app.database import AsyncSessionLocal
from sqlalchemy import text

TAMBAHAN = [
    {
        "title": "Mengatasi Mual di Trimester Pertama",
        "category": "nutrisi",
        "trimester": 1,
        "order_in_category": 2,
        "body": """Mual dan muntah (morning sickness) adalah keluhan yang sangat umum di trimester pertama — dialami oleh sekitar 70-80% ibu hamil. Kondisi ini umumnya normal dan membaik setelah minggu ke-12 hingga ke-14.

**Mengapa Terjadi?**
Mual dipicu oleh peningkatan hormon hCG dan estrogen yang melonjak pesat di awal kehamilan.

**Tips Mengatasi Mual**

*Pola Makan*
- Makan dalam porsi kecil tapi sering (5–6 kali sehari)
- Jangan biarkan perut kosong
- Makan biskuit atau crackers tawar sebelum bangun dari tempat tidur
- Hindari makanan berlemak, pedas, dan berbau menyengat

*Makanan yang Membantu*
✅ Jahe — terbukti efektif (teh jahe, permen jahe)
✅ Pisang — mudah dicerna, kaya vitamin B6
✅ Sup bening — cairan dan nutrisi tanpa membebani lambung
✅ Crackers/biskuit tawar
✅ Buah dingin (semangka, melon)

*Cairan*
- Minum air putih sedikit-sedikit tapi sering
- Hindari minum banyak saat makan
- Coba air dingin atau es batu kecil

*Perubahan Gaya Hidup*
- Istirahat cukup — kelelahan memperburuk mual
- Hindari bau yang memicu mual
- Ventilasi ruangan yang baik

**Kapan Harus ke Dokter?**
🔴 Tidak bisa makan/minum sama sekali selama 24 jam
🔴 Urin sangat sedikit dan berwarna gelap (dehidrasi)
🔴 Berat badan turun signifikan
🔴 Muntah lebih dari 3–4 kali sehari terus-menerus

Kondisi mual muntah parah disebut Hiperemesis Gravidarum dan memerlukan penanganan medis.

Sumber: Kemenkes RI; UNICEF Maternal Nutrition"""
    },
    {
        "title": "Makanan yang Perlu Dihindari Ibu Hamil",
        "category": "makanan_sehat",
        "trimester": None,
        "order_in_category": 1,
        "body": """Selama kehamilan, sistem imun ibu lebih rentan terhadap infeksi. Beberapa makanan perlu dihindari untuk melindungi ibu dan janin.

**Makanan yang Harus Dihindari**

🔴 **Daging, ikan, dan telur mentah atau setengah matang**
Dapat mengandung bakteri Salmonella, Listeria, atau parasit Toxoplasma.
- Hindari: sashimi, sushi ikan mentah, steak medium-rare, telur setengah matang

🔴 **Ikan dengan kandungan merkuri tinggi**
Merkuri dapat merusak sistem saraf janin.
- Hindari: tuna sirip biru, ikan todak, hiu, king mackerel
- Aman: salmon, sarden, kembung, lele, udang

🔴 **Produk susu dan keju tidak dipasteurisasi**
Berisiko mengandung bakteri Listeria.
- Hindari: susu segar mentah, keju lunak tidak dipasteurisasi

🔴 **Makanan yang diawetkan dengan bahan tambahan berbahaya**

**Makanan yang Perlu Dibatasi**

⚠️ **Kafein** — maksimal 200 mg/hari (setara 1 cangkir kopi)
Kafein berlebih meningkatkan risiko keguguran dan berat badan lahir rendah.

⚠️ **Garam berlebih** — dapat memperburuk pembengkakan dan tekanan darah tinggi

⚠️ **Gula dan lemak tinggi** — menyebabkan kenaikan berat badan berlebih

⚠️ **Makanan yang mengandung gas** (nangka, kol, ubi jalar) — menyebabkan kembung dan nyeri ulu hati

**Minuman yang Harus Dihindari**
❌ Alkohol — tidak ada batas aman selama kehamilan
❌ Minuman energi — mengandung kafein dan stimulan berbahaya
❌ Soft drink berlebih — tinggi gula, tidak bergizi

Sumber: Kemenkes RI, Pedoman Gizi Seimbang; UNICEF Maternal Nutrition"""
    },
    {
        "title": "Persiapan Nutrisi untuk Menyusui",
        "category": "nutrisi",
        "trimester": 3,
        "order_in_category": 2,
        "body": """Persiapan nutrisi untuk menyusui sebaiknya dimulai sejak trimester ketiga. Kualitas ASI sangat dipengaruhi oleh nutrisi ibu.

**Mengapa Penting?**
Selama menyusui, kebutuhan kalori ibu meningkat sekitar 500 kalori/hari. Jika asupan kurang, cadangan nutrisi ibu sendiri yang akan terkuras.

**Nutrisi Kunci untuk Menyusui**

**Cairan**
Produksi ASI membutuhkan banyak cairan. Minum minimal 8–12 gelas air/hari. Biasakan minum segelas air setiap kali menyusui.

**Protein**
70–100 gram/hari untuk menjaga kualitas ASI dan pemulihan tubuh.
Sumber: daging ayam, ikan, telur, tahu, tempe, kacang-kacangan.

**Kalsium**
Tetap 1.000 mg/hari — jika kurang, tubuh mengambil dari tulang ibu.
Sumber: susu, yogurt, keju, ikan teri, sayuran hijau.

**Zat Besi**
Lanjutkan tablet tambah darah hingga 3 bulan setelah melahirkan (sesuai anjuran Kemenkes RI).

**Makanan Pelancar ASI**
✅ Daun katuk — terbukti meningkatkan produksi ASI
✅ Kacang-kacangan (almond, kacang tanah)
✅ Oatmeal
✅ Sayuran hijau (bayam, kangkung)

**Yang Perlu Dibatasi Saat Menyusui**
- Kafein — dapat masuk ke ASI dan membuat bayi rewel
- Alkohol — hindari sepenuhnya
- Ikan bermerkuri tinggi — merkuri dapat masuk ke ASI

**Tips Menyusui yang Sukses**
- Susui sesering mungkin di awal (8–12 kali/24 jam)
- Pastikan perlekatan (latch) yang benar
- Istirahat cukup — kelelahan dapat menurunkan produksi ASI
- Dukungan keluarga sangat penting

Sumber: Kemenkes RI; UNICEF Maternal and Breastfeeding Nutrition"""
    },
]

async def seed():
    async with AsyncSessionLocal() as db:
        for item in TAMBAHAN:
            # Cek apakah sudah ada
            result = await db.execute(
                text("SELECT COUNT(*) FROM education_contents WHERE title = :title"),
                {"title": item["title"]}
            )
            if result.scalar() > 0:
                print(f"⚠️  '{item['title']}' sudah ada, skip.")
                continue

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
            print(f"✅ '{item['title']}' di-seed.")

        await db.commit()
        print("🎉 Selesai.")

if __name__ == "__main__":
    asyncio.run(seed())