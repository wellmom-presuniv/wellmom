import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { colors, riskCategoryStyle } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { AssessmentResult } from "../../types";
import { ReferralResponse } from "../../types/referral";
import { getReferral } from "../../api/referralService";
import { isMapRuleApplicable } from "../../constants/clinical";
import { useTranslation } from "../../hooks/useTranslation";
import AnimatedPressable from "@/components/AnimatedPressable";

export default function SelfAssessmentResultScreen({ route, navigation }: any) {
  const result: AssessmentResult = route.params.result;
  const risk = riskCategoryStyle[result.risk_category];
  const isHigh = result.risk_category === "HIGH";
  const isLow = result.risk_category === "LOW";
  const { t, language } = useTranslation();

  const [referral, setReferral] = useState<ReferralResponse | null>(null);
  const [isLoadingReferral, setIsLoadingReferral] = useState(!isLow);

  useEffect(() => {
    if (isLow) return;
    getReferral(result.risk_category as "MEDIUM" | "HIGH")
      .then(setReferral)
      .catch(() => {
        // Supplementary info — fail silently, don't block the result screen.
        setReferral(null);
      })
      .finally(() => setIsLoadingReferral(false));
  }, [isLow, result.risk_category]);

  const badgeScale = useSharedValue(0.8);
  const badgeOpacity = useSharedValue(0);
  useEffect(() => {
    badgeScale.value = withSpring(1, { damping: 12, stiffness: 180 });
    badgeOpacity.value = withSpring(1, { damping: 20 });
  }, []);
  const badgeStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.value,
    transform: [{ scale: badgeScale.value }],
  }));

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Status card */}
        <Animated.View className="items-center mb-6 p-6" style={[{ backgroundColor: risk.bg, borderRadius: 24 }, badgeStyle]}>
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
          <Text style={{ fontFamily: fonts.extrabold, fontSize: 22, color: risk.color, marginBottom: 8 }}>
            {result.risk_category === "LOW" ? t.riskLow : result.risk_category === "MEDIUM" ? t.riskMedium : t.riskHigh}
          </Text>
          <Text
            style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, textAlign: "center", lineHeight: 19 }}
          >
            {result.risk_category === "LOW" ? t.riskLowResult : result.risk_category === "MEDIUM" ? t.riskMediumResult : t.riskHighResult}
          </Text>
        </Animated.View>

        {/* Red flags yang trigger */}
        {result.triggered_red_flags && result.triggered_red_flags.length > 0 && (
          <Animated.View entering={FadeInUp.delay(100).duration(350)} className="mb-6">
            <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.textPrimary, marginBottom: 10 }}>
              {t.needsAttention}
            </Text>
            {result.triggered_red_flags.map((flag) => (
              <View
                key={flag.question_id}
                className="flex-row items-center p-3 mb-2"
                style={{ backgroundColor: colors.riskHighBg, borderRadius: 14, gap: 8 }}
              >
                <Ionicons name="alert-circle" size={16} color={colors.riskHigh} />
                <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textPrimary, flex: 1 }}>
                  {t.redFlags[flag.question_text] ?? flag.question_text}
                </Text>
              </View>
            ))}
          </Animated.View>
        )}
        {result.duration_triggered_symptoms && result.duration_triggered_symptoms.length > 0 && (
          <Animated.View entering={FadeInUp.delay(150).duration(350)} className="mb-6">
            <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.textPrimary, marginBottom: 10 }}>
              {t.ongoingSymptoms}
            </Text>
            {result.duration_triggered_symptoms.map((symptom, idx) => {
              const isWarning = symptom.status === "WARNING";
              return (
                <View
                  key={idx}
                  className="flex-row items-center p-3 mb-2"
                  style={{ backgroundColor: isWarning ? colors.riskMediumBg : colors.riskHighBg, borderRadius: 14, gap: 8 }}
                >
                  <Ionicons name="time-outline" size={16} color={isWarning ? colors.riskMedium : colors.riskHigh} />
                  <View className="flex-1">
                    <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textPrimary }}>
                      {symptom.symptom === "BLEEDING" ? t.symptomBleeding : symptom.symptom === "BLURRED_VISION" ? t.symptomBlurredVision : t.symptomFever}
                    </Text>
                    <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary }}>
                      {symptom.days_active} {language === "id" ? "hari" : "days"} · {isWarning ? t.monitorOn : t.checkNow}
                    </Text>
                  </View>
                  <View style={{ backgroundColor: isWarning ? colors.riskMedium : colors.riskHigh, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ fontFamily: fonts.bold, fontSize: 10, color: "#FFFFFF" }}>
                      {isWarning ? t.caution : t.danger}
                    </Text>
                  </View>
                </View>
              );
            })}
          </Animated.View>
        )}

        {result.bp_category && result.bp_category !== "NORMAL" && (
          <Animated.View entering={FadeInUp.delay(200).duration(350)} className="flex-row items-center p-4 mb-4" style={{ backgroundColor: colors.riskMediumBg, borderRadius: 16, gap: 10 }}>
            <Ionicons name="heart-outline" size={18} color={colors.riskMedium} />
            <View className="flex-1">
              <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.riskMedium }}>
                {t.bloodPressureLabel}
              </Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary }}>
                {result.bp_category === "ELEVATED" ? t.bpElevated : result.bp_category === "STAGE_1" ? t.bpStage1 : result.bp_category === "STAGE_2" ? t.bpStage2 : t.bpCrisis}
              </Text>
            </View>
          </Animated.View>
        )}

        {result.map_mmhg != null && (() => {
          // Label "Berisiko" hanya dari flag backend (sumber kebenaran). Nilai MAP tetap tampil sebagai informasi.
          const mapAtRisk = result.map_at_risk === true;
          const mapNotApplicable = result.gestational_week != null && !isMapRuleApplicable(result.gestational_week);
          return (
          <Animated.View entering={FadeInUp.delay(220).duration(350)} className="p-4 mb-4" style={{ backgroundColor: colors.surface, borderRadius: 16 }}>
            <View className="flex-row items-center justify-between">
              <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary }}>{t.mapLabel}</Text>
              <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: mapAtRisk ? colors.riskMedium : colors.textPrimary }}>
                {result.map_mmhg} mmHg{mapAtRisk ? ` · ${t.mapAtRiskLabel}` : ""}
              </Text>
            </View>
            <Text style={{ fontFamily: fonts.regular, fontSize: 10, color: colors.textSecondary, marginTop: 2 }}>{t.mapFormula}</Text>
            {mapAtRisk && (
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.riskMedium, marginTop: 6 }}>{t.mapElevatedNote}</Text>
            )}
            {mapNotApplicable && (
              <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary, marginTop: 6 }}>{t.mapNotApplicableNote}</Text>
            )}
          </Animated.View>
          );
        })()}

        {/* Skor (kalau ga red-flag) */}
        {!isHigh || result.triggered_red_flags?.length === 0 ? (
          <Animated.View entering={FadeInUp.delay(250).duration(350)} className="flex-row items-center justify-between p-4 mb-6" style={{ backgroundColor: colors.surface, borderRadius: 16 }}>
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary }}>{t.totalScore}</Text>
            <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.textPrimary }}>
              {result.total_score}
            </Text>
          </Animated.View>
        ) : null}

        {/* Rekomendasi rujukan (MEDIUM/HIGH) — supplementary info, fail silently kalau gagal fetch */}
        {!isLow &&
          (isLoadingReferral ? (
            <View
              className="flex-row items-center justify-center p-4 mb-6"
              style={{ backgroundColor: colors.surface, borderRadius: 20, gap: 8 }}
            >
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary }}>
                {t.referralLoading}
              </Text>
            </View>
          ) : referral ? (
            <Animated.View
              entering={FadeInUp.delay(280).duration(350)}
              className="p-4 mb-6"
              style={{ backgroundColor: colors.surface, borderRadius: 20 }}
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary }}>
                  {t.referralTitle}
                </Text>
                <View style={{ backgroundColor: risk.bg, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: risk.color }}>
                    {referral.urgency_label}
                  </Text>
                </View>
              </View>
              <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.textPrimary, marginBottom: 6 }}>
                {referral.facility_type}
              </Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, lineHeight: 19 }}>
                {referral.recommendation}
              </Text>
            </Animated.View>
          ) : null)}

        {/* <TouchableOpacity
          onPress={() => navigation.getParent()?.getParent()?.navigate("Edukasi")}
          activeOpacity={0.85}
          style={{ marginBottom: 12 }}
        >
          <View style={{ backgroundColor: colors.secondary, borderRadius: 999, paddingVertical: 16, alignItems: "center" }}>
            <Text style={{ fontFamily: fonts.semibold, color: "#FFFFFF" }}>Lihat Saran & Edukasi</Text>
          </View>
        </TouchableOpacity> */}

        <AnimatedPressable haptic onPress={() => navigation.popToTop()} style={{ marginBottom: 24 }}>
          <View
            style={{
              borderWidth: 1.5,
              borderColor: colors.primary,
              borderRadius: 999,
              paddingVertical: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: fonts.semibold, color: colors.primary }}>{t.backHome}</Text>
          </View>
        </AnimatedPressable>
      </ScrollView>
    </SafeAreaView>
  );
}