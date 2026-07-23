import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/useAuthStore";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { useTranslation } from "../../hooks/useTranslation";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((s) => s.login);
  const isSubmitting = useAuthStore((s) => s.isSubmitting);
  const authError = useAuthStore((s) => s.authError);
  const clearError = useAuthStore((s) => s.clearError);
  const { t } = useTranslation();
  const handleLogin = async () => {
    try {
    await login(email, password);
    // Sukses: RootNavigator otomatis switch screen begitu token ke-set, ga perlu navigate manual.
  } catch {
    // Error message udah di-handle & disimpan di store (authError).
  }
  };

  return (
    <SafeAreaView className="flex-1 bg-background justify-center px-6">
      <View className="items-center mb-4">
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={{ width: 88, height: 88, borderRadius: 44, alignItems: "center", justifyContent: "center", marginBottom: 16 }}
        >
          <Ionicons name="heart" size={36} color="#FFFFFF" />
        </LinearGradient>
        <Text style={{ fontFamily: fonts.extrabold, fontSize: 28, color: colors.primary }}>WellMom</Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>
          {t.tagline}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 24,
          padding: 24,
          shadowColor: colors.primary,
          shadowOpacity: 0.08,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary, marginBottom: 4 }}>{t.email}</Text>
        <View className="flex-row items-center bg-surface-container-low rounded-full px-4 mb-4">
          <Ionicons name="mail-outline" size={18} color={colors.textSecondary} />
          <TextInput
            className="flex-1 py-3 px-3"
            style={{ color: colors.textPrimary }}
            placeholder={t.emailPlaceholder}
            value={email}
            onChangeText={(v) => { setEmail(v); clearError(); }}
            autoCapitalize="none"
          />
        </View>

        <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary, marginBottom: 4 }}>{t.password}</Text>
        <View className="flex-row items-center bg-surface-container-low rounded-full px-4 mb-6">
          <Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />
          <TextInput
            className="flex-1 py-3 px-3"
            style={{ color: colors.textPrimary }}
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={(v) => { setPassword(v); clearError(); }}
          />
        </View>
        {authError && (
          <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.riskHigh, marginBottom: 8 }}>
            {authError}
          </Text>
        )}
        <TouchableOpacity onPress={handleLogin} activeOpacity={0.85} disabled={isSubmitting}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={{ borderRadius: 999, paddingVertical: 16, alignItems: "center", opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={{ fontFamily: fonts.semibold, color: "#FFFFFF" }}>{t.login}</Text>}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={{ fontFamily: fonts.regular, color: colors.textSecondary, textAlign: "center", marginTop: 24 }}>
          {t.noAccount} <Text style={{ fontFamily: fonts.bold, color: colors.primary }}>{t.register}</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
