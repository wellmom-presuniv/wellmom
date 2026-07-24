import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from "react-native-reanimated";
import { colors, riskCategoryStyle } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { getMyProfile } from "../../api/profileService";
import { PregnancyProfile } from "../../types";
import { useAuthStore } from "../../store/useAuthStore";
import { getAssessmentHistory } from "../../api/assessmentService";
import { useFocusEffect } from "@react-navigation/native";
import { useLanguageStore } from "../../store/useLanguageStore";
import { useTranslation } from "../../hooks/useTranslation";
import AppHeader from "@/components/AppHeader";
import AnimatedPressable from "@/components/AnimatedPressable";
import AnimatedProgressBar from "@/components/AnimatedProgressBar";

function formatTanggalIndo(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}


  export default function HomeScreen({ navigation }: any) {
    const [profile, setProfile] = useState<PregnancyProfile | null>(null);
    const [lastRisk, setLastRisk] = useState<"LOW" | "MEDIUM" | "HIGH" | null>(null);
    const { language, setLanguage } = useLanguageStore();
    const { t } = useTranslation();

    const MENU_ITEMS: { id: string; label: string; icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }[] = [
      { id: "education", label: t.menuEducation, icon: "book", color: colors.secondary, bg: "rgba(113,42,226,0.1)" },
      { id: "checklist", label: t.menuChecklist, icon: "checkbox", color: colors.riskLow, bg: colors.riskLowBg },
      { id: "assessment", label: t.menuAssessment, icon: "pulse", color: colors.riskHigh, bg: colors.riskHighBg },
      { id: "monitoring", label: t.menuMonitoring, icon: "camera" as const, color: colors.primary, bg: "rgba(177,14,107,0.1)" },
      { id: "guide", label: t.menuGuide, icon: "medkit-outline", color: colors.secondary, bg: "rgba(113,42,226,0.1)" },
      { id: "profile", label: t.menuProfile, icon: "person", color: colors.textSecondary, bg: "rgba(139,112,121,0.1)" },
    ];

    useFocusEffect(
      useCallback(() => {
        getAssessmentHistory(1, 0)
          .then((data) => {
            if (data.length > 0) setLastRisk(data[0].risk_category);
          })
          .catch(() => {});
      }, [])
    );
    const [isLoading, setIsLoading] = useState(true);
    const userName = useAuthStore((s) => s.userName);
    const notificationMessage = lastRisk === "HIGH"
      ? t.notificationHighRisk
      : lastRisk === "MEDIUM"
      ? t.notificationMediumRisk
      : lastRisk === "LOW"
      ? t.notificationLowRisk
      : t.notificationDefault;

    useFocusEffect(
      useCallback(() => {
        getMyProfile()
          .then(setProfile)
          .catch((err) => console.warn("Gagal ambil profil:", err))
          .finally(() => setIsLoading(false));
      }, [])
    );

    const risk = riskCategoryStyle[lastRisk || "LOW"];

    const riskPulse = useSharedValue(1);
    useEffect(() => {
      if (lastRisk === "HIGH") {
        riskPulse.value = withRepeat(withTiming(1.12, { duration: 700, easing: Easing.inOut(Easing.ease) }), -1, true);
      } else {
        riskPulse.value = withTiming(1, { duration: 200 });
      }
    }, [lastRisk]);
    const riskPulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: riskPulse.value }] }));

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
        {/* Header */}
      <AppHeader title="WellMom" notificationMessage={notificationMessage} />
      <ScrollView className="px-4 pt-2" showsVerticalScrollIndicator={false}>
        {/* Trimester progress card */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 16, padding: 16, marginBottom: 16 }}
        >
          <Text className="text-white font-bold text-lg">{t.trimester.replace("{n}", String(profile.trimester))}</Text>
          <Text className="text-white/90 text-sm mb-2">{t.week.replace("{n}", String(profile.gestational_week))}</Text>
          <AnimatedProgressBar
            progress={profile.progress_pct / 100}
            height={8}
            trackColor="rgba(255,255,255,0.3)"
            fillColor="#FFFFFF"
            style={{ marginBottom: 4 }}
          />
          <Text className="text-white/90 text-xs">
            {Math.round(profile.progress_pct)}% · {t.hplLabel.replace("{date}", formatTanggalIndo(profile.hpl))}
          </Text>
        </LinearGradient>

        {/* Risk status card */}
        <View
          className="bg-surface rounded-2xl p-4 mb-4 flex-row items-center justify-between"
          style={{ borderLeftWidth: 4, borderLeftColor: risk.color }}
        >
          <View className="flex-1">
            <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: colors.textSecondary }}>{t.currentRisk}</Text>
            <View className="flex-row items-center" style={{ gap: 6 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: risk.color }}>
                {lastRisk === "HIGH" ? t.riskHigh : lastRisk === "MEDIUM" ? t.riskMedium : t.riskLow}
              </Text>
              <Ionicons name="checkmark-circle" size={18} color={risk.color} />
            </View>
            <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
              {lastRisk === "HIGH" ? t.riskHighDesc : lastRisk === "MEDIUM" ? t.riskMediumDesc : t.riskLowDesc}
            </Text>
          </View>
          <Animated.View
            style={[
              { width: 48, height: 48, borderRadius: 24, backgroundColor: risk.bg, alignItems: "center", justifyContent: "center" },
              lastRisk === "HIGH" ? riskPulseStyle : undefined,
            ]}
          >
            <Ionicons name="pulse" size={22} color={risk.color} />
          </Animated.View>
        </View>

        {/* Quick menu grid */}
        <View className="flex-row justify-between items-center mb-2">
          <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.textPrimary }}>{t.quickMenu}</Text>
         
        </View>
        <View key={language} className="flex-row flex-wrap justify-between mb-6">
          {MENU_ITEMS.map((item, idx) => (
            <Animated.View key={item.id} entering={FadeInDown.delay(idx * 50).duration(350)} className="w-[31%] mb-3">
              <AnimatedPressable
                haptic
                onPress={() => {
                  if (item.id === "assessment") navigation.navigate("SelfAssessmentForm");
                  if (item.id === "education") navigation.getParent()?.navigate("Edukasi");
                  if (item.id === "checklist") navigation.getParent()?.navigate("Checklist");
                  if (item.id === "profile") navigation.getParent()?.navigate("Profil");
                  if (item.id === "monitoring") navigation.navigate("Monitoring");
                  if (item.id === "guide") navigation.navigate("Guide");
                }}
                className="bg-surface rounded-2xl py-4 items-center"
              >
                <View
                  style={{ backgroundColor: item.bg }}
                  className="w-10 h-10 rounded-full items-center justify-center mb-2"
                >
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.textPrimary, textAlign: "center" }}>
                  {item.label}
                </Text>
              </AnimatedPressable>
            </Animated.View>
          ))}
        </View>
        <View
          className="rounded-2xl p-4 flex-row items-start mb-6"
          style={{ backgroundColor: colors.surfaceContainer, gap: 12 }}
        >
          <Ionicons name="bulb" size={22} color={colors.primary} />
          <View className="flex-1">
            <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.primary, marginBottom: 2 }}>{t.tipsTitle}</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, lineHeight: 18 }}>
              {t.tipsBody}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
