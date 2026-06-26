import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// TODO Sprint 2: tampilkan rekam jejak hasil assessment & log checklist dari waktu ke waktu.
export default function HistoryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
      <Text className="text-text-primary font-semibold text-lg mb-1">Riwayat</Text>
      <Text className="text-text-secondary text-center text-sm">
        Placeholder — riwayat assessment & checklist akan dibangun di Sprint 2.
      </Text>
    </SafeAreaView>
  );
}
