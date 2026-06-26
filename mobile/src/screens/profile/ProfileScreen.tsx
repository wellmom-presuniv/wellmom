import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/useAuthStore";

export default function ProfileScreen() {
  const logout = useAuthStore((s) => s.logout);

  return (
    <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
      <Text className="text-text-primary font-semibold text-lg mb-1">Profil</Text>
      <Text className="text-text-secondary text-center text-sm mb-6">
        Placeholder — kelola data profil (trimester, HPL) akan dibangun di Sprint 2.
      </Text>
      <TouchableOpacity className="bg-primary rounded-xl px-6 py-3" onPress={logout}>
        <Text className="text-white font-semibold">Keluar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
