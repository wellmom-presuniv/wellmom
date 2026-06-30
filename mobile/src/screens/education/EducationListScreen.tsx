import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

// TODO: ganti ke API Alek begitu endpoint GET /education-content ready.
// Struktur UI di bawah ga perlu berubah — cukup ganti DUMMY jadi state dari useEffect+apiClient.
const DUMMY_TOPICS = [
  {
    id: "1",
    title: "Nutrisi per Trimester",
    description: "Panduan lengkap asupan gizi sesuai tahap kehamilan",
    icon: "restaurant" as const,
    color: "#D97706",
    bg: "rgba(217,119,6,0.12)",
    trimester: 1,
  },
  {
    id: "2",
    title: "Tablet Tambah Darah",
    description: "Pentingnya TTD untuk cegah anemia kehamilan",
    icon: "medical" as const,
    color: colors.primary,
    bg: "rgba(177,14,107,0.1)",
    trimester: 1,
  },
  {
    id: "3",
    title: "Makanan Sehat",
    description: "Resep & tips memilih bahan makanan bergizi",
    icon: "leaf" as const,
    color: colors.riskLow,
    bg: colors.riskLowBg,
    trimester: 2,
  },
  {
    id: "4",
    title: "Tanda Bahaya",
    description: "Gejala yang memerlukan perhatian medis segera",
    icon: "warning" as const,
    color: colors.riskHigh,
    bg: colors.riskHighBg,
    trimester: 2,
  },
  {
    id: "5",
    title: "Persiapan Persalinan",
    description: "Barang bawaan dan kesiapan fisik & mental",
    icon: "happy" as const,
    color: colors.secondary,
    bg: "rgba(113,42,226,0.1)",
    trimester: 3,
  },
];

const FILTERS = ["Semua", "Trimester 1", "Trimester 2", "Trimester 3"];

export default function EducationListScreen({ navigation }: any) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Semua");

  const filtered = DUMMY_TOPICS.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === "Semua" || activeFilter === `Trimester ${t.trimester}`;
    return matchSearch && matchFilter;
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="px-5 pt-2" showsVerticalScrollIndicator={false}>
        <Text style={{ fontFamily: fonts.extrabold, fontSize: 28, color: colors.textPrimary, marginBottom: 2 }}>
          Edukasi
        </Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary, marginBottom: 16 }}>
          Pilih Topik
        </Text>

        <View
          className="flex-row items-center px-4 mb-4"
          style={{ backgroundColor: colors.surface, borderRadius: 999, height: 48, borderWidth: 1, borderColor: colors.outlineVariant }}
        >
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            className="flex-1 px-3"
            style={{ color: colors.textPrimary, fontFamily: fonts.regular }}
            placeholder="Cari topik edukasi..."
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5" contentContainerStyle={{ gap: 8 }}>
          {FILTERS.map((f) => {
            const active = f === activeFilter;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setActiveFilter(f)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 999,
                  backgroundColor: active ? colors.primary : colors.surfaceContainer,
                }}
              >
                <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: active ? "#FFFFFF" : colors.textSecondary }}>
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {filtered.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            onPress={() => navigation.navigate("EducationDetail", { id: topic.id })}
            className="flex-row items-center mb-3 p-4"
            style={{ backgroundColor: colors.surface, borderRadius: 20 }}
            activeOpacity={0.7}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: topic.bg,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons name={topic.icon} size={22} color={topic.color} />
            </View>
            <View className="flex-1">
              <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.textPrimary }}>{topic.title}</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 }} numberOfLines={1}>
                {topic.description}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}

        {filtered.length === 0 && (
          <Text style={{ fontFamily: fonts.regular, color: colors.textSecondary, textAlign: "center", marginTop: 32 }}>
            Topik tidak ditemukan.
          </Text>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}