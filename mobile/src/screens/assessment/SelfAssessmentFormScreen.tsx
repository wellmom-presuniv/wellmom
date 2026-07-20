import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { getAssessmentQuestions, submitAssessment, getTodayAssessment } from "../../api/assessmentService";
import { AssessmentQuestion } from "../../types";
import { useTranslation } from "../../hooks/useTranslation";

export default function SelfAssessmentFormScreen({ navigation }: any) {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [systolicBp, setSystolicBp] = useState("");
  const [diastolicBp, setDiastolicBp] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  useEffect(() => {
    const init = async () => {
      try {
        // Cek dulu apakah sudah submit hari ini
        const todayResult = await getTodayAssessment();
        if (todayResult) {
          // Udah submit hari ini — langsung ke hasil, skip form
          navigation.replace("SelfAssessmentResult", { result: todayResult });
          return;
        }
        // Belum submit — fetch pertanyaan dari API
        const q = await getAssessmentQuestions();
        setQuestions(q);
      } catch (err) {
        // Kalau API gagal, fallback ke MOCK_QUESTIONS yang udah ada
        console.warn("Gagal fetch pertanyaan dari API:", err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const setAnswer = (id: string, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        answers: Object.entries(answers).map(([question_id, answer]) => ({ question_id, answer })),
        systolic_bp: systolicBp ? Number(systolicBp) : null,
        diastolic_bp: diastolicBp ? Number(diastolicBp) : null,
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
        {questions.map((q) => (
          <View
            key={q.question_id}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: answers[q.question_id] !== undefined ? colors.primary : colors.surfaceContainer,
            }}
          />
        ))}
      </View>

      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
        {questions.map((q) => (
          <View
            key={q.question_id}
            className="flex-row items-center justify-between p-4 mb-3"
            style={{ backgroundColor: colors.surface, borderRadius: 18 }}
          >
            <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.textPrimary, flex: 1, marginRight: 12 }}>
              {t.questions[q.order_index] ?? q.question_text}
            </Text>
            <View className="flex-row" style={{ backgroundColor: colors.surfaceContainer, borderRadius: 999, padding: 3 }}>
              <TouchableOpacity
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
              </TouchableOpacity>
              <TouchableOpacity
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
              </TouchableOpacity>
            </View>
          </View>
        ))}

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
        </View>
      </ScrollView>

      <View className="px-5 pb-4">
        <TouchableOpacity onPress={handleSubmit} activeOpacity={0.85} disabled={!allAnswered || isSubmitting}>
          <View
            style={{
              backgroundColor: allAnswered ? colors.primary : colors.outlineVariant,
              borderRadius: 999,
              paddingVertical: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: fonts.semibold, color: "#FFFFFF" }}>
              {allAnswered ? t.viewResult : t.answerMore.replace("{n}", String(questions.length - answeredCount))}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}