import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
      <Text className="text-3xl font-bold text-primary-dark mb-1">Buat Akun</Text>
      <Text className="text-text-secondary mb-8">Mulai perjalanan kehamilan sehatmu</Text>

      <Text className="text-text-secondary text-sm mb-1">Nama</Text>
      <TextInput
        className="bg-surface border border-border rounded-xl px-4 py-3 mb-4 text-text-primary"
        value={name}
        onChangeText={setName}
      />

      <Text className="text-text-secondary text-sm mb-1">Email</Text>
      <TextInput
        className="bg-surface border border-border rounded-xl px-4 py-3 mb-4 text-text-primary"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text className="text-text-secondary text-sm mb-1">Password</Text>
      <TextInput
        className="bg-surface border border-border rounded-xl px-4 py-3 mb-6 text-text-primary"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity className="bg-primary rounded-xl py-4 items-center mb-4" onPress={handleRegister}>
        <Text className="text-white font-semibold">Daftar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text className="text-text-secondary text-center">
          Sudah punya akun? <Text className="text-primary font-semibold">Masuk</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
