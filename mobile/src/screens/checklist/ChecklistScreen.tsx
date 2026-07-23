import React, { useMemo, useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import apiClient from "../../api/client";
import { useTranslation } from "../../hooks/useTranslation";
import AppHeader from "@/components/AppHeader";

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
  const { t } = useTranslation();
  const today = useMemo(() => new Date(), []);
  const weekDates = useMemo(() => getWeekDates(today), [today]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [checklistData, setChecklistData] = useState<{
    items: { item_id: string; label: string; category: string | null; is_completed: boolean }[];
    summary: { total: number; completed: number; label: string };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkedByDate, setCheckedByDate] = useState<Record<string, Record<string, boolean>>>({});
  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  const dateKey = selectedDate.toISOString().split("T")[0];
  const isTodaySelected = isSameDay(selectedDate, today);

  const fetchChecklist = useCallback(async () => {
    setIsLoading(true);
    try {
      // API hanya support hari ini — hari lain pakai state lokal
      if (isTodaySelected) {
        const { data } = await apiClient.get("/checklist/today");
        setChecklistData(data);
        // Sync state lokal dengan data dari backend
        const backendChecked: Record<string, boolean> = {};
        data.items.forEach((item: any) => {
          backendChecked[item.item_id] = item.is_completed;
        });
        setCheckedByDate((prev) => ({ ...prev, [dateKey]: backendChecked }));
      }
    } catch (err) {
      console.warn("Gagal fetch checklist:", err);
    } finally {
      setIsLoading(false);
    }
  }, [dateKey, isTodaySelected]);

  useEffect(() => {
    fetchChecklist();
  }, [fetchChecklist]);
  const toggleItem = async (itemId: string) => {
    setCheckedByDate((prev) => ({
      ...prev,
      [dateKey]: { ...prev[dateKey], [itemId]: !prev[dateKey]?.[itemId] },
    }));

    // Hit API kalau hari ini
    if (isTodaySelected) {
      try {
        await apiClient.post(`/checklist/${itemId}/log`);
      } catch (err) {
        // Rollback kalau gagal
        console.warn("Gagal toggle checklist:", err);
        setCheckedByDate((prev) => ({
          ...prev,
          [dateKey]: { ...prev[dateKey], [itemId]: !prev[dateKey]?.[itemId] },
        }));
      }
    }
  };

  const currentChecked = checkedByDate[dateKey] ?? {};
  const items = checklistData?.items ?? [];
  const doneCount = items.length > 0 
    ? Object.values(currentChecked).filter(Boolean).length 
    : checklistData?.summary.completed ?? 0;
  const totalItems = items.length > 0 ? items.length : checklistData?.summary.total ?? 0;
  const progress = totalItems > 0 ? doneCount / totalItems : 0;
  
  return (
    <SafeAreaView className="flex-1 bg-background">
      <AppHeader title={t.checklistTitle} />

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
                  {t.days[(d.getDay() + 6) % 7]}
                </Text>
                <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: active ? "#FFFFFF" : colors.textPrimary, marginTop: 2 }}>
                  {d.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Checklist items */}
        {isLoading ? (
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
            const isDisabled = !isTodaySelected;
            return (
              <TouchableOpacity
                key={item.item_id}
                onPress={() => !isDisabled && toggleItem(item.item_id)}
                className="flex-row items-center mb-3 p-4"
                style={{ backgroundColor: colors.surface, borderRadius: 20, opacity: isDisabled ? 0.6 : 1 }}
                activeOpacity={isDisabled ? 1 : 0.7}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: "rgba(177,14,107,0.1)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="checkmark-done-outline" size={20} color={colors.primary} />
                </View>
                <Text style={{ fontFamily: fonts.medium, fontSize: 15, color: colors.textPrimary, flex: 1 }}>
                  {t.checklistItems[item.label] ?? item.label}
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
          })
        )}

        {/* Consistency progress */}
        <View className="p-4 mb-6" style={{ backgroundColor: colors.surface, borderRadius: 20 }}>
          <View className="flex-row justify-between items-center mb-2">
            <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.textPrimary }}>{isTodaySelected ? t.consistency : t.historyLabel}</Text>
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