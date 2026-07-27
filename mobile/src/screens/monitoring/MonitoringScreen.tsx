import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { SlideInLeft, SlideInRight, SlideOutLeft, SlideOutRight, FadeOut, LinearTransition } from "react-native-reanimated";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { useTranslation } from "../../hooks/useTranslation";
import AppHeader from "../../components/AppHeader";
import AnimatedPressable from "@/components/AnimatedPressable";
import BouncingIcon from "@/components/BouncingIcon";
import { getMyProfile } from "../../api/profileService";
import { PregnancyProfile } from "../../types";
import {
  logFetalWeight,
  logHeadCircumference,
  logMaternal,
  evaluateGrowth,
  getMonitoringHistory,
  deleteMonitoringRecord,
} from "../../api/monitoringService";
import {
  FetalWeightLogResponse,
  GrowthEvaluateResponse,
  MonitoringHistoryEntry,
  MonitoringHistoryType,
} from "../../types/monitoring";
import {
  getLocalMonitoringHistory,
  removeLocalMonitoringEntry,
  isLocalMonitoringId,
} from "../../services/monitoringLocalStore";

// "SAVED" = tersimpan tapi belum dievaluasi (trimester 1/2) — bukan status dari backend.
type FetalResultDisplay = Omit<FetalWeightLogResponse, "status"> & {
  status: NonNullable<FetalWeightLogResponse["status"]> | "SAVED";
};

type MonitoringTab = "janin" | "bayi";
type BayiIndicator = "WEIGHT" | "LENGTH" | "HEAD_CIRCUMFERENCE";
type BayiSex = "MALE" | "FEMALE";

// ===== History list — dipakai bersama di semua section (fetal, head circ, maternal, growth) =====
interface HistoryRow {
  id: string;
  date: string;
  valueLabel: string;
  badgeText?: string;
  badgeColor?: string;
  badgeBg?: string;
}

function HistorySection({
  title,
  isLoading,
  rows,
  onDelete,
  deletingIds,
}: {
  title: string;
  isLoading: boolean;
  rows: HistoryRow[];
  onDelete: (id: string) => void;
  deletingIds: Set<string>;
}) {
  const { t } = useTranslation();
  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.textPrimary }}>{title}</Text>
        {rows.length > 0 && (
          <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary }}>{t.lastRecords}</Text>
        )}
      </View>
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 12 }} />
      ) : rows.length === 0 ? (
        <View className="items-center py-4" style={{ backgroundColor: colors.surfaceContainerLow, borderRadius: 14 }}>
          <BouncingIcon name="time-outline" size={22} color={colors.outlineVariant} />
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, marginTop: 6 }}>
            {t.historyEmpty}
          </Text>
        </View>
      ) : (
        rows.map((row, idx) => {
          const isLast = idx === rows.length - 1;
          const isDeleting = deletingIds.has(row.id);
          return (
            <Animated.View
              key={row.id}
              exiting={FadeOut.duration(200)}
              layout={LinearTransition.duration(200)}
              className="flex-row"
              style={{ marginBottom: isLast ? 0 : 2 }}
            >
              <View style={{ width: 18, alignItems: "center" }}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: idx === 0 ? colors.primary : colors.primaryContainer,
                    opacity: idx === 0 ? 1 : 0.4,
                    marginTop: 8,
                  }}
                />
                {!isLast && <View style={{ width: 1.5, flex: 1, backgroundColor: colors.outlineVariant, marginVertical: 2 }} />}
              </View>
              <View
                className="flex-1 flex-row items-center justify-between px-3 py-2 mb-2"
                style={{ backgroundColor: colors.surfaceContainerLow, borderRadius: 12, marginLeft: 4, opacity: isDeleting ? 0.5 : 1 }}
              >
                <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary }}>{row.date}</Text>
                <View className="flex-row items-center" style={{ gap: 6 }}>
                  <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: colors.textPrimary }}>
                    {row.valueLabel}
                  </Text>
                  {row.badgeText && (
                    <View
                      style={{
                        backgroundColor: row.badgeBg ?? colors.surfaceContainer,
                        borderRadius: 999,
                        paddingHorizontal: 7,
                        paddingVertical: 2,
                      }}
                    >
                      <Text style={{ fontFamily: fonts.semibold, fontSize: 10, color: row.badgeColor ?? colors.textSecondary }}>
                        {row.badgeText}
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={() => onDelete(row.id)}
                    disabled={isDeleting}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={{ marginLeft: 2 }}
                  >
                    {isDeleting ? (
                      <ActivityIndicator size="small" color={colors.textSecondary} />
                    ) : (
                      <Ionicons name="trash-outline" size={14} color={colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          );
        })
      )}
    </View>
  );
}

