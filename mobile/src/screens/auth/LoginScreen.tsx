import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/useAuthStore";

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
      <Text className="text-3xl font-bold text-primary-dark mb-1">WellMom</Text>
      <Text className="text-text-secondary mb-8">Healthy Mom, Healthy Baby 💗</Text>

      <Text className="text-text-secondary text-sm mb-1">Email</Text>
      <TextInput
        className="bg-surface border border-border rounded-xl px-4 py-3 mb-4 text-text-primary"
        placeholder="nama@email.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Text className="text-text-secondary text-sm mb-1">Password</Text>
      <TextInput
        className="bg-surface border border-border rounded-xl px-4 py-3 mb-6 text-text-primary"
        placeholder="••••••••"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity className="bg-primary rounded-xl py-4 items-center mb-4" onPress={handleLogin}>
        <Text className="text-white font-semibold">Masuk</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text className="text-text-secondary text-center">
          Belum punya akun? <Text className="text-primary font-semibold">Daftar</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
