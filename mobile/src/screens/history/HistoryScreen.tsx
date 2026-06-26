import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, riskCategoryStyle, RiskCategory } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

// TODO: ganti ke API Alek begitu endpoint riwayat assessment & checklist log ready.
const DUMMY_ASSESSMENT_HISTORY: { id: string; date: string; time: string; risk: RiskCategory; title: string; summary: string }[] = [
  { id: "1", date: "12 Okt 2023", time: "09:00", risk: "LOW", title: "Pemeriksaan Trimester 2", summary: "Tekanan darah normal. Perkembangan janin sesuai usia kehamilan. Tetap lanjutkan vitamin." },
  { id: "2", date: "28 Sep 2023", time: "14:30", risk: "MEDIUM", title: "Konsultasi Nutrisi", summary: "Kadar zat besi sedikit rendah. Disarankan menambah asupan bayam dan daging merah tanpa lemak." },
  { id: "3", date: "05 Sep 2023", time: "10:15", risk: "LOW", title: "Pemeriksaan Trimester 1 Akhir", summary: "Semua indikator vital sangat baik. Mual pagi hari mulai berkurang." },
];

const DUMMY_CHECKLIST_HISTORY: { id: string; date: string; doneCount: number; total: number }[] = [
  { id: "1", date: "25 Jun 2026", doneCount: 6, total: 6 },
  { id: "2", date: "24 Jun 2026", doneCount: 4, total: 6 },
  { id: "3", date: "23 Jun 2026", doneCount: 5, total: 6 },
];

export default function HistoryScreen() {
  const [tab, setTab] = useState<"assessment" | "checklist">("assessment");

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-center px-5 pt-2 pb-4" style={{ position: "relative" }}>
        <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.primary }}>Riwayat</Text>
        <View style={{ position: "absolute", right: 20, top: 4 }}>
          <Ionicons name="notifications-outline" size={20} color={colors.textSecondary} />
        </View>
      </View>

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
              Assessment
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
              Checklist
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
        {tab === "assessment" ? (
          <View>
            {DUMMY_ASSESSMENT_HISTORY.map((entry, idx) => {
              const risk = riskCategoryStyle[entry.risk];
              const isLast = idx === DUMMY_ASSESSMENT_HISTORY.length - 1;
              return (
                <View key={entry.id} className="flex-row" style={{ marginBottom: isLast ? 0 : 4 }}>
                  {/* Timeline dot + line */}
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

                  {/* Card */}
                  <View
                    className="flex-1 p-4 mb-4"
                    style={{ backgroundColor: colors.surface, borderRadius: 18, marginLeft: 8 }}
                  >
                    <View className="flex-row justify-between items-center mb-2">
                      <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary }}>
                        {entry.date}, {entry.time}
                      </Text>
                      <View
                        className="flex-row items-center px-2 py-1"
                        style={{ backgroundColor: risk.bg, borderRadius: 999, gap: 4 }}
                      >
                        <Ionicons name={entry.risk === "LOW" ? "checkmark-circle" : "information-circle"} size={13} color={risk.color} />
                        <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: risk.color }}>
                          {entry.risk === "LOW" ? "Low Risk" : entry.risk === "MEDIUM" ? "Medium Risk" : "High Risk"}
                        </Text>
                      </View>
                    </View>
                    <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.textPrimary, marginBottom: 4 }}>
                      {entry.title}
                    </Text>
                    <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, lineHeight: 17 }}>
                      {entry.summary}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View>
            {DUMMY_CHECKLIST_HISTORY.map((entry) => {
              const ratio = entry.doneCount / entry.total;
              return (
                <View
                  key={entry.id}
                  className="flex-row items-center justify-between p-4 mb-3"
                  style={{ backgroundColor: colors.surface, borderRadius: 18 }}
                >
                  <View className="flex-row items-center" style={{ gap: 12 }}>
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        borderWidth: 3,
                        borderColor: ratio === 1 ? colors.riskLow : colors.primary,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: colors.textPrimary }}>
                        {entry.doneCount}/{entry.total}
                      </Text>
                    </View>
                    <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.textPrimary }}>{entry.date}</Text>
                  </View>
                  {ratio === 1 && <Ionicons name="star" size={18} color="#F5B700" />}
                </View>
              );
            })}
          </View>
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}