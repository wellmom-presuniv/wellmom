import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

const SECTIONS = [
  {
    id: "danger",
    icon: "warning" as const,
    color: colors.riskHigh,
    bg: colors.riskHighBg,
    title: "Kapan Harus Segera ke Faskes?",
    subtitle: "Tanda bahaya yang memerlukan penanganan segera",
    items: [
      { icon: "water" as const, label: "Perdarahan atau flek dari jalan lahir" },
      { icon: "head" as const, label: "Sakit kepala berat disertai pandangan kabur" },
      { icon: "body" as const, label: "Bengkak tiba-tiba pada wajah, tangan, atau kaki" },
      { icon: "thermometer" as const, label: "Demam tinggi (≥38°C) yang tidak membaik" },
      { icon: "heart-dislike" as const, label: "Gerakan janin berkurang drastis (trimester 3)" },
      { icon: "medical" as const, label: "Nyeri perut hebat yang tidak mereda" },
    ],
  },
  {
    id: "risk",
    icon: "shield-checkmark" as const,
    color: colors.primary,
    bg: colors.primaryContainer,
    title: "Memahami Kategori Risiko",
    subtitle: "Apa arti hasil self-assessment kamu",
    items: [
      { icon: "checkmark-circle" as const, label: "Risiko Rendah (0–2 poin): Kondisi baik. Tetap rutin ANC dan jaga pola makan." },
      { icon: "information-circle" as const, label: "Risiko Sedang (3–4 poin): Ada hal yang perlu diperhatikan. Konsultasikan saat kunjungan ANC." },
      { icon: "alert-circle" as const, label: "Risiko Tinggi (≥5 poin): Segera konsultasi ke tenaga kesehatan." },
      { icon: "warning" as const, label: "Red Flag: Jawab 'Ya' pada tanda bahaya → langsung Risiko Tinggi tanpa melihat skor." },
    ],
  },
  {
    id: "howto",
    icon: "phone-portrait" as const,
    color: colors.secondary,
    bg: "rgba(113,42,226,0.1)" as const,
    title: "Cara Menggunakan WellMom",
    subtitle: "Panduan singkat penggunaan aplikasi",
    items: [
      { icon: "person-add" as const, label: "Daftar akun dan masukkan HPHT (Hari Pertama Haid Terakhir) saat onboarding." },
      { icon: "pulse" as const, label: "Isi self-assessment setiap hari untuk memantau kondisi kehamilan." },
      { icon: "checkbox" as const, label: "Centang checklist harian untuk memastikan kebiasaan kesehatan terpenuhi." },
      { icon: "book" as const, label: "Baca materi edukasi sesuai trimester kamu untuk pengetahuan lebih lengkap." },
      { icon: "time" as const, label: "Cek riwayat assessment untuk melihat perkembangan kondisi dari waktu ke waktu." },
    ],
  },
  {
    id: "anc",
    icon: "calendar" as const,
    color: colors.riskLow,
    bg: colors.riskLowBg,
    title: "Jadwal ANC yang Dianjurkan",
    subtitle: "Frekuensi kunjungan antenatal care",
    items: [
      { icon: "ellipse" as const, label: "Trimester 1 (0–13 minggu): Minimal 2 kali kunjungan" },
      { icon: "ellipse" as const, label: "Trimester 2 (14–26 minggu): Minimal 1 kali kunjungan" },
      { icon: "ellipse" as const, label: "Trimester 3 (27–40 minggu): Minimal 3 kali kunjungan" },
      { icon: "information-circle" as const, label: "Total minimal 6 kali kunjungan selama kehamilan (standar Kemenkes RI)" },
    ],
  },
];

export default function GuideScreen({ navigation }: any) {
  const [expanded, setExpanded] = useState<string | null>("danger");

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-5 pt-2 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.textPrimary }}>Panduan</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary }}>
            Informasi penting untuk kehamilan sehat
          </Text>
        </View>
      </View>

      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
        {SECTIONS.map((section) => {
          const isOpen = expanded === section.id;
          return (
            <View key={section.id} className="mb-3" style={{ borderRadius: 20, overflow: "hidden" }}>
              <TouchableOpacity
                onPress={() => setExpanded(isOpen ? null : section.id)}
                activeOpacity={0.7}
                style={{ backgroundColor: colors.surface }}
              >
                <View className="flex-row items-center p-4">
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: section.bg, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                    <Ionicons name={section.icon} size={22} color={section.color} />
                  </View>
                  <View className="flex-1">
                    <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.textPrimary }}>{section.title}</Text>
                    <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>{section.subtitle}</Text>
                  </View>
                  <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={18} color={colors.textSecondary} />
                </View>
              </TouchableOpacity>

              {isOpen && (
                <View style={{ backgroundColor: colors.surface, paddingHorizontal: 16, paddingBottom: 16 }}>
                  <View style={{ height: 1, backgroundColor: colors.outlineVariant, marginBottom: 12 }} />
                  {section.items.map((item, idx) => (
                    <View key={idx} className="flex-row items-start mb-3" style={{ gap: 10 }}>
                      <Ionicons name={item.icon} size={16} color={section.color} style={{ marginTop: 2 }} />
                      <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 19 }}>
                        {item.label}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {/* Disclaimer */}
        <View className="p-4 mb-6" style={{ backgroundColor: colors.surfaceContainer, borderRadius: 16 }}>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary, marginBottom: 4 }}>
            ⚕️ Disclaimer
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, lineHeight: 18 }}>
            WellMom adalah alat bantu edukasi, bukan pengganti konsultasi medis. Selalu konsultasikan kondisi Anda kepada tenaga kesehatan yang berkompeten.
          </Text>
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}