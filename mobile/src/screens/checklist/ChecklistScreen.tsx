import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// TODO Sprint 2: toggle per item harian (tablet tambah darah, air 8 gelas, protein,
// sayur&buah, susu/kalsium, istirahat), navigasi per tanggal, indikator konsistensi.
export default function ChecklistScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
      <Text className="text-text-primary font-semibold text-lg mb-1">Checklist Harian</Text>
      <Text className="text-text-secondary text-center text-sm">
        Placeholder — checklist kepatuhan harian akan dibangun di Sprint 2.
      </Text>
    </SafeAreaView>
  );
}
