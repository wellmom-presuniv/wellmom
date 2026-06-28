import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, riskCategoryStyle } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { getMyProfile } from "../../api/profileService";
import { PregnancyProfile } from "../../types";

const DUMMY_RISK_CATEGORY = "LOW" as const;

function formatTanggalIndo(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

const MENU_ITEMS: { label: string; icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }[] = [
  { label: "Edukasi", icon: "book", color: colors.secondary, bg: "rgba(113,42,226,0.1)" },
  { label: "Checklist", icon: "checkbox", color: colors.riskLow, bg: colors.riskLowBg },
  { label: "Self-Assessment", icon: "pulse", color: colors.riskHigh, bg: colors.riskHighBg },
  { label: "Catatan Harian", icon: "journal-outline", color: colors.primary, bg: "rgba(177,14,107,0.1)" },
  { label: "Panduan", icon: "medkit-outline", color: colors.secondary, bg: "rgba(113,42,226,0.1)" },
  { label: "Profil", icon: "person", color: colors.textSecondary, bg: "rgba(139,112,121,0.1)" },
];

  export default function HomeScreen() {
    const [profile, setProfile] = useState<PregnancyProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      getMyProfile()
        .then(setProfile)
        .catch((err) => console.warn("Gagal ambil profil:", err))
        .finally(() => setIsLoading(false));
    }, []);

    const risk = riskCategoryStyle[DUMMY_RISK_CATEGORY];

    if (isLoading) {
      return (
        <SafeAreaView className="flex-1 bg-background items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </SafeAreaView>
      );
    }

    if (!profile) {
      return (
        <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
          <Text style={{ fontFamily: fonts.medium, color: colors.textSecondary, textAlign: "center" }}>
            Gagal memuat data profil. Coba lagi nanti.
          </Text>
        </SafeAreaView>
      );
    }

    return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="px-4 pt-2" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text style={{ fontFamily: fonts.bold, fontSize: 20, color: colors.primary }}>Hi, Ibu Sehat! 👋</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, opacity: 0.8 }}>
            Selamat pagi, Bunda.
          </Text>
        </View>
        <TouchableOpacity
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceContainer, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="notifications-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

        {/* Trimester progress card */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 16, padding: 16, marginBottom: 16 }}
        >
          <Text className="text-white font-bold text-lg">Trimester {profile.trimester}</Text>
          <Text className="text-white/90 text-sm mb-2">Minggu ke-{profile.gestational_week}</Text>
          <View className="h-2 bg-white/30 rounded-full overflow-hidden mb-1">
            <View
              className="h-2 bg-white rounded-full"
              style={{ width: `${Math.round(profile.progress_pct)}%` }}
            />
          </View>
          <Text className="text-white/90 text-xs">
            {Math.round(profile.progress_pct)}% · Perkiraan HPL: {formatTanggalIndo(profile.hpl)}
          </Text>
        </LinearGradient>

        {/* Risk status card */}
        <View
          className="bg-surface rounded-2xl p-4 mb-4 flex-row items-center justify-between"
          style={{ borderLeftWidth: 4, borderLeftColor: risk.color }}
        >
          <View className="flex-1">
            <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: colors.textSecondary }}>Risiko Saat Ini</Text>
            <View className="flex-row items-center" style={{ gap: 6 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: risk.color }}>{risk.label}</Text>
              <Ionicons name="checkmark-circle" size={18} color={risk.color} />
            </View>
            <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
              Terus jaga pola makan dan lakukan pemeriksaan kehamilan rutin.
            </Text>
          </View>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: risk.bg, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="pulse" size={22} color={risk.color} />
          </View>
        </View>

        {/* Quick menu grid */}
        <View className="flex-row justify-between items-center mb-2">
          <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.textPrimary }}>Menu Cepat</Text>
          <TouchableOpacity>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: colors.primary }}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row flex-wrap justify-between mb-6">
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.label}
              className="w-[31%] bg-surface rounded-2xl py-4 items-center mb-3 border border-border"
            >
              <View
                style={{ backgroundColor: item.bg }}
                className="w-10 h-10 rounded-full items-center justify-center mb-2"
              >
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text className="text-text-primary text-xs text-center">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View
          className="rounded-2xl p-4 flex-row items-start mb-6"
          style={{ backgroundColor: colors.surfaceContainer, gap: 12 }}
        >
          <Ionicons name="bulb" size={22} color={colors.primary} />
          <View className="flex-1">
            <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.primary, marginBottom: 2 }}>Tips Hari Ini</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, lineHeight: 18 }}>
              Bunda, jangan lupa minum setidaknya 8 gelas air hari ini untuk menjaga hidrasi ketuban yang optimal.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
