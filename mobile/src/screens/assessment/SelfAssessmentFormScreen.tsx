import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { MOCK_QUESTIONS, mockCalculateRisk } from "./mockAssessmentData";

export default function SelfAssessmentFormScreen({ navigation }: any) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [systolicBp, setSystolicBp] = useState("");
  const [diastolicBp, setDiastolicBp] = useState("");

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === MOCK_QUESTIONS.length;

  const setAnswer = (id: string, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    // TODO: ganti jadi POST /assessment/submit begitu endpoint Alek ready.
    // Payload yang dikirim nanti: { answers: [{question_id, answer}], systolic_bp, diastolic_bp }
    const result = mockCalculateRisk(
      answers,
      systolicBp ? Number(systolicBp) : null,
      diastolicBp ? Number(diastolicBp) : null
    );
    navigation.navigate("SelfAssessmentResult", { result });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-2 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.textPrimary }}>
            Self-Assessment Risiko
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary }}>
            Jawab pertanyaan berikut berdasarkan kondisi Anda hari ini
          </Text>
        </View>
      </View>

      {/* Progress dots */}
      <View className="flex-row px-5 mb-4" style={{ gap: 4 }}>
        {MOCK_QUESTIONS.map((q) => (
          <View
            key={q.id}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: answers[q.id] !== undefined ? colors.primary : colors.surfaceContainer,
            }}
          />
        ))}
      </View>

      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
        {MOCK_QUESTIONS.map((q) => (
          <View
            key={q.id}
            className="flex-row items-center justify-between p-4 mb-3"
            style={{ backgroundColor: colors.surface, borderRadius: 18 }}
          >
            <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.textPrimary, flex: 1, marginRight: 12 }}>
              {q.question_text}
            </Text>
            <View className="flex-row" style={{ backgroundColor: colors.surfaceContainer, borderRadius: 999, padding: 3 }}>
              <TouchableOpacity
                onPress={() => setAnswer(q.id, true)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: answers[q.id] === true ? colors.primary : "transparent",
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.semibold,
                    fontSize: 12,
                    color: answers[q.id] === true ? "#FFFFFF" : colors.textSecondary,
                  }}
                >
                  Ya
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAnswer(q.id, false)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: answers[q.id] === false ? colors.primary : "transparent",
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.semibold,
                    fontSize: 12,
                    color: answers[q.id] === false ? "#FFFFFF" : colors.textSecondary,
                  }}
                >
                  Tidak
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Tensi darah - opsional */}
        <View className="p-4 mb-6" style={{ backgroundColor: colors.surface, borderRadius: 18 }}>
          <View className="flex-row items-center mb-3" style={{ gap: 6 }}>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.textPrimary }}>
              Tensi Darah
            </Text>
            <View style={{ backgroundColor: colors.surfaceContainer, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 }}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: colors.textSecondary }}>Opsional</Text>
            </View>
          </View>
          <View className="flex-row" style={{ gap: 12 }}>
            <View className="flex-1">
              <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>
                Sistol
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
                Diastol
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
        <TouchableOpacity onPress={handleSubmit} activeOpacity={0.85} disabled={!allAnswered}>
          <View
            style={{
              backgroundColor: allAnswered ? colors.primary : colors.outlineVariant,
              borderRadius: 999,
              paddingVertical: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: fonts.semibold, color: "#FFFFFF" }}>
              {allAnswered ? "Lihat Hasil" : `Jawab ${MOCK_QUESTIONS.length - answeredCount} pertanyaan lagi`}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}