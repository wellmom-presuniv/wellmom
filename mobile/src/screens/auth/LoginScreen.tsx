import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/useAuthStore";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((s) => s.login);

  const handleLogin = async () => {
    // TODO: ganti dengan call ke endpoint auth Alek, lalu simpan token asli
    await login("dummy-token-replace-me");
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
          Healthy Mom, Healthy Baby 💗
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
        <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary, marginBottom: 4 }}>Email</Text>
        <View className="flex-row items-center bg-surface-container-low rounded-full px-4 mb-4">
          <Ionicons name="mail-outline" size={18} color={colors.textSecondary} />
          <TextInput
            className="flex-1 py-3 px-3"
            style={{ color: colors.textPrimary }}
            placeholder="nama@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary, marginBottom: 4 }}>Password</Text>
        <View className="flex-row items-center bg-surface-container-low rounded-full px-4 mb-6">
          <Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />
          <TextInput
            className="flex-1 py-3 px-3"
            style={{ color: colors.textPrimary }}
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity onPress={handleLogin} activeOpacity={0.85}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={{ borderRadius: 999, paddingVertical: 16, alignItems: "center" }}
          >
            <Text style={{ fontFamily: fonts.semibold, color: "#FFFFFF" }}>Masuk</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={{ fontFamily: fonts.regular, color: colors.textSecondary, textAlign: "center", marginTop: 24 }}>
          Belum punya akun? <Text style={{ fontFamily: fonts.bold, color: colors.primary }}>Daftar</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
