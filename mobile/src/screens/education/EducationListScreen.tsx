import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// TODO Sprint 2: list topik (Nutrisi per Trimester, Tablet Tambah Darah, Makanan Sehat,
// Tanda Bahaya Kehamilan, Persiapan Persalinan) + halaman detail konten.
// Konten menunggu materi final dari dr. Nucky — render dari API, jangan hardcode.
export default function EducationListScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
      <Text className="text-text-primary font-semibold text-lg mb-1">Edukasi</Text>
      <Text className="text-text-secondary text-center text-sm">
        Placeholder — konten edukasi per-trimester akan ditampilkan di sini setelah materi final dari tim medis tersedia.
      </Text>
    </SafeAreaView>
  );
}
