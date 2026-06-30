import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, riskCategoryStyle } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { AssessmentResult } from "../../types";

export default function SelfAssessmentResultScreen({ route, navigation }: any) {
  const result: AssessmentResult = route.params.result;
  const risk = riskCategoryStyle[result.risk_category];
  const isHigh = result.risk_category === "HIGH";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Status card */}
        <View className="items-center mb-6 p-6" style={{ backgroundColor: risk.bg, borderRadius: 24 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: colors.surface,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Ionicons
              name={isHigh ? "warning" : result.risk_category === "MEDIUM" ? "information-circle" : "checkmark-circle"}
              size={32}
              color={risk.color}
            />
          </View>
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 22, color: risk.color, marginBottom: 4 }}>
            {risk.label}
          </Text>
          {result.recommendation_text && (
            <Text
              style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, textAlign: "center", lineHeight: 19 }}
            >
              {result.recommendation_text}
            </Text>
          )}
        </View>

        {/* Red flags yang trigger */}
        {result.triggered_red_flags && result.triggered_red_flags.length > 0 && (
          <View className="mb-6">
            <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.textPrimary, marginBottom: 10 }}>
              Yang perlu diperhatikan
            </Text>
            {result.triggered_red_flags.map((flag) => (
              <View
                key={flag.question_id}
                className="flex-row items-center p-3 mb-2"
                style={{ backgroundColor: colors.riskHighBg, borderRadius: 14, gap: 8 }}
              >
                <Ionicons name="alert-circle" size={16} color={colors.riskHigh} />
                <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textPrimary, flex: 1 }}>
                  {flag.question_text}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skor (kalau ga red-flag) */}
        {!isHigh || result.triggered_red_flags?.length === 0 ? (
          <View className="flex-row items-center justify-between p-4 mb-6" style={{ backgroundColor: colors.surface, borderRadius: 16 }}>
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary }}>Total Skor</Text>
            <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.textPrimary }}>
              {result.total_score}
            </Text>
          </View>
        ) : null}

        {/* CTA */}
        {isHigh ? (
          <TouchableOpacity activeOpacity={0.85} style={{ marginBottom: 12 }}>
            <View style={{ backgroundColor: colors.riskHigh, borderRadius: 999, paddingVertical: 16, alignItems: "center" }}>
              <Text style={{ fontFamily: fonts.semibold, color: "#FFFFFF" }}>Segera ke Fasilitas Kesehatan</Text>
            </View>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity onPress={() => navigation.navigate("Beranda")} activeOpacity={0.85} style={{ marginBottom: 24 }}>
          <View
            style={{
              borderWidth: 1.5,
              borderColor: colors.primary,
              borderRadius: 999,
              paddingVertical: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: fonts.semibold, color: colors.primary }}>Kembali ke Beranda</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}