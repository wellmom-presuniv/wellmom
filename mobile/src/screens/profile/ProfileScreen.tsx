import React, { useEffect, useState, useCallback} from "react";
import {Alert, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from "react-native-reanimated";
import { useAuthStore } from "../../store/useAuthStore";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { getMyProfile } from "../../api/profileService";
import { PregnancyProfile } from "../../types";
import { useLanguageStore } from "../../store/useLanguageStore";
import { useTranslation } from "../../hooks/useTranslation";
import { useFocusEffect } from "@react-navigation/native";
import { useNotificationStore } from "../../store/useNotificationStore"
import { ensureNotificationPermissions } from "../../services/notificationService";
import PressableRow from "@/components/PressableRow";
import AnimatedPressable from "@/components/AnimatedPressable";
function SettingsRow({ icon, label, subtitle, color, bg }: { icon: any; label: string; subtitle?: string; color: string; bg: string }) {
  return (
    <TouchableOpacity className="flex-row items-center px-4 py-3" activeOpacity={0.6}>
      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: bg, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <View className="flex-1">
        <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.textPrimary }}>{label}</Text>
        {subtitle && (
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, marginTop: 1 }}>{subtitle}</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen({navigation}: any) {
  const logout = useAuthStore((s) => s.logout);
  const { t } = useTranslation();
  const userName = useAuthStore((s) => s.userName);
  const { language, setLanguage } = useLanguageStore();
  const [profile, setProfile] = useState<PregnancyProfile | null>(null);
  const notifEnabled = useNotificationStore((s) => s.notificationsEnabled);
  const setNotifEnabled = useNotificationStore((s) => s.setNotificationsEnabled);
  const ACCOUNT_ITEMS = [
    { id: "edit", label: t.editProfile, icon: "person-outline" as const, subtitle: undefined },
    { id: "lang", label: t.language, icon: "globe-outline" as const, subtitle: t.languageValue },
    {
      id: "notif",
      label: t.notifications,
      icon: "notifications-outline" as const,
      subtitle: notifEnabled ? t.notificationsOn : t.notificationsOff,
    },
  ];
  const SUPPORT_ITEMS = [
    { id: "about", label: t.aboutApp, icon: "information-circle-outline" as const },
    { id: "help", label: t.help, icon: "help-circle-outline" as const },
  ];  

  const handleToggleNotificationSetting = async () => {
   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
   if (!notifEnabled) {
     const granted = await ensureNotificationPermissions();
     if (!granted) {
       Alert.alert(t.notificationsDeniedTitle, t.notificationsDeniedBody);
       await setNotifEnabled(false);
       return;
     }
   }
   await setNotifEnabled(!notifEnabled);
  };

  useFocusEffect(
    useCallback(() => {
      getMyProfile()
        .then((p) => {
          console.log("✅ Profil:", p);
          setProfile(p);
        })
        .catch((err) => console.warn("Gagal fetch profil:", err));
    }, [])
  );

  const displayName = userName ?? "Ibu Sehat";
  const initial = displayName.charAt(0).toUpperCase();

  const avatarPulse = useSharedValue(1);
  useEffect(() => {
    avatarPulse.value = withRepeat(withTiming(1.06, { duration: 1800, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);
  const avatarPulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: avatarPulse.value }] }));

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero banner — soft gradient backdrop, konsisten dengan pola blob di layar lain */}
        <View style={{ overflow: "hidden" }}>
          <LinearGradient
            colors={["rgba(177,14,107,0.10)", "rgba(113,42,226,0.05)", "rgba(255,248,248,0)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: "absolute", top: 0, left: 0, right: 0, height: 260 }}
          />
          <View
            style={{
              position: "absolute",
              top: -50,
              right: -60,
              width: 180,
              height: 180,
              borderRadius: 90,
              backgroundColor: colors.secondaryContainer,
              opacity: 0.1,
            }}
          />

          <Animated.View entering={FadeInDown.duration(320)} className="items-center pt-8 pb-6">
            <Animated.View style={[{ marginBottom: 12 }, avatarPulseStyle]}>
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={{ width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center" }}
              >
                <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontFamily: fonts.extrabold, fontSize: 32, color: colors.primary }}>{initial}</Text>
                </View>
              </LinearGradient>
            </Animated.View>
            <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.textPrimary, marginBottom: 10 }}>
              {displayName}
            </Text>

            {/* Quick stat chips — trimester & minggu kehamilan, data yang sudah di-fetch */}
            <View className="flex-row" style={{ gap: 8 }}>
              <View
                className="flex-row items-center px-3 py-1.5"
                style={{ backgroundColor: colors.riskLowBg, borderRadius: 999, gap: 6 }}
              >
                <Ionicons name="heart" size={13} color={colors.riskLow} />
                <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: colors.riskLow }}>
                  {profile ? t.trimester.replace("{n}", String(profile.trimester)) : "—"}
                </Text>
              </View>
              <View
                className="flex-row items-center px-3 py-1.5"
                style={{ backgroundColor: colors.surface, borderRadius: 999, gap: 6, borderWidth: 1, borderColor: colors.outlineVariant }}
              >
                <Ionicons name="calendar" size={13} color={colors.primary} />
                <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: colors.primary }}>
                  {profile ? t.week.replace("{n}", String(profile.gestational_week)) : "—"}
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>

        <View className="px-5">
          <Animated.View entering={FadeInUp.delay(80).duration(300)} className="flex-row items-center mb-2" style={{ gap: 6 }}>
            <Ionicons name="person-circle-outline" size={14} color={colors.textSecondary} />
            <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: colors.textSecondary, letterSpacing: 1 }}>
              {t.accountSection}
            </Text>
          </Animated.View>
          <Animated.View
            entering={FadeInUp.delay(120).duration(300)}
            style={{ backgroundColor: colors.surface, borderRadius: 20, marginBottom: 20, overflow: "hidden" }}
          >
            {ACCOUNT_ITEMS.map((item, idx) => (
              <View key={item.id}>
                <PressableRow
                  className="flex-row items-center px-4 py-3"
                  onPress={() => {
                    if (item.id === "edit") navigation.navigate("EditProfile");
                    if (item.id === "notif") handleToggleNotificationSetting();
                    if (item.id === "lang") setLanguage(language === "id" ? "en" : "id");
                  }}
                >
                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(177,14,107,0.1)", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                    <Ionicons name={item.icon} size={18} color={colors.primary} />
                  </View>
                  <View className="flex-1">
                    <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.textPrimary }}>{item.label}</Text>
                    {item.subtitle && (
                      <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, marginTop: 1 }}>{item.subtitle}</Text>
                    )}
                  </View>
                  {item.id === "notif" ? (
                    <Ionicons name={notifEnabled ? "toggle" : "toggle-outline"} size={28} color={notifEnabled ? colors.primary : colors.outlineVariant} />
                  ) : (
                    <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                  )}
                </PressableRow>
                {idx < ACCOUNT_ITEMS.length - 1 && (
                  <View style={{ height: 1, backgroundColor: colors.outlineVariant, marginLeft: 64 }} />
                )}
              </View>
            ))}
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(160).duration(300)} className="flex-row items-center mb-2" style={{ gap: 6 }}>
            <Ionicons name="help-buoy-outline" size={14} color={colors.textSecondary} />
            <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: colors.textSecondary, letterSpacing: 1 }}>
              {t.supportSection}
            </Text>
          </Animated.View>
          <Animated.View
            entering={FadeInUp.delay(200).duration(300)}
            style={{ backgroundColor: colors.surface, borderRadius: 20, marginBottom: 32, overflow: "hidden" }}
          >
            {SUPPORT_ITEMS.map((item, idx) => (
              <View key={item.id}>
                <PressableRow
                  className="flex-row items-center px-4 py-3"
                  onPress={() => {
                    if (item.id === "about") navigation.navigate("About");
                    if (item.id === "help") navigation.navigate("Help");
                  }}
                >
                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(113,42,226,0.1)", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                    <Ionicons name={item.icon} size={18} color={colors.secondary} />
                  </View>
                  <View className="flex-1">
                    <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.textPrimary }}>{item.label}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                </PressableRow>
                {idx < SUPPORT_ITEMS.length - 1 && (
                  <View style={{ height: 1, backgroundColor: colors.outlineVariant, marginLeft: 64 }} />
                )}
              </View>
            ))}
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(240).duration(300)}>
            <AnimatedPressable
              haptic
              onPress={logout}
              className="flex-row items-center justify-center py-4 mb-10"
              style={{ borderWidth: 1.5, borderColor: colors.riskHigh, borderRadius: 999, gap: 8 }}
            >
              <Ionicons name="log-out-outline" size={18} color={colors.riskHigh} />
              <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.riskHigh }}>{t.logout}</Text>
            </AnimatedPressable>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}