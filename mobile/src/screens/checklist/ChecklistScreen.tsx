import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

// TODO: ganti ke API Alek begitu endpoint checklist items + daily log ready.
const CHECKLIST_ITEMS = [
  { id: "1", label: "Tablet tambah darah", icon: "medical" as const, color: colors.primary, bg: "rgba(177,14,107,0.1)" },
  { id: "2", label: "Minum air 8 gelas", icon: "water" as const, color: colors.secondary, bg: "rgba(113,42,226,0.1)" },
  { id: "3", label: "Makanan sumber protein", icon: "egg" as const, color: colors.riskLow, bg: colors.riskLowBg },
  { id: "4", label: "Sayur & buah", icon: "leaf" as const, color: colors.riskLow, bg: colors.riskLowBg },
  { id: "5", label: "Susu/kalsium", icon: "cafe" as const, color: colors.primary, bg: "rgba(177,14,107,0.1)" },
  { id: "6", label: "Istirahat cukup", icon: "moon" as const, color: colors.secondary, bg: "rgba(113,42,226,0.1)" },
];

const DAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

function getWeekDates(centerDate: Date) {
  // Senin sebagai awal minggu
  const dayIndex = (centerDate.getDay() + 6) % 7; // 0=Senin
  const monday = new Date(centerDate);
  monday.setDate(centerDate.getDate() - dayIndex);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function ChecklistScreen() {
  const today = useMemo(() => new Date(), []);
  const weekDates = useMemo(() => getWeekDates(today), [today]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const doneCount = Object.values(checked).filter(Boolean).length;
  const progress = doneCount / CHECKLIST_ITEMS.length;

  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-center px-5 pt-2 pb-4" style={{ position: "relative" }}>
        <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.primary }}>Checklist Harian</Text>
        <View style={{ position: "absolute", right: 20, top: 4 }}>
          <Ionicons name="notifications-outline" size={20} color={colors.textSecondary} />
        </View>
      </View>

      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
        {/* Week strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, marginBottom: 20 }}>
          {weekDates.map((d) => {
            const active = isSameDay(d, selectedDate);
            return (
              <TouchableOpacity
                key={d.toISOString()}
                onPress={() => setSelectedDate(d)}
                style={{
                  width: 56,
                  paddingVertical: 10,
                  borderRadius: 16,
                  alignItems: "center",
                  backgroundColor: active ? colors.primary : colors.surface,
                }}
              >
                <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: active ? "#FFFFFF" : colors.textSecondary }}>
                  {DAY_LABELS[(d.getDay() + 6) % 7]}
                </Text>
                <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: active ? "#FFFFFF" : colors.textPrimary, marginTop: 2 }}>
                  {d.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Checklist items */}
        {CHECKLIST_ITEMS.map((item) => {
          const isChecked = !!checked[item.id];
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggleItem(item.id)}
              className="flex-row items-center mb-3 p-4"
              style={{ backgroundColor: colors.surface, borderRadius: 20 }}
              activeOpacity={0.7}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: item.bg,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={{ fontFamily: fonts.medium, fontSize: 15, color: colors.textPrimary, flex: 1 }}>
                {item.label}
              </Text>
              <View
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  borderWidth: isChecked ? 0 : 1.5,
                  borderColor: colors.outlineVariant,
                  backgroundColor: isChecked ? colors.primary : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isChecked && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Consistency progress */}
        <View className="p-4 mb-6" style={{ backgroundColor: colors.surface, borderRadius: 20 }}>
          <View className="flex-row justify-between items-center mb-2">
            <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.textPrimary }}>Konsistensi hari ini</Text>
            <Ionicons name="star" size={18} color={progress === 1 ? "#F5B700" : colors.outlineVariant} />
          </View>
          <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.surfaceContainer, overflow: "hidden", marginBottom: 6 }}>
            <View style={{ height: "100%", width: `${progress * 100}%`, backgroundColor: colors.primary, borderRadius: 4 }} />
          </View>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, textAlign: "right" }}>
            {doneCount}/{CHECKLIST_ITEMS.length} Selesai
          </Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}