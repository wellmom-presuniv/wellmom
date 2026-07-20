import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

const FAQ = [
  { q: "Apa itu HPHT?", a: "HPHT adalah Hari Pertama Haid Terakhir — tanggal pertama menstruasi terakhir sebelum hamil. Digunakan untuk menghitung usia kehamilan dan perkiraan tanggal lahir." },
  { q: "Apa yang dimaksud Red Flag?", a: "Red Flag adalah tanda bahaya kehamilan yang memerlukan perhatian segera, seperti perdarahan, sakit kepala berat, bengkak pada wajah/tangan, atau gerakan janin berkurang." },
  { q: "Bagaimana cara mengisi self-assessment?", a: "Jawab 8 pertanyaan berdasarkan kondisi Anda hari ini dengan memilih 'Ya' atau 'Tidak'. Opsional: masukkan nilai tekanan darah jika tersedia." },
  { q: "Apa arti kategori risiko?", a: "• Risiko Rendah (0–2 poin): Kondisi baik, tetap rutin ANC\n• Risiko Sedang (3–4 poin): Ada hal yang perlu diperhatikan\n• Risiko Tinggi (≥5 poin atau Red Flag): Segera konsultasi ke tenaga kesehatan" },
  { q: "Apakah data saya aman?", a: "Data Anda disimpan secara terenkripsi dan hanya dapat diakses oleh Anda sendiri. Kami tidak membagikan data ke pihak ketiga." },
  { q: "Kapan harus segera ke fasilitas kesehatan?", a: "Segera ke fasilitas kesehatan jika mengalami: perdarahan, sakit kepala berat disertai pandangan kabur, bengkak tiba-tiba pada wajah/tangan, atau gerakan janin berkurang drastis." },
];

export default function HelpScreen({ navigation }: any) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-5 pt-2 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.textPrimary }}>Bantuan</Text>
      </View>

      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.textPrimary, marginBottom: 12 }}>
          Pertanyaan Umum (FAQ)
        </Text>

        {FAQ.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => setExpanded(expanded === idx ? null : idx)}
            className="mb-3 p-4"
            style={{ backgroundColor: colors.surface, borderRadius: 16 }}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-between">
              <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.textPrimary, flex: 1, marginRight: 8 }}>
                {item.q}
              </Text>
              <Ionicons name={expanded === idx ? "chevron-up" : "chevron-down"} size={18} color={colors.textSecondary} />
            </View>
            {expanded === idx && (
              <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, lineHeight: 20, marginTop: 10 }}>
                {item.a}
              </Text>
            )}
          </TouchableOpacity>
        ))}

        <View className="p-4 mb-6" style={{ backgroundColor: colors.primaryContainer, borderRadius: 16, opacity: 0.9 }}>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.primary, marginBottom: 4 }}>
            Masih ada pertanyaan?
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary }}>
            Hubungi tim WellMom melalui koordinator medis Anda atau melalui fasilitas kesehatan terdekat.
          </Text>
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}