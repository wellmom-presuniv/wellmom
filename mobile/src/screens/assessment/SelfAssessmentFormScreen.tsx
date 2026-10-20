import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInRight,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { getAssessmentQuestions, submitAssessment, getTodayAssessment } from "../../api/assessmentService";
import { AssessmentQuestion, MedicalHistoryCode } from "../../types";
import { getMyProfile } from "../../api/profileService";
import { isBpAtRisk, isMapAtRisk, isMapRuleApplicable } from "../../constants/clinical";
import { useTranslation } from "../../hooks/useTranslation";
import { useFocusEffect } from "@react-navigation/native";
import AnimatedPressable from "@/components/AnimatedPressable";

function ProgressDot({ answered }: { answered: boolean }) {
  const fill = useSharedValue(answered ? 1 : 0);

  useEffect(() => {
    fill.value = withTiming(answered ? 1 : 0, { duration: 250 });
  }, [answered]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(fill.value, [0, 1], [colors.surfaceContainer, colors.primary]),
  }));

  return <Animated.View style={[{ flex: 1, height: 4, borderRadius: 2 }, animatedStyle]} />;
}

// Pertanyaan gerakan janin (order_index 10) hanya relevan mulai trimester 2.
// Backend mewajibkan semua pertanyaan aktif terjawab, jadi kalau disembunyikan kita kirim "Tidak".
const FETAL_MOVEMENT_ORDER_INDEX = 10;
const FETAL_MOVEMENT_MIN_TRIMESTER = 2;

const HISTORY_OPTIONS: { code: MedicalHistoryCode; labelKey:
  | "historyHypertension" | "historyDiabetes" | "historyKidney" | "historyHeart"
  | "historyAutoimmune" | "historyClotting" | "historyAnemia" | "historyNone" }[] = [
  { code: "HYPERTENSION", labelKey: "historyHypertension" },
  { code: "DIABETES", labelKey: "historyDiabetes" },
  { code: "KIDNEY_DISEASE", labelKey: "historyKidney" },
  { code: "HEART_DISEASE", labelKey: "historyHeart" },
  { code: "AUTOIMMUNE", labelKey: "historyAutoimmune" },
  { code: "CLOTTING_DISORDER", labelKey: "historyClotting" },
  { code: "SEVERE_ANEMIA", labelKey: "historyAnemia" },
  { code: "NONE", labelKey: "historyNone" },
];

// MAP = (Sistolik + 2 x Diastolik) / 3 (Buku KIA 2024). Informasional.
function calculateMap(systolic: string, diastolic: string): number | null {
  const sys = Number(systolic);
  const dia = Number(diastolic);
  if (!systolic || !diastolic || !Number.isFinite(sys) || !Number.isFinite(dia) || sys <= 0 || dia <= 0) return null;
  return Math.round(((sys + 2 * dia) / 3) * 10) / 10;
}

