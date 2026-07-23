import React, { useEffect, useState, useCallback} from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/useAuthStore";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { getMyProfile } from "../../api/profileService";
import { PregnancyProfile } from "../../types";
import { useLanguageStore } from "../../store/useLanguageStore";
import { useTranslation } from "../../hooks/useTranslation";
import { useFocusEffect } from "@react-navigation/native";

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
  const [notifEnabled, setNotifEnabled] = useState(true);
  const ACCOUNT_ITEMS = [
    { id: "edit", label: t.editProfile, icon: "person-outline" as const, subtitle: undefined },
    { id: "lang", label: t.language, icon: "globe-outline" as const, subtitle: t.languageValue },
    { id: "notif", label: t.notifications, icon: "notifications-outline" as const, subtitle: undefined },
  ];
  const SUPPORT_ITEMS = [
    { id: "about", label: t.aboutApp, icon: "information-circle-outline" as const },
    { id: "help", label: t.help, icon: "help-circle-outline" as const },
  ];  

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

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar + name */}
        <View className="items-center pt-6 pb-6">
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={{ width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center", marginBottom: 12 }}
          >
            <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontFamily: fonts.extrabold, fontSize: 32, color: colors.primary }}>{initial}</Text>
            </View>
          </LinearGradient>
          <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.textPrimary, marginBottom: 8 }}>
            {displayName}
          </Text>
          <View
            className="flex-row items-center px-3 py-1.5"
            style={{ backgroundColor: colors.riskLowBg, borderRadius: 999, gap: 6 }}
          >
            <Ionicons name="heart" size={13} color={colors.riskLow} />
            <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: colors.riskLow }}>
              {t.trimesterBadge
                .replace("{t}", String(profile?.trimester ?? "—"))
                .replace("{w}", String(profile?.gestational_week ?? "—"))}
            </Text>
          </View>
        </View>

        <View className="px-5">
          <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: colors.textSecondary, letterSpacing: 1, marginBottom: 8 }}>
            {t.accountSection}
          </Text>
          <View style={{ backgroundColor: colors.surface, borderRadius: 20, marginBottom: 20 }}>
            {ACCOUNT_ITEMS.map((item, idx) => (
              <View key={item.id}>
                <TouchableOpacity
                  className="flex-row items-center px-4 py-3"
                  activeOpacity={0.6}
                  onPress={() => {
                    if (item.id === "edit") navigation.navigate("EditProfile");
                    if (item.id === "notif") setNotifEnabled(!notifEnabled);
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
                </TouchableOpacity>
                {idx < ACCOUNT_ITEMS.length - 1 && (
                  <View style={{ height: 1, backgroundColor: colors.outlineVariant, marginLeft: 64 }} />
                )}
              </View>
            ))}
          </View>

          <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: colors.textSecondary, letterSpacing: 1, marginBottom: 8 }}>
            {t.supportSection}
          </Text>
          <View style={{ backgroundColor: colors.surface, borderRadius: 20, marginBottom: 32 }}>
            {SUPPORT_ITEMS.map((item, idx) => (
              <View key={item.id}>
                <TouchableOpacity
                  className="flex-row items-center px-4 py-3"
                  activeOpacity={0.6}
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
                </TouchableOpacity>
                {idx < SUPPORT_ITEMS.length - 1 && (
                  <View style={{ height: 1, backgroundColor: colors.outlineVariant, marginLeft: 64 }} />
                )}
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={logout}
            activeOpacity={0.7}
            className="flex-row items-center justify-center py-4 mb-10"
            style={{ borderWidth: 1.5, borderColor: colors.riskHigh, borderRadius: 999, gap: 8 }}
          >
            <Ionicons name="log-out-outline" size={18} color={colors.riskHigh} />
            <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.riskHigh }}>{t.logout}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}