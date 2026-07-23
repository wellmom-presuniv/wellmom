import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import apiClient from "../../api/client";
import {useTranslation} from "../../hooks/useTranslation";
import { useAuthStore } from "../../store/useAuthStore";
import { getMyProfile } from "../../api/profileService";
import { PregnancyProfile } from "../../types";
import AppHeader from "../../components/AppHeader";
import { useFocusEffect } from "@react-navigation/native";

interface EducationContent {
    content_id: string;
    title: string;
    body: string;
    category: string;
    trimester: number | null;
    is_published: boolean;
  }

export default function EducationListScreen({ navigation }: any) {
  const [search, setSearch] = useState("");
  const { t } = useTranslation();
  const [topics, setTopics] = useState<EducationContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<PregnancyProfile | null>(null);
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      apiClient.get<EducationContent[]>("/content")
        .then(({ data }) => setTopics(data))
        .catch((err) => console.warn("Gagal fetch edukasi:", err))
        .finally(() => setIsLoading(false));
    }, [])
  );
  useFocusEffect(
    useCallback(() => {
      getMyProfile()
        .then(setProfile)
        .catch(() => {});
    }, [])
  );
  const categoryStyle: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }> = {
    nutrisi: { icon: "restaurant", color: "#D97706", bg: "rgba(217,119,6,0.12)" },
    tablet_tambah_darah: { icon: "medical", color: colors.primary, bg: "rgba(177,14,107,0.1)" },
    makanan_sehat: { icon: "leaf", color: colors.riskLow, bg: colors.riskLowBg },
    tanda_bahaya: { icon: "warning", color: colors.riskHigh, bg: colors.riskHighBg },
    persiapan_persalinan: { icon: "happy", color: colors.secondary, bg: "rgba(113,42,226,0.1)" },
  };
  const defaultStyle = { icon: "book" as const, color: colors.primary, bg: colors.primaryContainer };
  const filtered = topics.filter(topic =>
    topic.title.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <SafeAreaView className="flex-1 bg-background">
      
        <AppHeader title={t.educationTitle} />
      <ScrollView className="px-5 pt-2" showsVerticalScrollIndicator={false}>
        <View
          className="flex-row items-center px-4 mb-4"
          style={{ backgroundColor: colors.surface, borderRadius: 999, height: 48, borderWidth: 1, borderColor: colors.outlineVariant }}
        >
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            className="flex-1 px-3"
            style={{ color: colors.textPrimary, fontFamily: fonts.regular }}
            placeholder={t.searchPlaceholder}
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        {profile && (
          <View className="flex-row items-center p-3 mb-4" style={{ backgroundColor: colors.primaryContainer, borderRadius: 12, gap: 8 }}>
            <Ionicons name="information-circle" size={16} color={colors.background} />
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.background }}>
              {t.language === "id"
                ? `Menampilkan konten untuk Trimester ${profile.trimester} · Minggu ke-${profile.gestational_week}`
                : `Showing content for Trimester ${profile.trimester} · Week ${profile.gestational_week}`}
            </Text>
          </View>
        )}

        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 32 }} />
        ) : filtered.length === 0 ? (
          <Text style={{ fontFamily: fonts.regular, color: colors.textSecondary, textAlign: "center", marginTop: 32 }}>
            {search ? t.noTopics : t.contentLoading}
          </Text>
        ) : (
          filtered.map((topic) => {
            const style = categoryStyle[topic.category] ?? defaultStyle;
            return (
              <TouchableOpacity
                key={topic.content_id}
                onPress={() => navigation.navigate("EducationDetail", { id: topic.content_id, title: topic.title, body: topic.body })}
                className="flex-row items-center mb-3 p-4"
                style={{ backgroundColor: colors.surface, borderRadius: 20 }}
                activeOpacity={0.7}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: style.bg,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Ionicons name={style.icon} size={22} color={style.color} />
                </View>
                <View className="flex-1">
                  <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.textPrimary }}>{topic.title}</Text>
                  {topic.trimester && (
                    <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                      {t.filterTrimester.replace("{n}", String(topic.trimester))}
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}