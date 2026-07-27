import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { useTranslation } from "../../hooks/useTranslation";

export default function HelpScreen({ navigation }: any) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const { t } = useTranslation();
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-5 pt-2 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.textPrimary }}>{t.helpTitle}</Text>
      </View>

      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.textPrimary, marginBottom: 12 }}>
          {t.faqTitle}
        </Text>

        {t.faq.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => setExpanded(expanded === idx ? null : idx)}
            className="mb-3 p-4"
            style={{ backgroundColor: colors.surface, borderRadius: 16 }}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-between">
              <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.textPrimary, flex: 1, marginRight: 8 }}>
                {item.q}
              </Text>
              <Ionicons name={expanded === idx ? "chevron-up" : "chevron-down"} size={18} color={colors.textSecondary} />
            </View>
            {expanded === idx && (
              <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, lineHeight: 20, marginTop: 10 }}>
                {item.a}
              </Text>
            )}
          </TouchableOpacity>
        ))}

        <View className="p-4 mb-6" style={{ backgroundColor: colors.primaryContainer, borderRadius: 16, opacity: 0.9 }}>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.background, marginBottom: 4 }}>
            {t.stillQuestion}
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.background }}>
            {t.stillQuestionBody}
          </Text>
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}