export default function MonitoringScreen() {
  const { t, language } = useTranslation();
  const [tab, setTab] = useState<MonitoringTab>("janin");
  const [profile, setProfile] = useState<PregnancyProfile | null>(null);

  useEffect(() => {
    getMyProfile()
      .then(setProfile)
      .catch((err) => console.warn("Gagal ambil profil:", err));
  }, []);

  const formatDate = useCallback(
    (iso: string) => {
      try {
        return new Date(iso).toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      } catch {
        return iso;
      }
    },
    [language]
  );

  // ===== Section 1: Berat Janin =====
  const [fetalWeight, setFetalWeight] = useState("");
  const [fetalResult, setFetalResult] = useState<FetalResultDisplay | null>(null);
  const [isCheckingFetal, setIsCheckingFetal] = useState(false);
  const [fetalError, setFetalError] = useState<string | null>(null);
  const [fetalHistory, setFetalHistory] = useState<MonitoringHistoryEntry[]>([]);
  const [isFetalHistoryLoading, setIsFetalHistoryLoading] = useState(true);

  // ===== Section 2: Lingkar Kepala Janin =====
  const [headCirc, setHeadCirc] = useState("");
  const [isSavingHeadCirc, setIsSavingHeadCirc] = useState(false);
  const [headCircError, setHeadCircError] = useState<string | null>(null);
  const [headCircSaved, setHeadCircSaved] = useState(false);
  const [headCircHistory, setHeadCircHistory] = useState<MonitoringHistoryEntry[]>([]);
  const [isHeadCircHistoryLoading, setIsHeadCircHistoryLoading] = useState(true);

  // ===== Section 3: BB & TB Ibu =====
  const [maternalWeight, setMaternalWeight] = useState("");
  const [maternalHeight, setMaternalHeight] = useState("");
  const [isSavingMaternal, setIsSavingMaternal] = useState(false);
  const [maternalError, setMaternalError] = useState<string | null>(null);
  const [maternalSaved, setMaternalSaved] = useState(false);
  const [maternalHistory, setMaternalHistory] = useState<MonitoringHistoryEntry[]>([]);
  const [isMaternalHistoryLoading, setIsMaternalHistoryLoading] = useState(true);

  // ===== Tab Bayi: evaluasi pertumbuhan =====
  const [indicator, setIndicator] = useState<BayiIndicator>("WEIGHT");
  const [value, setValue] = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [sex, setSex] = useState<BayiSex>("FEMALE");
  const [growthResult, setGrowthResult] = useState<GrowthEvaluateResponse | null>(null);
  const [isCheckingGrowth, setIsCheckingGrowth] = useState(false);
  const [growthError, setGrowthError] = useState<string | null>(null);
  const [growthHistory, setGrowthHistory] = useState<MonitoringHistoryEntry[]>([]);
  const [isGrowthHistoryLoading, setIsGrowthHistoryLoading] = useState(true);

  const fetchHistory = useCallback(async (type: MonitoringHistoryType) => {
    const local = await getLocalMonitoringHistory(type);
    try {
      const server = await getMonitoringHistory(type);
      const merged = [...local, ...server].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
      return merged.slice(0, 3);
    } catch (err) {
      console.warn(`Gagal fetch history ${type}:`, err);
      return local.slice(0, 3);
    }
  }, []);

  const refreshFetalHistory = useCallback(async () => {
    setIsFetalHistoryLoading(true);
    setFetalHistory(await fetchHistory("FETAL_WEIGHT"));
    setIsFetalHistoryLoading(false);
  }, [fetchHistory]);

  const refreshHeadCircHistory = useCallback(async () => {
    setIsHeadCircHistoryLoading(true);
    setHeadCircHistory(await fetchHistory("HEAD_CIRC"));
    setIsHeadCircHistoryLoading(false);
  }, [fetchHistory]);

  const refreshMaternalHistory = useCallback(async () => {
    setIsMaternalHistoryLoading(true);
    setMaternalHistory(await fetchHistory("MATERNAL"));
    setIsMaternalHistoryLoading(false);
  }, [fetchHistory]);

  const refreshGrowthHistory = useCallback(async () => {
    setIsGrowthHistoryLoading(true);
    setGrowthHistory(await fetchHistory("GROWTH"));
    setIsGrowthHistoryLoading(false);
  }, [fetchHistory]);

  const refreshHistoryByType: Record<MonitoringHistoryType, () => Promise<void>> = {
    FETAL_WEIGHT: refreshFetalHistory,
    HEAD_CIRC: refreshHeadCircHistory,
    MATERNAL: refreshMaternalHistory,
    GROWTH: refreshGrowthHistory,
  };

  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const handleDeleteHistoryEntry = useCallback(
    (type: MonitoringHistoryType, id: string) => {
      Alert.alert(t.deleteHistoryConfirmTitle, t.deleteHistoryConfirmMessage, [
        { text: t.cancel, style: "cancel" },
        {
          text: t.delete,
          style: "destructive",
          onPress: async () => {
            setDeletingIds((prev) => new Set(prev).add(id));
            try {
              if (isLocalMonitoringId(id)) {
                await removeLocalMonitoringEntry(type, id);
              } else {
                await deleteMonitoringRecord(id);
              }
              await refreshHistoryByType[type]();
            } catch (err) {
              console.warn("Gagal hapus riwayat monitoring:", err);
              Alert.alert(t.deleteHistoryFailedTitle, t.deleteHistoryFailedMessage);
            } finally {
              setDeletingIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
              });
            }
          },
        },
      ]);
    },
    [t, refreshFetalHistory, refreshHeadCircHistory, refreshMaternalHistory, refreshGrowthHistory]
  );

  useEffect(() => {
    refreshFetalHistory();
    refreshHeadCircHistory();
    refreshMaternalHistory();
    refreshGrowthHistory();
  }, [refreshFetalHistory, refreshHeadCircHistory, refreshMaternalHistory, refreshGrowthHistory]);

  // TB ibu biasanya tetap — prefill dari entry terakhir kalau ada & user belum ngetik apa-apa
  useEffect(() => {
    if (maternalHistory.length > 0 && !maternalHeight) {
      setMaternalHeight(String(maternalHistory[0].maternal_height_cm ?? ""));
    }
  }, [maternalHistory]);

  const handleCheckFetal = async () => {
    if (!fetalWeight) return;
    setIsCheckingFetal(true);
    setFetalResult(null);
    setFetalError(null);
    try {
      const grams = Math.round(parseFloat(fetalWeight) * 1000);
      // Backend (PR #25, origin/feature/backend-monitoring-persistence) udah di-merge —
      // fetal-weight/log sekarang terima semua trimester. T1/T2 balik status/message: null.
      const result = await logFetalWeight(grams);
      if (!result.status) {
        setFetalResult({ ...result, status: "SAVED", message: t.monitoringSavedNoEval });
      } else {
        setFetalResult(result as FetalResultDisplay);
      }
      refreshFetalHistory();
    } catch (err: any) {
      console.warn("Gagal cek berat janin:", err);
      setFetalError(err?.response?.data?.detail ?? t.errorNetwork);
    } finally {
      setIsCheckingFetal(false);
    }
  };

  const handleSaveHeadCirc = async () => {
    if (!headCirc) return;
    setIsSavingHeadCirc(true);
    setHeadCircError(null);
    setHeadCircSaved(false);
    try {
      // Sama kayak fetal-weight — head-circumference/log udah terima semua trimester juga.
      await logHeadCircumference(parseFloat(headCirc));
      setHeadCircSaved(true);
      setHeadCirc("");
      refreshHeadCircHistory();
    } catch (err: any) {
      console.warn("Gagal simpan lingkar kepala:", err);
      setHeadCircError(err?.response?.data?.detail ?? t.errorNetwork);
    } finally {
      setIsSavingHeadCirc(false);
    }
  };

  const handleSaveMaternal = async () => {
    if (!maternalWeight || !maternalHeight) return;
    setIsSavingMaternal(true);
    setMaternalError(null);
    setMaternalSaved(false);
    try {
      const weightKg = parseFloat(maternalWeight);
      const heightCm = parseFloat(maternalHeight);
      // Backend udah buka maternal/log buat semua trimester (log_maternal_measurement
      // sekarang pakai _require_pregnancy_profile) — gak perlu local-storage fallback lagi.
      await logMaternal(weightKg, heightCm);
      setMaternalSaved(true);
      setMaternalWeight("");
      refreshMaternalHistory();
    } catch (err) {
      console.warn("Gagal simpan data ibu:", err);
      setMaternalError(t.errorNetwork);
    } finally {
      setIsSavingMaternal(false);
    }
  };

  const handleCheckGrowth = async () => {
    if (!value || !ageMonths) return;
    setIsCheckingGrowth(true);
    setGrowthResult(null);
    setGrowthError(null);
    try {
      const result = await evaluateGrowth({
        indicator,
        value: parseFloat(value),
        age_months: parseInt(ageMonths, 10),
        sex,
      });
      setGrowthResult(result);
      refreshGrowthHistory();
    } catch (err) {
      console.warn("Gagal cek pertumbuhan:", err);
      setGrowthError(t.errorNetwork);
    } finally {
      setIsCheckingGrowth(false);
    }
  };

  const getStatusStyle = (status: string) => {
    if (status === "NORMAL") return { color: colors.riskLow, bg: colors.riskLowBg, icon: "checkmark-circle" as const, messageColor: colors.textSecondary };
    if (status === "ABOVE_NORMAL") return { color: "#F59E0B", bg: "rgba(245,158,11,0.1)", icon: "warning" as const, messageColor: colors.textSecondary };
    // Bg-nya (primaryContainer) itu saturated pink, bukan tint tipis kayak riskLowBg/riskHighBg —
    // jadi teks/icon warna primary bakal nabrak warnanya. Pake warna background (putih) biar kontras.
    if (status === "SAVED") return { color: colors.background, bg: colors.primaryContainer, icon: "checkmark-circle-outline" as const, messageColor: colors.background };
    return { color: colors.riskHigh, bg: colors.riskHighBg, icon: "alert-circle" as const, messageColor: colors.textSecondary };
  };

  const getStatusLabel = (status: string) =>
    status === "NORMAL" ? t.normalResult
      : status === "BELOW_NORMAL" ? t.belowNormal
      : status === "ABOVE_NORMAL" ? t.aboveNormal
      : t.monitoringSaved;

  const getZoneStyle = (zone: "NORMAL" | "CONCERN" | "SEVERE") => {
    if (zone === "NORMAL") return { color: colors.riskLow, bg: colors.riskLowBg, icon: "checkmark-circle" as const, label: t.zoneNormal };
    if (zone === "CONCERN") return { color: "#F59E0B", bg: "rgba(245,158,11,0.1)", icon: "warning" as const, label: t.zoneConcern };
    return { color: colors.riskHigh, bg: colors.riskHighBg, icon: "alert-circle" as const, label: t.zoneSevere };
  };

  const indicators = [
    { key: "WEIGHT" as BayiIndicator, label: t.weightKg, unit: "kg" },
    { key: "LENGTH" as BayiIndicator, label: t.lengthCm, unit: "cm" },
    { key: "HEAD_CIRCUMFERENCE" as BayiIndicator, label: t.headCircCm, unit: "cm" },
  ];

  const fetalHistoryRows: HistoryRow[] = fetalHistory.map((e) => {
    const style = e.status ? getStatusStyle(e.status) : null;
    return {
      id: e.record_id,
      date: formatDate(e.date),
      valueLabel: `${((e.fetal_weight_grams ?? 0) / 1000).toFixed(2)} kg`,
      badgeText: e.status ? getStatusLabel(e.status) : undefined,
      badgeColor: style?.color,
      badgeBg: style?.bg,
    };
  });

  const headCircHistoryRows: HistoryRow[] = headCircHistory.map((e) => ({
    id: e.record_id,
    date: formatDate(e.date),
    valueLabel: `${e.head_circumference_cm ?? "—"} cm`,
  }));

  const maternalHistoryRows: HistoryRow[] = maternalHistory.map((e) => ({
    id: e.record_id,
    date: formatDate(e.date),
    valueLabel: `${e.maternal_weight_kg ?? "—"} kg · ${e.maternal_height_cm ?? "—"} cm`,
  }));

  const growthHistoryRows: HistoryRow[] = growthHistory.map((e) => {
    const style = e.zone ? getZoneStyle(e.zone) : null;
    const unit = e.indicator === "WEIGHT" ? "kg" : "cm";
    return {
      id: e.record_id,
      date: formatDate(e.date),
      valueLabel: `${e.value ?? "—"} ${unit}`,
      badgeText: style?.label,
      badgeColor: style?.color,
      badgeBg: style?.bg,
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      <AppHeader title={t.monitoring} />

      {/* Tab selector */}
      <View className="px-5 mb-4">
        <View className="flex-row p-1" style={{ backgroundColor: colors.surfaceContainer, borderRadius: 999 }}>
          <AnimatedPressable
            haptic
            onPress={() => setTab("janin")}
            style={{ flex: 1, paddingVertical: 10, borderRadius: 999, alignItems: "center", backgroundColor: tab === "janin" ? colors.primary : "transparent" }}
          >
            <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: tab === "janin" ? "#FFFFFF" : colors.textSecondary }}>
              {t.monitoringJanin}
            </Text>
          </AnimatedPressable>
          <AnimatedPressable
            haptic
            onPress={() => setTab("bayi")}
            style={{ flex: 1, paddingVertical: 10, borderRadius: 999, alignItems: "center", backgroundColor: tab === "bayi" ? colors.primary : "transparent" }}
          >
            <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: tab === "bayi" ? "#FFFFFF" : colors.textSecondary }}>
              {t.monitoringBayi}
            </Text>
          </AnimatedPressable>
        </View>
      </View>

      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
        {tab === "janin" ? (
          <Animated.View
            key="janin"
            entering={SlideInLeft.duration(250)}
            exiting={SlideOutLeft.duration(200)}
          >
            {profile && (
              <View className="flex-row items-center p-3 mb-4" style={{ backgroundColor: colors.primaryContainer, borderRadius: 12, gap: 8 }}>
                <Ionicons name="information-circle" size={16} color={colors.background} />
                <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.background, flex: 1 }}>
                  {profile.trimester === 3 ? t.monitoringT3Active : t.monitoringTrackerOnly}
                </Text>
              </View>
            )}

            {/* Section 1: Berat Janin */}
            <View className="p-4 mb-4" style={{ backgroundColor: colors.surface, borderRadius: 20 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.textPrimary, marginBottom: 4 }}>
                {t.fetalWeight}
              </Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, marginBottom: 16 }}>
                {t.fetalWeightDesc}
              </Text>

              <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary, marginBottom: 6 }}>
                {t.fetalWeightInput}
              </Text>
              <View className="flex-row items-center mb-4" style={{ backgroundColor: colors.surfaceContainer, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 4 }}>
                <TextInput
                  style={{ flex: 1, color: colors.textPrimary, fontFamily: fonts.regular, fontSize: 15, paddingVertical: 10 }}
                  placeholder={t.fetalWeightPlaceholder}
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                  value={fetalWeight}
                  onChangeText={setFetalWeight}
                />
                <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary }}>kg</Text>
              </View>

              <AnimatedPressable haptic onPress={handleCheckFetal} disabled={!fetalWeight || isCheckingFetal}>
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ borderRadius: 999, paddingVertical: 14, alignItems: "center", opacity: !fetalWeight || isCheckingFetal ? 0.6 : 1 }}
                >
                  {isCheckingFetal
                    ? <ActivityIndicator color="#FFFFFF" />
                    : <Text style={{ fontFamily: fonts.semibold, color: "#FFFFFF" }}>{t.checkNowBtn}</Text>
                  }
                </LinearGradient>
              </AnimatedPressable>

              {fetalError && (
                <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.riskHigh, marginTop: 10, textAlign: "center" }}>
                  {fetalError}
                </Text>
              )}

              {fetalResult && (() => {
                const style = getStatusStyle(fetalResult.status);
                return (
                  <View className="p-4 mt-4 flex-row items-start" style={{ backgroundColor: style.bg, borderRadius: 16, gap: 10 }}>
                    <Ionicons name={style.icon} size={22} color={style.color} style={{ marginTop: 2 }} />
                    <View className="flex-1">
                      <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: style.color, marginBottom: 4 }}>
                        {getStatusLabel(fetalResult.status)}
                      </Text>
                      <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: style.messageColor }}>
                        {fetalResult.message}
                      </Text>
                    </View>
                  </View>
                );
              })()}
            </View>

            <HistorySection
              title={t.fetalWeightHistory}
              isLoading={isFetalHistoryLoading}
              rows={fetalHistoryRows}
              onDelete={(id) => handleDeleteHistoryEntry("FETAL_WEIGHT", id)}
              deletingIds={deletingIds}
            />

            {/* Section 2: Lingkar Kepala Janin */}
            <View className="p-4 mb-4" style={{ backgroundColor: colors.surface, borderRadius: 20 }}>
              <View className="flex-row items-center p-3 mb-4" style={{ backgroundColor: colors.primaryContainer, borderRadius: 14, gap: 10 }}>
                <Ionicons name="information-circle" size={18} color={colors.background} />
                <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.background, flex: 1 }}>
                  {t.headCircDesc}
                </Text>
              </View>

              <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary, marginBottom: 6 }}>
                {t.headCircInput}
              </Text>
              <View className="flex-row items-center mb-4" style={{ backgroundColor: colors.surfaceContainer, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 4 }}>
                <TextInput
                  style={{ flex: 1, color: colors.textPrimary, fontFamily: fonts.regular, fontSize: 15, paddingVertical: 10 }}
                  placeholder={t.headCircPlaceholder}
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                  value={headCirc}
                  onChangeText={(v) => { setHeadCirc(v); setHeadCircSaved(false); }}
                />
                <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary }}>cm</Text>
              </View>

              <AnimatedPressable haptic onPress={handleSaveHeadCirc} disabled={!headCirc || isSavingHeadCirc}>
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ borderRadius: 999, paddingVertical: 14, alignItems: "center", opacity: !headCirc || isSavingHeadCirc ? 0.6 : 1 }}
                >
                  {isSavingHeadCirc
                    ? <ActivityIndicator color="#FFFFFF" />
                    : <Text style={{ fontFamily: fonts.semibold, color: "#FFFFFF" }}>{t.headCircSave}</Text>
                  }
                </LinearGradient>
              </AnimatedPressable>

              {headCircError && (
                <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.riskHigh, marginTop: 10, textAlign: "center" }}>
                  {headCircError}
                </Text>
              )}
              {headCircSaved && !headCircError && (
                <View className="flex-row items-center justify-center mt-3" style={{ gap: 6 }}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.riskLow} />
                  <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.riskLow }}>{t.headCircSave} ✓</Text>
                </View>
              )}
            </View>

            <HistorySection
              title={t.headCircHistory}
              isLoading={isHeadCircHistoryLoading}
              rows={headCircHistoryRows}
              onDelete={(id) => handleDeleteHistoryEntry("HEAD_CIRC", id)}
              deletingIds={deletingIds}
            />

            {/* Section 3: BB & TB Ibu Hamil */}
            <View className="p-4 mb-4" style={{ backgroundColor: colors.surface, borderRadius: 20 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.textPrimary, marginBottom: 4 }}>
                {t.maternalTitle}
              </Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, marginBottom: 16 }}>
                {t.maternalDesc}
              </Text>

              <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary, marginBottom: 6 }}>
                {t.maternalWeight}
              </Text>
              <View className="flex-row items-center mb-4" style={{ backgroundColor: colors.surfaceContainer, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 4 }}>
                <TextInput
                  style={{ flex: 1, color: colors.textPrimary, fontFamily: fonts.regular, fontSize: 15, paddingVertical: 10 }}
                  placeholder={t.maternalWeightPlaceholder}
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                  value={maternalWeight}
                  onChangeText={(v) => { setMaternalWeight(v); setMaternalSaved(false); }}
                />
                <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary }}>kg</Text>
              </View>

              <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary, marginBottom: 6 }}>
                {t.maternalHeight}
              </Text>
              <View className="flex-row items-center mb-2" style={{ backgroundColor: colors.surfaceContainer, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 4 }}>
                <TextInput
                  style={{ flex: 1, color: colors.textPrimary, fontFamily: fonts.regular, fontSize: 15, paddingVertical: 10 }}
                  placeholder={t.maternalHeightPlaceholder}
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                  value={maternalHeight}
                  onChangeText={(v) => { setMaternalHeight(v); setMaternalSaved(false); }}
                />
                <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary }}>cm</Text>
              </View>
              <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary, marginBottom: 14 }}>
                {t.maternalTrackingNote}
              </Text>

              <AnimatedPressable haptic onPress={handleSaveMaternal} disabled={!maternalWeight || !maternalHeight || isSavingMaternal}>
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ borderRadius: 999, paddingVertical: 14, alignItems: "center", opacity: !maternalWeight || !maternalHeight || isSavingMaternal ? 0.6 : 1 }}
                >
                  {isSavingMaternal
                    ? <ActivityIndicator color="#FFFFFF" />
                    : <Text style={{ fontFamily: fonts.semibold, color: "#FFFFFF" }}>{t.maternalSave}</Text>
                  }
                </LinearGradient>
              </AnimatedPressable>

              {maternalError && (
                <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.riskHigh, marginTop: 10, textAlign: "center" }}>
                  {maternalError}
                </Text>
              )}
              {maternalSaved && !maternalError && (
                <View className="flex-row items-center justify-center mt-3" style={{ gap: 6 }}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.riskLow} />
                  <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.riskLow }}>{t.maternalSave} ✓</Text>
                </View>
              )}
            </View>

            <HistorySection
              title={t.maternalHistory}
              isLoading={isMaternalHistoryLoading}
              rows={maternalHistoryRows}
              onDelete={(id) => handleDeleteHistoryEntry("MATERNAL", id)}
              deletingIds={deletingIds}
            />
          </Animated.View>
        ) : (
          <Animated.View
            key="bayi"
            entering={SlideInRight.duration(250)}
            exiting={SlideOutRight.duration(200)}
          >
            <View className="p-4 mb-4" style={{ backgroundColor: colors.surface, borderRadius: 20 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.textPrimary, marginBottom: 16 }}>
                {t.babyData}
              </Text>

              {/* Sex */}
              <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary, marginBottom: 8 }}>
                {t.babySex}
              </Text>
              <View className="flex-row mb-4" style={{ gap: 10 }}>
                {(["FEMALE", "MALE"] as BayiSex[]).map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setSex(s)}
                    style={{ flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center", backgroundColor: sex === s ? colors.primary : colors.surfaceContainer }}
                  >
                    <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: sex === s ? "#FFFFFF" : colors.textSecondary }}>
                      {s === "FEMALE" ? t.female : t.male}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Umur */}
              <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary, marginBottom: 6 }}>
                {t.babyAge}
              </Text>
              <View className="flex-row items-center mb-4" style={{ backgroundColor: colors.surfaceContainer, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 4 }}>
                <TextInput
                  style={{ flex: 1, color: colors.textPrimary, fontFamily: fonts.regular, fontSize: 15, paddingVertical: 10 }}
                  placeholder={t.babyAgePlaceholder}
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  value={ageMonths}
                  onChangeText={setAgeMonths}
                />
                <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary }}>{t.monthsUnit}</Text>
              </View>

              {/* Indicator */}
              <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary, marginBottom: 8 }}>
                {t.measurementType}
              </Text>
              <View className="flex-row mb-4" style={{ gap: 8 }}>
                {indicators.map((ind) => (
                  <TouchableOpacity
                    key={ind.key}
                    onPress={() => { setIndicator(ind.key); setValue(""); }}
                    style={{ flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: "center", backgroundColor: indicator === ind.key ? colors.primary : colors.surfaceContainer }}
                  >
                    <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: indicator === ind.key ? "#FFFFFF" : colors.textSecondary, textAlign: "center" }}>
                      {ind.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Value */}
              <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary, marginBottom: 6 }}>
                {t.measurementValue}
              </Text>
              <View className="flex-row items-center mb-4" style={{ backgroundColor: colors.surfaceContainer, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 4 }}>
                <TextInput
                  style={{ flex: 1, color: colors.textPrimary, fontFamily: fonts.regular, fontSize: 15, paddingVertical: 10 }}
                  placeholder={indicator === "WEIGHT" ? "7.5" : "65"}
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                  value={value}
                  onChangeText={setValue}
                />
                <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary }}>
                  {indicators.find(i => i.key === indicator)?.unit}
                </Text>
              </View>

              <AnimatedPressable haptic onPress={handleCheckGrowth} disabled={!value || !ageMonths || isCheckingGrowth}>
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ borderRadius: 999, paddingVertical: 14, alignItems: "center", opacity: !value || !ageMonths || isCheckingGrowth ? 0.6 : 1 }}
                >
                  {isCheckingGrowth
                    ? <ActivityIndicator color="#FFFFFF" />
                    : <Text style={{ fontFamily: fonts.semibold, color: "#FFFFFF" }}>{t.evaluateGrowth}</Text>
                  }
                </LinearGradient>
              </AnimatedPressable>

              {growthError && (
                <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.riskHigh, marginTop: 10, textAlign: "center" }}>
                  {growthError}
                </Text>
              )}
            </View>

            {/* Hasil growth */}
            {growthResult && (() => {
              const style = getZoneStyle(growthResult.zone);
              return (
                <View className="p-4 mb-6" style={{ backgroundColor: style.bg, borderRadius: 16 }}>
                  <View className="flex-row items-center mb-3" style={{ gap: 8 }}>
                    <Ionicons name={style.icon} size={22} color={style.color} />
                    <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: style.color }}>{style.label}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <View className="items-center flex-1">
                      <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary, marginBottom: 2 }}>{t.zScore}</Text>
                      <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: style.color }}>{growthResult.z_score.toFixed(2)}</Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: colors.outlineVariant }} />
                    <View className="items-center flex-1">
                      <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary, marginBottom: 2 }}>{t.referenceMonth}</Text>
                      <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.textPrimary }}>{growthResult.reference_month_used}</Text>
                    </View>
                  </View>
                  {growthResult.zone !== "NORMAL" && (
                    <View className="mt-3 pt-3" style={{ borderTopWidth: 1, borderTopColor: colors.outlineVariant }}>
                      <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary }}>
                        {t.consultDoctor}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })()}

            <HistorySection
              title={t.growthHistory}
              isLoading={isGrowthHistoryLoading}
              rows={growthHistoryRows}
              onDelete={(id) => handleDeleteHistoryEntry("GROWTH", id)}
              deletingIds={deletingIds}
            />
          </Animated.View>
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
