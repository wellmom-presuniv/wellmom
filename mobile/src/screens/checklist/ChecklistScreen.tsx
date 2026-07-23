import React, { useMemo, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { useTranslation } from "../../hooks/useTranslation";
import AppHeader from "@/components/AppHeader";
import { useChecklistStore } from "../../store/useChecklistStore";

function getWeekDates(centerDate: Date) {
  const dayIndex = (centerDate.getDay() + 6) % 7;
  const monday = new Date(centerDate);
  monday.setDate(centerDate.getDate() - dayIndex);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

// Pakai sv-SE locale untuk format YYYY-MM-DD yang konsisten dengan timezone lokal
function toLocalDateKey(d: Date): string {
  return d.toLocaleDateString("sv-SE");
}

export default function ChecklistScreen() {
  const { t } = useTranslation();
  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => toLocalDateKey(today), [today]);
  const weekDates = useMemo(() => getWeekDates(today), [today]);
  const [selectedDate, setSelectedDate] = useState(today);

  const { items, checkedByDate, initialized, isLoading, load, toggle } = useChecklistStore();

  // Load hanya sekali — store handle deduplication
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const dateKey = toLocalDateKey(selectedDate);
  const isTodaySelected = dateKey === todayKey;
  const currentChecked = checkedByDate[dateKey] ?? {};
  const doneCount = Object.values(currentChecked).filter(Boolean).length;
  const totalItems = items.length;
  const progress = totalItems > 0 ? doneCount / totalItems : 0;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <AppHeader title={t.checklistTitle} />
      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>

        {/* Week strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, marginBottom: 20 }}>
          {weekDates.map((d) => {
            const dKey = toLocalDateKey(d);
            const active = dKey === dateKey;
            const future = dKey > todayKey;
            return (
              <TouchableOpacity
                key={d.toISOString()}
                onPress={() => !future && setSelectedDate(d)}
                activeOpacity={future ? 1 : 0.7}
                style={{
                  width: 56,
                  paddingVertical: 10,
                  borderRadius: 16,
                  alignItems: "center",
                  backgroundColor: active ? colors.primary : colors.surface,
                  opacity: future ? 0.4 : 1,
                }}
              >
                <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: active ? "#FFFFFF" : colors.textSecondary }}>
                  {t.days[(d.getDay() + 6) % 7]}
                </Text>
                <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: active ? "#FFFFFF" : colors.textPrimary, marginTop: 2 }}>
                  {d.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Items */}
        {isLoading && !initialized ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
        ) : items.length === 0 ? (
          <View className="items-center py-8">
            <Ionicons name="checkbox-outline" size={40} color={colors.outlineVariant} />
            <Text style={{ fontFamily: fonts.regular, color: colors.textSecondary, marginTop: 12, textAlign: "center" }}>
              {t.noChecklist}
            </Text>
          </View>
        ) : (
          items.map((item) => {
            const isChecked = !!currentChecked[item.item_id];
            return (
              <TouchableOpacity
                key={item.item_id}
                onPress={() => toggle(item.item_id, dateKey, todayKey)}
                className="flex-row items-center mb-3 p-4"
                style={{ backgroundColor: colors.surface, borderRadius: 20 }}
                activeOpacity={0.7}
              >
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(177,14,107,0.1)", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                  <Ionicons name="checkmark-done-outline" size={20} color={colors.primary} />
                </View>
                <Text style={{ fontFamily: fonts.medium, fontSize: 15, color: colors.textPrimary, flex: 1 }}>
                  {t.checklistItems[item.label] ?? item.label}
                </Text>
                <View style={{ width: 26, height: 26, borderRadius: 13, borderWidth: isChecked ? 0 : 1.5, borderColor: colors.outlineVariant, backgroundColor: isChecked ? colors.primary : "transparent", alignItems: "center", justifyContent: "center" }}>
                  {isChecked && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
            );
          })
        )}

        {/* Progress */}
        <View className="p-4 mb-6" style={{ backgroundColor: colors.surface, borderRadius: 20 }}>
          <View className="flex-row justify-between items-center mb-2">
            <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.textPrimary }}>
              {isTodaySelected ? t.consistency : t.historyLabel}
            </Text>
            <Ionicons name="star" size={18} color={progress === 1 ? "#F5B700" : colors.outlineVariant} />
          </View>
          <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.surfaceContainer, overflow: "hidden", marginBottom: 6 }}>
            <View style={{ height: "100%", width: `${progress * 100}%`, backgroundColor: colors.primary, borderRadius: 4 }} />
          </View>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, textAlign: "right" }}>
            {t.done.replace("{done}", String(doneCount)).replace("{total}", String(totalItems))}
          </Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}