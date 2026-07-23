import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { useTranslation } from "../../hooks/useTranslation";

export default function AboutScreen({ navigation }: any) {
  const { t } = useTranslation();
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-5 pt-2 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.textPrimary }}>{t.aboutTitle}</Text>
      </View>

      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
        <View className="items-center py-8">
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primaryContainer, alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <Ionicons name="heart" size={36} color={colors.primary} />
          </View>
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 24, color: colors.primary }}>WellMom</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>{t.version}</Text>
        </View>

        {t.aboutSections.map((section, idx) => (
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