export default function SelfAssessmentFormScreen({ navigation }: any) {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [systolicBp, setSystolicBp] = useState("");
  const [diastolicBp, setDiastolicBp] = useState("");
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryCode[]>([]);
  const [trimester, setTrimester] = useState<number | null>(null);
  const [gestationalWeek, setGestationalWeek] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t, language } = useTranslation();
  // Q10 disembunyikan kalau profil sudah dimuat dan masih trimester 1.
  const hideFetalMovement = trimester !== null && trimester < FETAL_MOVEMENT_MIN_TRIMESTER;
  const visibleQuestions = questions.filter(
    (q) => !(hideFetalMovement && q.order_index === FETAL_MOVEMENT_ORDER_INDEX)
  );
  const answeredCount = visibleQuestions.filter((q) => answers[q.question_id] !== undefined).length;
  const hasHistory = medicalHistory.length > 0;
  const allAnswered = answeredCount === visibleQuestions.length && hasHistory;
  const mapValue = calculateMap(systolicBp, diastolicBp);
  // Pratinjau jalur tensi AHA >= STAGE_2 (usia kehamilan berapa pun); hasil akhir tetap dari backend.
  const bpAtRisk = mapValue !== null && isBpAtRisk(Number(systolicBp), Number(diastolicBp));
  const mapAtRisk = mapValue !== null && isMapAtRisk(Number(systolicBp), Number(diastolicBp), gestationalWeek);
  // Usia kehamilan diketahui dan >= 20 minggu: MAP hanya informasi.
  const mapNotApplicable = mapValue !== null && gestationalWeek !== null && !isMapRuleApplicable(gestationalWeek);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      const init = async () => {
        try {
          const todayResult = await getTodayAssessment();
          if (cancelled) return;
          if (todayResult) {
            navigation.replace("SelfAssessmentResult", { result: todayResult });
            return;
          }
          const [q, profile] = await Promise.all([
            getAssessmentQuestions(),
            getMyProfile().catch(() => null), // gagal ambil profil -> tampilkan semua pertanyaan
          ]);
          if (!cancelled) {
            setQuestions(q);
            setTrimester(profile?.trimester ?? null);
            setGestationalWeek(profile?.gestational_week ?? null);
          }
        } catch (err) {
          console.warn("Gagal fetch pertanyaan dari API:", err);
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      };
      init();
      return () => { cancelled = true; };
    }, [])
  );

  const setAnswer = (id: string, value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const toggleHistory = (code: MedicalHistoryCode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMedicalHistory((prev) => {
      if (code === "NONE") return prev.includes("NONE") ? [] : ["NONE"];
      const withoutNone = prev.filter((c) => c !== "NONE");
      return withoutNone.includes(code) ? withoutNone.filter((c) => c !== code) : [...withoutNone, code];
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        answers: questions.map((q) => ({
          question_id: q.question_id,
          // Pertanyaan yang disembunyikan (gerakan janin di T1) dikirim sebagai "Tidak".
          answer: visibleQuestions.includes(q) ? answers[q.question_id] === true : false,
        })),
        systolic_bp: systolicBp ? Number(systolicBp) : null,
        diastolic_bp: diastolicBp ? Number(diastolicBp) : null,
        medical_history: medicalHistory,
      };
      const result = await submitAssessment(payload);
      navigation.replace("SelfAssessmentResult", { result });
    } catch (err: any) {
      if (err?.response?.status === 409) {
        // Sudah submit hari ini (race condition) — fetch result yang ada
        const todayResult = await getTodayAssessment();
        if (todayResult) navigation.replace("SelfAssessmentResult", { result: todayResult });
      } else {
        console.warn("Gagal submit assessment:", err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-2 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.textPrimary }}>
            {t.assessmentTitle}
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary }}>
            {t.assessmentSubtitle}
          </Text>
        </View>
      </View>

      {/* Progress dots */}
      <View className="flex-row px-5 mb-4" style={{ gap: 4 }}>
        {visibleQuestions.map((q) => (
          <ProgressDot key={q.question_id} answered={answers[q.question_id] !== undefined} />
        ))}
        <ProgressDot answered={hasHistory} />
      </View>

      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
        {visibleQuestions.map((q, idx) => (
          <Animated.View
            key={q.question_id}
            entering={FadeInRight.delay(idx * 40).duration(300)}
            className="flex-row items-center justify-between p-4 mb-3"
            style={{ backgroundColor: colors.surface, borderRadius: 18 }}
          >
            <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.textPrimary, flex: 1, marginRight: 12 }}>
              {/* question_text dari backend/CMS selalu Bahasa Indonesia (gak ada kolom _en) —
                  t.questions cuma dipakai buat translate ke Inggris, ID selalu pakai teks live
                  biar edit dari CMS langsung kepakai, gak ketimpa terjemahan hardcode lama. */}
              {language === "en" ? t.questions[q.order_index] ?? q.question_text : q.question_text}
            </Text>
            <View className="flex-row" style={{ backgroundColor: colors.surfaceContainer, borderRadius: 999, padding: 3 }}>
              <AnimatedPressable
                onPress={() => setAnswer(q.question_id, true)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: answers[q.question_id] === true ? colors.primary : "transparent",
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.semibold,
                    fontSize: 12,
                    color: answers[q.question_id] === true ? "#FFFFFF" : colors.textSecondary,
                  }}
                >
                  {t.yes}
                </Text>
              </AnimatedPressable>
              <AnimatedPressable
                onPress={() => setAnswer(q.question_id, false)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: answers[q.question_id] === false ? colors.primary : "transparent",
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.semibold,
                    fontSize: 12,
                    color: answers[q.question_id] === false ? "#FFFFFF" : colors.textSecondary,
                  }}
                >
                  {t.no}
                </Text>
              </AnimatedPressable>
            </View>
          </Animated.View>
        ))}

        {hideFetalMovement && (
          <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary, marginBottom: 12, paddingHorizontal: 4 }}>
            {t.fetalMovementLater}
          </Text>
        )}

        {/* Riwayat penyakit (Q11) — multi-select, tidak diskor */}
        <View className="p-4 mb-3" style={{ backgroundColor: colors.surface, borderRadius: 18 }}>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.textPrimary, marginBottom: 4 }}>
            {t.medicalHistoryTitle}
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary, marginBottom: 12 }}>
            {t.historySubtitle}
          </Text>
          <View className="flex-row flex-wrap" style={{ gap: 8 }}>
            {HISTORY_OPTIONS.map((opt) => {
              const selected = medicalHistory.includes(opt.code);
              return (
                <AnimatedPressable
                  key={opt.code}
                  onPress={() => toggleHistory(opt.code)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor: selected ? colors.primary : colors.surfaceContainer,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: 12,
                      color: selected ? "#FFFFFF" : colors.textSecondary,
                    }}
                  >
                    {t[opt.labelKey]}
                  </Text>
                </AnimatedPressable>
              );
            })}
          </View>
        </View>

        {/* Tensi darah - opsional */}
        <View className="p-4 mb-6" style={{ backgroundColor: colors.surface, borderRadius: 18 }}>
          <View className="flex-row items-center mb-3" style={{ gap: 6 }}>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.textPrimary }}>
              {t.bloodPressure}
            </Text>
            <View style={{ backgroundColor: colors.surfaceContainer, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 }}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: colors.textSecondary }}>{t.optional}</Text>
            </View>
          </View>
          <View className="flex-row" style={{ gap: 12 }}>
            <View className="flex-1">
              <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>
                {t.systolic}
              </Text>
              <TextInput
                className="bg-surface-container-low rounded-xl px-3 py-3"
                style={{ color: colors.textPrimary }}
                placeholder="120"
                keyboardType="number-pad"
                value={systolicBp}
                onChangeText={setSystolicBp}
                maxLength={3}
              />
            </View>
            <View className="flex-1">
              <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>
                {t.diastolic}
              </Text>
              <TextInput
                className="bg-surface-container-low rounded-xl px-3 py-3"
                style={{ color: colors.textPrimary }}
                placeholder="80"
                keyboardType="number-pad"
                value={diastolicBp}
                onChangeText={setDiastolicBp}
                maxLength={3}
              />
            </View>
          </View>
          {bpAtRisk && (
            <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.riskMedium, marginTop: 10 }}>
              {t.bpAtRiskPreview}
            </Text>
          )}
          {mapValue !== null && (
            <View className="mt-3 p-3" style={{ backgroundColor: colors.surfaceContainerLow, borderRadius: 12 }}>
              {/* Judul di baris sendiri, nilai + label di baris berikutnya (boleh wrap) supaya tidak kepotong di layar sempit. */}
              <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.textSecondary }}>{t.mapLabel}</Text>
              <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: mapAtRisk ? colors.riskMedium : colors.textPrimary, marginTop: 2, flexShrink: 1 }}>
                {mapValue} mmHg{mapAtRisk ? ` · ${t.mapAtRiskLabel}` : ""}
              </Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 10, color: colors.textSecondary, marginTop: 2 }}>
                {t.mapFormula}
              </Text>
              {mapAtRisk && (
                <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.riskMedium, marginTop: 6 }}>
                  {t.mapElevatedNote}
                </Text>
              )}
              {mapNotApplicable && (
                <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary, marginTop: 6 }}>
                  {t.mapNotApplicableNote}
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <View className="px-5 pb-4">
        <AnimatedPressable haptic onPress={handleSubmit} disabled={!allAnswered || isSubmitting}>
          <View
            style={{
              backgroundColor: allAnswered ? colors.primary : colors.outlineVariant,
              borderRadius: 999,
              paddingVertical: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: fonts.semibold, color: "#FFFFFF" }}>
              {allAnswered ? t.viewResult : t.answerMore.replace("{n}", String(visibleQuestions.length - answeredCount + (hasHistory ? 0 : 1)))}
            </Text>
          </View>
        </AnimatedPressable>
      </View>
    </SafeAreaView>
  );
}