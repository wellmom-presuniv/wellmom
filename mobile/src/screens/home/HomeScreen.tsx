import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, riskCategoryStyle } from "../../theme/colors";

// NOTE: data dummy — ganti dengan data asli dari API profil & assessment result
const DUMMY = {
  trimester: 2,
  gestationalWeek: 20,
  totalWeeks: 40,
  estimatedDueDate: "10 Okt 2025",
  riskCategory: "LOW" as const,
};

const MENU_ITEMS: { label: string; icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }[] = [
  { label: "Edukasi", icon: "book", color: colors.primary, bg: colors.primaryLight },
  { label: "Checklist", icon: "checkbox", color: colors.riskLow, bg: colors.riskLowBg },
  { label: "Self-Assessment", icon: "heart", color: colors.secondary, bg: colors.secondaryLight },
  { label: "Catatan Harian", icon: "camera", color: colors.primaryDark, bg: colors.primaryLight },
  { label: "Panduan", icon: "document-text", color: colors.secondary, bg: colors.secondaryLight },
  { label: "Profil", icon: "person", color: colors.textSecondary, bg: "#F3F4F6" },
];

export default function HomeScreen() {
  const progress = DUMMY.gestationalWeek / DUMMY.totalWeeks;
  const risk = riskCategoryStyle[DUMMY.riskCategory];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="px-4 pt-2" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-text-primary">Hi, Ibu Sehat! 👋</Text>
          <View className="flex-row gap-3">
            <Ionicons name="globe-outline" size={22} color={colors.textSecondary} />
            <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
          </View>
        </View>

        {/* Trimester progress card */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 16, padding: 16, marginBottom: 16 }}
        >
          <Text className="text-white font-bold text-lg">Trimester {DUMMY.trimester}</Text>
          <Text className="text-white/90 text-sm mb-2">Minggu ke-{DUMMY.gestationalWeek}</Text>
          <View className="h-2 bg-white/30 rounded-full overflow-hidden mb-1">
            <View
              className="h-2 bg-white rounded-full"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </View>
          <Text className="text-white/90 text-xs">
            {Math.round(progress * 100)}% · Perkiraan HPL: {DUMMY.estimatedDueDate}
          </Text>
        </LinearGradient>

        {/* Risk status card */}
        <View className="bg-surface rounded-2xl p-4 mb-4 border border-border">
          <Text className="text-text-secondary text-sm mb-1">Risiko Saat Ini</Text>
          <View className="flex-row items-center justify-between">
            <Text style={{ color: risk.color }} className="font-bold text-base">
              {risk.label}
            </Text>
            <View style={{ backgroundColor: risk.bg }} className="w-8 h-8 rounded-full items-center justify-center">
              <Ionicons name="checkmark" size={18} color={risk.color} />
            </View>
          </View>
          <Text className="text-text-secondary text-xs mt-1">
            Terus jaga pola makan dan lakukan pemeriksaan kehamilan rutin.
          </Text>
        </View>

        {/* Quick menu grid */}
        <Text className="text-text-primary font-semibold mb-2">Menu Cepat</Text>
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
      </ScrollView>
    </SafeAreaView>
  );
}
