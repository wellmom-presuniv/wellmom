import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { getMyProfile } from "../../api/profileService";
import apiClient from "../../api/client";
import { useTranslation } from "../../hooks/useTranslation";

const MONTHS_ID = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agt", "Sep", "Okt", "Nov", "Des",
];

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
      {/* Header */}
      <View className="flex-row items-center px-5 pt-2 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.textPrimary }}>{t.editProfileTitle}</Text>
      </View>

      <View className="px-5 flex-1">
        {/* Info card */}
        <View className="flex-row items-center p-4 mb-6" style={{ backgroundColor: colors.surfaceContainer, borderRadius: 16, gap: 10 }}>
          <Ionicons name="information-circle-outline" size={18} color={colors.textSecondary} />
          <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 18 }}>
            {t.editProfileInfo}
          </Text>
        </View>

        {/* HPHT picker */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 20,
            shadowColor: colors.primary,
            shadowOpacity: 0.08,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.textPrimary, marginBottom: 4 }}>
            {t.hphtLabel}
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, marginBottom: 12 }}>
            {t.hphtHint}
          </Text>

          <View className="flex-row">
            <Picker
              style={{  width: 90 }}
              selectedValue={day}
              onValueChange={setDay}
              itemStyle={Platform.OS === "ios" ? { fontFamily: fonts.semibold } : undefined}
            >
              {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => (
                <Picker.Item key={d} label={String(d)} value={d} />
              ))}
            </Picker>
            <Picker
              style={{width: 110 }}
              selectedValue={month}
              onValueChange={setMonth}
              itemStyle={Platform.OS === "ios" ? { fontFamily: fonts.semibold, color: colors.primary } : undefined}
            >
              {t.months.map((m, i) => (
                <Picker.Item key={m} label={m} value={i} />
              ))}
            </Picker>
            <Picker
              style={{ width: 120 }}
              selectedValue={year}
              onValueChange={setYear}
              itemStyle={Platform.OS === "ios" ? { fontFamily: fonts.semibold } : undefined}
            >
              {[today.getFullYear() - 1, today.getFullYear()].map((y) => (
                <Picker.Item key={y} label={String(y)} value={y} />
              ))}
            </Picker>
          </View>

          <View className="items-center mt-2 pt-3" style={{ borderTopWidth: 1, borderTopColor: colors.outlineVariant }}>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: colors.textSecondary, letterSpacing: 1 }}>
              {t.hphtSelected}
            </Text>
            <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.primary, marginTop: 2 }}>
              {Math.min(day, maxDay)} {t.months[month]} {year}
            </Text>
          </View>
        </View>
      </View>

      {/* Tombol simpan */}
      <View className="px-5 pb-4">
        <TouchableOpacity onPress={handleSave} activeOpacity={0.85} disabled={isSaving}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              height: 56,
              borderRadius: 28,
              alignItems: "center",
              justifyContent: "center",
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: "#FFFFFF" }}>{t.saveChanges}</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}