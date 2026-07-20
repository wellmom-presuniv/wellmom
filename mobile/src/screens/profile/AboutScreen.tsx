import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

export default function AboutScreen({ navigation }: any) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-5 pt-2 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.textPrimary }}>Tentang WellMom</Text>
      </View>

      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
        <View className="items-center py-8">
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primaryContainer, alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <Ionicons name="heart" size={36} color={colors.primary} />
          </View>
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 24, color: colors.primary }}>WellMom</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>Versi 1.0.0</Text>
        </View>

        {[
          { title: "Apa itu WellMom?", body: "WellMom adalah aplikasi pendamping kesehatan ibu hamil yang membantu memantau kehamilan secara mandiri di antara kunjungan ANC (Antenatal Care)." },
          { title: "Fitur Utama", body: "• Edukasi gizi berbasis trimester\n• Self-assessment risiko kehamilan harian\n• Checklist kepatuhan kesehatan\n• Panduan rujukan ke fasilitas kesehatan" },
          { title: "Disclaimer Penting", body: "Aplikasi ini bersifat edukatif dan TIDAK menggantikan konsultasi medis. Seluruh konten telah divalidasi oleh dr. Nucky Indra Praja, Sp.OT, M.Kes." },
          { title: "Dikembangkan oleh", body: "Mahasiswa Universitas Presiden\nFakultas Ilmu Komputer × Fakultas Kedokteran\n\nTim: Arka, Alek, Thoriq, Arizal\nLiaison Medis: Chelsea Venustine" },
        ].map((section, idx) => (
          <View key={idx} className="mb-4 p-4" style={{ backgroundColor: colors.surface, borderRadius: 16 }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.textPrimary, marginBottom: 6 }}>{section.title}</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, lineHeight: 20 }}>{section.body}</Text>
          </View>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}