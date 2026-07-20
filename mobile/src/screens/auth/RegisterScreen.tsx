import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/useAuthStore";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { useTranslation } from "../../hooks/useTranslation";

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const registerUser = useAuthStore((s) => s.register);
  const isSubmitting = useAuthStore((s) => s.isSubmitting);
  const authError = useAuthStore((s) => s.authError);
  const clearError = useAuthStore((s) => s.clearError);
  const { t } = useTranslation();
 const handleRegister = async () => {
    try {
      await registerUser({ email, full_name: name, password });
      // Sukses: backend auto-login, token udah ke-set di store.
      // RootNavigator otomatis switch ke ProfileSetup, ga perlu navigate manual.
    } catch {
      // Error message udah di-handle & disimpan di store (authError).
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background justify-center px-6">
      <Text style={{ fontFamily: fonts.extrabold, fontSize: 26, color: colors.textPrimary }}>{t.createAccount}</Text>
      <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary, marginTop: 4, marginBottom: 24 }}>
        {t.createAccountSubtitle}
      </Text>
      <View style={{ backgroundColor: colors.surface, borderRadius: 24, padding: 24, shadowColor: colors.primary, shadowOpacity: 0.08, shadowRadius: 24, shadowOffset: { width: 0, height: 4 } }}>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary, marginBottom: 4 }}>{t.fullName}</Text>
        <TextInput
          className="bg-surface-container-low rounded-full px-4 py-3 mb-4"
          style={{ color: colors.textPrimary }}
          placeholder={t.namePlaceholder}
          value={name}
          onChangeText={(v) => { setName(v); clearError(); }}
        />
        <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary, marginBottom: 4 }}>{t.email}</Text>
        <TextInput
          className="bg-surface-container-low rounded-full px-4 py-3 mb-4"
          style={{ color: colors.textPrimary }}
          placeholder={t.emailPlaceholder}
          autoCapitalize="none"
          value={email}
          onChangeText={(v) => { setEmail(v); clearError(); }}
        />

        <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary, marginBottom: 4 }}>{t.password}</Text>
        <TextInput
          className="bg-surface-container-low rounded-full px-4 py-3 mb-4"
          style={{ color: colors.textPrimary }}
          placeholder={t.passwordPlaceholder}
          secureTextEntry
          value={password}
          onChangeText={(v) => { setPassword(v); clearError(); }}
        />
        {authError && (
          <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.riskHigh, marginBottom: 4 }}>
            {authError}
          </Text>
        )}
      <View
        style={{ height: 120, borderRadius: 16, backgroundColor: colors.primaryContainer, alignItems: "center", justifyContent: "center", marginBottom: 16, opacity: 0.85 }}
      >
        {/* TODO: ganti pakai ilustrasi asli kalau udah ada aset-nya */}
        <Ionicons name="woman" size={48} color="#FFFFFF" />
      </View>

      <TouchableOpacity onPress={handleRegister} activeOpacity={0.85} disabled={isSubmitting}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={{ borderRadius: 999, paddingVertical: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", opacity: isSubmitting ? 0.7 : 1 }}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={{ fontFamily: fonts.semibold, color: "#FFFFFF", marginRight: 6 }}>{t.register}</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>          

      <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary, textAlign: "center", marginTop: 12 }}>
        {t.terms}
        <Text style={{ fontFamily: fonts.bold, color: colors.primary }}>{t.termsLink}</Text>
      </Text>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={{ fontFamily: fonts.regular, color: colors.textSecondary, textAlign: "center" }}>
          {t.hasAccount}{" "}
          <Text style={{ fontFamily: fonts.bold, color: colors.primary }}>{t.login}</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
