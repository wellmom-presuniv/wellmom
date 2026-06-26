import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    // TODO: call endpoint register Alek, lalu arahkan ke Login
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView className="flex-1 bg-background justify-center px-6">
      <Text style={{ fontFamily: fonts.extrabold, fontSize: 26, color: colors.textPrimary }}>Buat Akun</Text>
      <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary, marginTop: 4, marginBottom: 24 }}>
        Mulai perjalanan kehamilan sehatmu bersama kami.
      </Text>

      <View style={{ backgroundColor: colors.surface, borderRadius: 24, padding: 24, shadowColor: colors.primary, shadowOpacity: 0.08, shadowRadius: 24, shadowOffset: { width: 0, height: 4 } }}>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary, marginBottom: 4 }}>Nama</Text>
        <TextInput
          className="bg-surface-container-low rounded-full px-4 py-3 mb-4"
          style={{ color: colors.textPrimary }}
          placeholder="Masukkan nama Anda"
          value={name}
          onChangeText={setName}
        />
        <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary, marginBottom: 4 }}>Email</Text>
        <TextInput
          className="bg-surface-container-low rounded-full px-4 py-3 mb-4"
          style={{ color: colors.textPrimary }}
          placeholder="contoh@email.com"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary, marginBottom: 4 }}>Password</Text>
        <TextInput
          className="bg-surface-container-low rounded-full px-4 py-3 mb-4"
          style={{ color: colors.textPrimary }}
          placeholder="Buat kata sandi"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      <View
        style={{ height: 120, borderRadius: 16, backgroundColor: colors.primaryContainer, alignItems: "center", justifyContent: "center", marginBottom: 16, opacity: 0.85 }}
      >
        {/* TODO: ganti pakai ilustrasi asli kalau udah ada aset-nya */}
        <Ionicons name="woman" size={48} color="#FFFFFF" />
      </View>

      <TouchableOpacity onPress={handleRegister} activeOpacity={0.85}>
        <LinearGradient colors={[colors.primary, colors.secondary]} style={{ borderRadius: 999, paddingVertical: 16, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontFamily: fonts.semibold, color: "#FFFFFF", marginRight: 6 }}>Daftar Sekarang</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>          

      <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary, textAlign: "center", marginTop: 12 }}>
        Dengan mendaftar, kamu menyetujui{" "}
        <Text style={{ fontFamily: fonts.bold, color: colors.primary }}>Syarat & Ketentuan</Text>
      </Text>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text className="text-text-secondary text-center">
          Sudah punya akun? <Text className="text-primary font-semibold">Masuk</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
