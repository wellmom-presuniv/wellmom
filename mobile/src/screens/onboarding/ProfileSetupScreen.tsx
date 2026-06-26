import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/useAuthStore";

export default function ProfileSetupScreen() {
  const [estimatedDueDate, setEstimatedDueDate] = useState("");
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);

  const handleContinue = () => {
    // TODO: hitung trimester & minggu kehamilan dari HPL, simpan ke API profil Alek
    completeOnboarding();
  };

  return (
    <SafeAreaView className="flex-1 bg-background justify-center px-6">
      <Text className="text-2xl font-bold text-primary-dark mb-2">Lengkapi Profil</Text>
      <Text className="text-text-secondary mb-8">
        Masukkan perkiraan tanggal HPL (Hari Perkiraan Lahir) untuk menghitung trimester kehamilanmu.
      </Text>

      <Text className="text-text-secondary text-sm mb-1">Perkiraan HPL</Text>
      <TextInput
        className="bg-surface border border-border rounded-xl px-4 py-3 mb-6 text-text-primary"
        placeholder="DD/MM/YYYY"
        value={estimatedDueDate}
        onChangeText={setEstimatedDueDate}
      />

      <TouchableOpacity className="bg-primary rounded-xl py-4 items-center" onPress={handleContinue}>
        <Text className="text-white font-semibold">Lanjutkan</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
