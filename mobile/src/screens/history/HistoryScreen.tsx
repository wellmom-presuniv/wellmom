import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors, riskCategoryStyle, RiskCategory } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { getAssessmentHistory } from "../../api/assessmentService";
import { getChecklistHistory } from "../../api/checklistService";
import type { AssessmentResult, ChecklistHistoryDay } from "../../types";
import { useTranslation } from "../../hooks/useTranslation";
import AppHeader from "@/components/AppHeader";

export default function HistoryScreen() {
  const { t, language } = useTranslation();
  const [tab, setTab] = useState<"assessment" | "checklist">("assessment");
  const [history, setHistory] = useState<AssessmentResult[]>([]);
  const [checklistHistory, setChecklistHistory] = useState<ChecklistHistoryDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();
  const notificationMessage = tab === "checklist" ? t.notificationHistoryChecklist : t.notificationHistoryAssessment;

  useEffect(() => {
    if (!isFocused) return;

    setIsLoading(true);
    if (tab === "assessment") {
      getAssessmentHistory()
        .then(setHistory)
        .catch((err) => console.warn("Gagal fetch history:", err))
        .finally(() => setIsLoading(false));
    } else {
      getChecklistHistory()
        .then(setChecklistHistory)
        .catch((err) => console.warn("Gagal fetch checklist history:", err))
        .finally(() => setIsLoading(false));
    }
  }, [tab, isFocused]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <AppHeader title={t.historyTitle} notificationMessage={notificationMessage} />
      <View className="px-5">
        {/* Segmented control */}
        <View
          className="flex-row p-1 mb-5"
          style={{ backgroundColor: colors.surfaceContainer, borderRadius: 999 }}
        >
          <TouchableOpacity
            onPress={() => setTab("assessment")}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 999,
              alignItems: "center",
              backgroundColor: tab === "assessment" ? colors.primary : "transparent",
            }}
          >
            <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: tab === "assessment" ? "#FFFFFF" : colors.textSecondary }}>
              {t.tabAssessment}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab("checklist")}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 999,
              alignItems: "center",
              backgroundColor: tab === "checklist" ? colors.primary : "transparent",
            }}
          >
            <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: tab === "checklist" ? "#FFFFFF" : colors.textSecondary }}>
              {t.tabChecklist}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
              {tab === "assessment" ? (
        <View>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 32 }} />
          ) : history.length === 0 ? (
            <Text style={{ fontFamily: fonts.regular, color: colors.textSecondary, textAlign: "center", marginTop: 32 }}>
              {t.noHistory}
            </Text>
          ) : (
            history.map((entry, idx) => {
              const risk = riskCategoryStyle[entry.risk_category];
              const isLast = idx === history.length - 1;
              return (
                <View key={entry.response_id} className="flex-row" style={{ marginBottom: isLast ? 0 : 4 }}>
                  <View style={{ width: 24, alignItems: "center" }}>
                    <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: idx === 0 ? colors.primary : colors.primaryContainer, opacity: idx === 0 ? 1 : 0.4, marginTop: 6 }} />
                    {!isLast && <View style={{ width: 2, flex: 1, backgroundColor: colors.outlineVariant, marginVertical: 2 }} />}
                  </View>
                  <View className="flex-1 p-4 mb-4" style={{ backgroundColor: colors.surface, borderRadius: 18, marginLeft: 8 }}>
                    <View className="flex-row justify-between items-center mb-2">
                      <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary }}>
                        {entry.date}
                      </Text>
                      <View className="flex-row items-center px-2 py-1" style={{ backgroundColor: risk.bg, borderRadius: 999, gap: 4 }}>
                        <Ionicons name={entry.risk_category === "LOW" ? "checkmark-circle" : "information-circle"} size={13} color={risk.color} />
                        <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: risk.color }}>
                          {entry.risk_category === "LOW" ? t.riskLow : entry.risk_category === "MEDIUM" ? t.riskMedium : t.riskHigh}
                        </Text>
                      </View>
                    </View>
                    {entry.red_flag_triggered && entry.triggered_red_flags.length > 0 && (
                      <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.riskHigh, marginBottom: 4 }}>
                        ⚠️ {entry.triggered_red_flags.map(f => t.redFlags[f.question_text] ?? f.question_text).join(", ")}
                      </Text>
                    )}
                    {entry.duration_triggered_symptoms && entry.duration_triggered_symptoms.length > 0 && (
                      <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.riskMedium, marginBottom: 4 }}>
                        🕐 {entry.duration_triggered_symptoms.map(d => {
                          const label = d.symptom === "BLEEDING" ? t.symptomBleeding : d.symptom === "BLURRED_VISION" ? t.symptomBlurredVision : t.symptomFever;
                          return `${label} (${d.days_active} ${t.daysLabel})`;
                        }).join(", ")}
                      </Text>
                    )}
                    <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary }}>
                      {t.scoreLabel
                        .replace("{score}", String(entry.total_score ?? "—"))
                        .replace("{bp}", entry.bp_category ?? t.bpNotFilled)}

                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      ) : (
        <View>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 32 }} />
          ) : checklistHistory.length === 0 ? (
            <Text style={{ fontFamily: fonts.regular, color: colors.textSecondary, textAlign: "center", marginTop: 32 }}>
              {t.noChecklistHistory}
            </Text>
          ) : (
            checklistHistory.map((entry, idx) => {
              const isLast = idx === checklistHistory.length - 1;
              return (
                <View key={entry.date} className="flex-row" style={{ marginBottom: isLast ? 0 : 4 }}>
                  <View style={{ width: 24, alignItems: "center" }}>
                    <View
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 7,
                        backgroundColor: idx === 0 ? colors.primary : colors.primaryContainer,
                        opacity: idx === 0 ? 1 : 0.4,
                        marginTop: 6,
                      }}
                    />
                    {!isLast && <View style={{ width: 2, flex: 1, backgroundColor: colors.outlineVariant, marginVertical: 2 }} />}
                  </View>
                  <View className="flex-1 p-4 mb-4" style={{ backgroundColor: colors.surface, borderRadius: 18, marginLeft: 8 }}>
                    <View className="flex-row justify-between items-center mb-2">
                      <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary }}>
                        {entry.date}
                      </Text>
                      <View
                        style={{
                          backgroundColor: colors.primaryContainer,
                          borderRadius: 999,
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Ionicons name="checkmark-circle" size={13} color={colors.background} />
                        <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: colors.background, marginLeft: 4 }}>
                          {t.done.replace("{done}", String(entry.summary.completed)).replace("{total}", String(entry.summary.total))}
                        </Text>
                      </View>
                    </View>
                    <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary }}>
                      {t.done.replace("{done}", String(entry.summary.completed)).replace("{total}", String(entry.summary.total))}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}