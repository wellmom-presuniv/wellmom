import React, { useEffect, useState} from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/useAuthStore";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { getMyProfile } from "../../api/profileService";
import { PregnancyProfile } from "../../types";

const ACCOUNT_ITEMS = [
  { id: "edit", label: "Edit Profil", icon: "person-outline" as const, subtitle: undefined },
  { id: "lang", label: "Bahasa", icon: "globe-outline" as const, subtitle: "Indonesia" },
  { id: "notif", label: "Notifikasi", icon: "notifications-outline" as const, subtitle: undefined },
];

const SUPPORT_ITEMS = [
  { id: "about", label: "Tentang WellMom", icon: "information-circle-outline" as const, subtitle: undefined },
  { id: "help", label: "Bantuan", icon: "help-circle-outline" as const, subtitle: undefined },
];

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

export default function ProfileScreen() {
  const logout = useAuthStore((s) => s.logout);
  const userName = useAuthStore((s) => s.userName);
  const [profile, setProfile] = useState<PregnancyProfile | null>(null);

  useEffect(() => {
    getMyProfile()
      .then(setProfile)
      .catch((err) => console.warn("Gagal fetch profil:", err));
  }, []);

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
              Trimester {profile?.trimester} · Minggu ke-{profile?.gestational_week}
            </Text>
          </View>
        </View>

        <View className="px-5">
          <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: colors.textSecondary, letterSpacing: 1, marginBottom: 8 }}>
            AKUN & PREFERENSI
          </Text>
          <View style={{ backgroundColor: colors.surface, borderRadius: 20, marginBottom: 20 }}>
            {ACCOUNT_ITEMS.map((item, idx) => (
              <View key={item.id}>
                <SettingsRow icon={item.icon} label={item.label} subtitle={item.subtitle} color={colors.primary} bg="rgba(177,14,107,0.1)" />
                {idx < ACCOUNT_ITEMS.length - 1 && (
                  <View style={{ height: 1, backgroundColor: colors.outlineVariant, marginLeft: 64 }} />
                )}
              </View>
            ))}
          </View>

          <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: colors.textSecondary, letterSpacing: 1, marginBottom: 8 }}>
            DUKUNGAN
          </Text>
          <View style={{ backgroundColor: colors.surface, borderRadius: 20, marginBottom: 32 }}>
            {SUPPORT_ITEMS.map((item, idx) => (
              <View key={item.id}>
                <SettingsRow icon={item.icon} label={item.label} subtitle={item.subtitle} color={colors.secondary} bg="rgba(113,42,226,0.1)" />
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
            <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.riskHigh }}>Keluar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}