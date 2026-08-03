import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { useTranslation } from "../../hooks/useTranslation";


export default function GuideScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | null>("danger");
  const sectionStyle: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }> = {
    danger: { icon: "warning", color: colors.riskHigh, bg: colors.riskHighBg },
    risk: { icon: "shield-checkmark", color: colors.background, bg: colors.primaryContainer },
    howto: { icon: "phone-portrait", color: colors.secondary, bg: "rgba(113,42,226,0.1)" },
    anc: { icon: "calendar", color: colors.riskLow, bg: colors.riskLowBg },
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-5 pt-2 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.textPrimary }}>{t.guideTitle}</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary }}>
            {t.guideSubtitle}
          </Text>
        </View>
      </View>

      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
        {t.guideSections.map((section) => {
        const isOpen = expanded === section.id;
        const style = sectionStyle[section.id] ?? { icon: "ellipse" as const, color: colors.primary, bg: colors.surfaceContainer };
        return (
          <View key={section.id} className="mb-3" style={{ borderRadius: 20, overflow: "hidden" }}>
            <TouchableOpacity
              onPress={() => setExpanded(isOpen ? null : section.id)}
              activeOpacity={0.7}
              style={{ backgroundColor: colors.surface }}
            >
              <View className="flex-row items-center p-4">
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: style.bg, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                  <Ionicons name={style.icon} size={22} color={style.color} />
                </View>
                <View className="flex-1">
                  <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.textPrimary }}>{section.title}</Text>
                  <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>{section.subtitle}</Text>
                </View>
                <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={18} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>

            {isOpen && (
              <View style={{ backgroundColor: colors.surface, paddingHorizontal: 16, paddingBottom: 16 }}>
                <View style={{ height: 1, backgroundColor: colors.outlineVariant, marginBottom: 12 }} />
                {section.items.map((item, idx) => (
                  <View key={idx} className="flex-row items-start mb-3" style={{ gap: 10 }}>
                    <Ionicons name="ellipse" size={8} color={style.color} style={{ marginTop: 6 }} />
                    <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 19 }}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}

        {/* Disclaimer */}
        <View className="p-4 mb-6" style={{ backgroundColor: colors.surfaceContainer, borderRadius: 16 }}>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary, marginBottom: 4 }}>
            {t.disclaimer}
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, lineHeight: 18 }}>
            {t.disclaimerBody}
          </Text>
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}