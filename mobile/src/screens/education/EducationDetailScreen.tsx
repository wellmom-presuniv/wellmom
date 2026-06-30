import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

// TODO: konten ini DUMMY/placeholder (diadaptasi dari referensi desain), BUKAN konten medis final.
// Wajib diganti dengan materi yang sudah direview dr. Nucky sebelum rilis — jangan dipakai apa adanya.
const DUMMY_DETAIL: Record<string, {
    badge: string;
    readTime: string;
    title: string;
    description: string;
    sections: { trimester: number; range: string; intro: string; points: { title: string; body: string }[] }[];
    note?: string;
  }> = {
  "1": {
    badge: "Panduan Trimester",
    readTime: "5 Min Baca",
    title: "Nutrisi Penting per Trimester",
    description: "Panduan lengkap memenuhi kebutuhan gizi janin sesuai tahap perkembangannya.",
    sections: [
      {
        trimester: 1,
        range: "0–13 Minggu",
        intro: "Fokus utama pada awal kehamilan adalah pembentukan organ vital dan sistem saraf.",
        points: [
          { title: "Asam Folat (B9)", body: "Sangat krusial untuk mencegah cacat tabung saraf. Ditemukan di bayam, brokoli, dan kacang-kacangan." },
          { title: "Vitamin B6", body: "Membantu mengurangi gejala mual (morning sickness)." },
        ],
      },
      {
        trimester: 2,
        range: "14–26 Minggu",
        intro: "Masa pertumbuhan pesat tulang dan jaringan bayi. Kebutuhan kalori mulai meningkat.",
        points: [
          { title: "Kalsium & Vitamin D", body: "Penting untuk pembentukan tulang dan gigi bayi. Sumber: Susu, yogurt, dan tahu." },
          { title: "Zat Besi", body: "Volume darah ibu meningkat, zat besi mencegah anemia." },
        ],
      },
    ],
    note: "Hindari daging mentah, ikan bermerkuri tinggi, dan produk susu yang tidak dipasteurisasi selama masa kehamilan untuk mencegah infeksi bakteri.",
  },
};

export default function EducationDetailScreen({ route, navigation }: any) {
  const { id } = route.params ?? { id: "1" };
  const content = DUMMY_DETAIL[id];

  if (!content) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
        <Ionicons name="construct-outline" size={40} color={colors.textSecondary} />
        <Text style={{ fontFamily: fonts.semibold, color: colors.textSecondary, marginTop: 12, textAlign: "center" }}>
          Konten sedang disiapkan tim medis.
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={{ fontFamily: fonts.bold, color: colors.primary }}>Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner header */}
        <View style={{ height: 200, backgroundColor: colors.primaryContainer, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="restaurant" size={56} color="#FFFFFF" />
        </View>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "rgba(255,255,255,0.85)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        <View
          className="px-5 pt-5"
          style={{ backgroundColor: colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -24 }}
        >
          <View className="flex-row items-center mb-3" style={{ gap: 8 }}>
            <View style={{ backgroundColor: colors.surfaceContainer, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 }}>
              <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: colors.primary }}>{content.badge}</Text>
            </View>
            <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary }}>{content.readTime}</Text>
          </View>

          <Text style={{ fontFamily: fonts.extrabold, fontSize: 22, color: colors.textPrimary, marginBottom: 6 }}>
            {content.title}
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: 20 }}>
            {content.description}
          </Text>

          {content.sections.map((section) => (
            <View key={section.trimester} style={{ marginBottom: 16 }}>
              <View className="flex-row items-center mb-2" style={{ gap: 8 }}>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: section.trimester === 1 ? colors.primary : colors.secondary,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: "#FFFFFF" }}>{section.trimester}</Text>
                </View>
                <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.textPrimary }}>
                  Trimester {section.trimester === 1 ? "Pertama" : "Kedua"} ({section.range})
                </Text>
              </View>

              <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 16 }}>
                <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: 10 }}>
                  {section.intro}
                </Text>
                {section.points.map((p) => (
                  <View key={p.title} className="flex-row mb-2" style={{ gap: 8 }}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.riskLow} style={{ marginTop: 2 }} />
                    <View className="flex-1">
                      <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.textPrimary }}>{p.title}</Text>
                      <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, lineHeight: 17 }}>
                        {p.body}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}

          {content.note && (
            <View
              className="flex-row mb-6 p-4"
              style={{ backgroundColor: colors.riskMediumBg, borderRadius: 16, gap: 10 }}
            >
              <Ionicons name="warning" size={18} color={colors.riskMedium} />
              <View className="flex-1">
                <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.riskMedium, marginBottom: 2 }}>
                  Catatan Penting
                </Text>
                <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, lineHeight: 17 }}>
                  {content.note}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity activeOpacity={0.85} style={{ marginBottom: 24 }}>
            <View
              style={{
                backgroundColor: colors.primary,
                borderRadius: 999,
                paddingVertical: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
              <Text style={{ fontFamily: fonts.semibold, color: "#FFFFFF" }}>Tandai Selesai</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}