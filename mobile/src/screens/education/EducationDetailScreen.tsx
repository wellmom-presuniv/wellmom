import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { useTranslation } from "../../hooks/useTranslation";

export default function EducationDetailScreen({ route, navigation }: any) {
  const { title, body } = route.params ?? {};
  const { t } = useTranslation();

  if (!body) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
        <Ionicons name="construct-outline" size={40} color={colors.textSecondary} />
        <Text style={{ fontFamily: fonts.semibold, color: colors.textSecondary, marginTop: 12, textAlign: "center" }}>
          {t.contentNotReady}
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={{ fontFamily: fonts.bold, color: colors.primary }}>{t.back}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Parse body — render per paragraf/section berdasarkan newline
  const bodyToRender = t.educationBodies[title] ?? body;
  const paragraphs = bodyToRender.split("\n").filter((line: string) => line.trim() !== "");

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner header */}
        <Animated.View
          entering={FadeIn.duration(300)}
          style={{ height: 180, backgroundColor: colors.primaryContainer, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="book" size={56} color="#FFFFFF" />
        </Animated.View>

        {/* Back button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "rgba(255,255,255,0.85)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        <Animated.View
          entering={FadeInUp.delay(80).duration(350)}
          className="px-5 pt-5"
          style={{ backgroundColor: colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -24 }}
        >
          {/* Title */}
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 22, color: colors.textPrimary, marginBottom: 16 }}>
            {t.educationTitles[title] ?? title}
          </Text>

          {/* Body — render per baris */}
          {paragraphs.map((line: string, idx: number) => {
            // Bold heading — baris yang diawali **
            if (line.startsWith("**") && line.endsWith("**")) {
              return (
                <Text key={idx} style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.textPrimary, marginTop: 16, marginBottom: 4 }}>
                  {line.replace(/\*\*/g, "")}
                </Text>
              );
            }
            // Inline bold — baris yang ada **teks** di tengah
            if (line.includes("**")) {
              const parts = line.split(/\*\*(.*?)\*\*/g);
              return (
                <Text key={idx} style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, lineHeight: 20, marginBottom: 4 }}>
                  {parts.map((part, i) =>
                    i % 2 === 1
                      ? <Text key={i} style={{ fontFamily: fonts.bold, color: colors.textPrimary }}>{part}</Text>
                      : part
                  )}
                </Text>
              );
            }
            // Bullet ✅ ❌ 🔴
            if (line.match(/^[✅❌🔴🔵⚠️•\-]/)) {
              return (
                <View key={idx} className="flex-row mb-2" style={{ gap: 8 }}>
                  <Text style={{ fontSize: 13, lineHeight: 20 }}>{line.charAt(0)}</Text>
                  <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 20 }}>
                    {line.substring(1).trim()}
                  </Text>
                </View>
              );
            }
            // Numbered list
            if (line.match(/^\d+\./)) {
              return (
                <View key={idx} className="flex-row mb-2" style={{ gap: 8 }}>
                  <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.primary, width: 20 }}>
                    {line.match(/^\d+/)?.[0]}.
                  </Text>
                  <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 20 }}>
                    {line.replace(/^\d+\./, "").trim()}
                  </Text>
                </View>
              );
            }
            // Source line
            if (line.startsWith("Sumber:")) {
              return (
                <Text key={idx} style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary, marginTop: 16, fontStyle: "italic" }}>
                  {line}
                </Text>
              );
            }
            // Regular paragraph
            return (
              <Text key={idx} style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, lineHeight: 20, marginBottom: 4 }}>
                {line}
              </Text>
            );
          })}

          <View style={{ height: 32 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}