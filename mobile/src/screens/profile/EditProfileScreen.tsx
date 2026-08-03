import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { getMyProfile } from "../../api/profileService";
import apiClient from "../../api/client";
import { useTranslation } from "../../hooks/useTranslation";
import AnimatedPressable from "@/components/AnimatedPressable";
import WheelPicker from "@/components/WheelPicker";

function daysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function EditProfileScreen({ navigation }: any) {
  const today = new Date();
  const [day, setDay] = useState(today.getDate());
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const maxDay = daysInMonth(month, year);
  const { t } = useTranslation();

  useEffect(() => {
    // Load HPHT yang udah ada dari backend
    getMyProfile()
      .then((profile) => {
        const hpht = new Date(profile.hpht);
        setDay(hpht.getDate());
        setMonth(hpht.getMonth());
        setYear(hpht.getFullYear());
      })
      .catch((err) => console.warn("Gagal load profil:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const safeDay = Math.min(day, maxDay);
      const hpht = `${year}-${String(month + 1).padStart(2, "0")}-${String(safeDay).padStart(2, "0")}`;
      await apiClient.patch("/profile", { hpht });
      navigation.goBack();
    } catch (err) {
      console.warn("Gagal simpan profil:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Atmospheric blob decoration — konsisten dengan ProfileSetupScreen */}
      <View
        style={{
          position: "absolute",
          top: -70,
          right: -70,
          width: 220,
          height: 220,
          borderRadius: 110,
          backgroundColor: colors.secondaryContainer,
          opacity: 0.1,
        }}
      />
      <View
        style={{
          position: "absolute",
          top: 240,
          left: -90,
          width: 240,
          height: 240,
          borderRadius: 120,
          backgroundColor: colors.primaryContainer,
          opacity: 0.08,
        }}
      />

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(300)} className="flex-row items-center px-5 pt-2 pb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.surface,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
            shadowColor: colors.textPrimary,
            shadowOpacity: 0.06,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 1,
          }}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.textPrimary }}>{t.editProfileTitle}</Text>
      </Animated.View>

      <View className="px-5 flex-1">
        {/* Info card */}
        <Animated.View
          entering={FadeInUp.delay(60).duration(300)}
          className="flex-row items-center p-4 mb-6"
          style={{ backgroundColor: colors.surfaceContainer, borderRadius: 16, gap: 10 }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: colors.surface,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="information-circle" size={18} color={colors.primary} />
          </View>
          <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 18 }}>
            {t.editProfileInfo}
          </Text>
        </Animated.View>

        {/* HPHT picker — glass card, konsisten dengan onboarding */}
        <Animated.View
          entering={FadeInUp.delay(120).duration(320)}
          style={{
            backgroundColor: "rgba(255,255,255,0.8)",
            borderRadius: 24,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.5)",
            padding: 20,
            shadowColor: colors.primary,
            shadowOpacity: 0.1,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 8 },
            elevation: 4,
          }}
        >
          <View className="flex-row items-center mb-1" style={{ gap: 10 }}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={{ width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" }}
            >
              <Ionicons name="calendar" size={16} color="#FFFFFF" />
            </LinearGradient>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.textPrimary }}>
              {t.hphtLabel}
            </Text>
          </View>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, marginBottom: 12, marginLeft: 44 }}>
            {t.hphtHint}
          </Text>

          <View className="flex-row justify-center" style={{ gap: 10 }}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: colors.textSecondary, marginBottom: 6 }}>
                {t.dayLabel}
              </Text>
              <View style={{ backgroundColor: colors.surfaceContainer, borderRadius: 12, overflow: "hidden", width: 90 }}>
                <WheelPicker
                  items={Array.from({ length: maxDay }, (_, i) => ({ label: String(i + 1), value: i + 1 }))}
                  selectedValue={day}
                  onValueChange={setDay}
                  width={90}
                />
              </View>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: colors.textSecondary, marginBottom: 6 }}>
                {t.monthLabel}
              </Text>
              <View style={{ backgroundColor: colors.surfaceContainer, borderRadius: 12, overflow: "hidden", width: 110 }}>
                <WheelPicker
                  items={t.months.map((m, i) => ({ label: m, value: i }))}
                  selectedValue={month}
                  onValueChange={setMonth}
                  width={110}
                />
              </View>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: colors.textSecondary, marginBottom: 6 }}>
                {t.yearLabel}
              </Text>
              <View style={{ backgroundColor: colors.surfaceContainer, borderRadius: 12, overflow: "hidden", width: 120 }}>
                <WheelPicker
                  items={[today.getFullYear() - 1, today.getFullYear()].map((y) => ({ label: String(y), value: y }))}
                  selectedValue={year}
                  onValueChange={setYear}
                  width={120}
                />
              </View>
            </View>
          </View>

          <View className="items-center mt-2 pt-4" style={{ borderTopWidth: 1, borderTopColor: colors.outlineVariant }}>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 10, color: colors.textSecondary, letterSpacing: 1, marginBottom: 8 }}>
              {t.hphtSelected}
            </Text>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 999,
                paddingHorizontal: 18,
                paddingVertical: 10,
                gap: 8,
              }}
            >
              <Ionicons name="calendar-outline" size={16} color="#FFFFFF" />
              <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: "#FFFFFF" }}>
                {Math.min(day, maxDay)} {t.months[month]} {year}
              </Text>
            </LinearGradient>
          </View>
        </Animated.View>
      </View>

      {/* Tombol simpan */}
      <Animated.View entering={FadeInUp.delay(180).duration(320)} className="px-5 pb-4">
        <AnimatedPressable haptic onPress={handleSave} disabled={isSaving}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              height: 56,
              borderRadius: 28,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: colors.primary,
              shadowOpacity: 0.25,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 4,
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: "#FFFFFF" }}>{t.saveChanges}</Text>
            )}
          </LinearGradient>
        </AnimatedPressable>
      </Animated.View>
    </SafeAreaView>
  );
}
