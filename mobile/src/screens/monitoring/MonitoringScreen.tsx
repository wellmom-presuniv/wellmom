import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { useTranslation } from "../../hooks/useTranslation";
import AppHeader from "../../components/AppHeader";

type MonitoringTab = "janin" | "bayi";
type BayiIndicator = "WEIGHT" | "LENGTH" | "HEAD_CIRCUMFERENCE";
type BayiSex = "MALE" | "FEMALE";

export default function MonitoringScreen() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<MonitoringTab>("janin");

  const [fetalWeight, setFetalWeight] = useState("");
  const [fetalResult, setFetalResult] = useState<{ status: string; message: string } | null>(null);
  const [isCheckingFetal, setIsCheckingFetal] = useState(false);

  const [indicator, setIndicator] = useState<BayiIndicator>("WEIGHT");
  const [value, setValue] = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [sex, setSex] = useState<BayiSex>("FEMALE");
  const [growthResult, setGrowthResult] = useState<{ z_score: number; zone: string; reference_month_used: number } | null>(null);
  const [isCheckingGrowth, setIsCheckingGrowth] = useState(false);

  const handleCheckFetal = async () => {
    if (!fetalWeight) return;
    setIsCheckingFetal(true);
    setFetalResult(null);
    try {
      // TODO: swap ke real API begitu Alek push endpoint
      // const { data } = await apiClient.post("/monitoring/fetal-weight/check", {
      //   weight_grams: parseFloat(fetalWeight) * 1000,
      // });
      // setFetalResult(data);

      const grams = parseFloat(fetalWeight) * 1000;
      await new Promise(r => setTimeout(r, 800));
      if (grams < 2500) {
        setFetalResult({ status: "BELOW_NORMAL", message: t.belowNormalMsg });
      } else if (grams > 4000) {
        setFetalResult({ status: "ABOVE_NORMAL", message: t.aboveNormalMsg });
      } else {
        setFetalResult({ status: "NORMAL", message: t.normalMsg });
      }
    } catch (err) {
      console.warn("Gagal cek berat janin:", err);
    } finally {
      setIsCheckingFetal(false);
    }
  };

  const handleCheckGrowth = async () => {
    if (!value || !ageMonths) return;
    setIsCheckingGrowth(true);
    setGrowthResult(null);
    try {
      // TODO: swap ke real API begitu Alek push endpoint
      // const { data } = await apiClient.post("/monitoring/growth/evaluate", {
      //   indicator,
      //   value: parseFloat(value),
      //   age_months: parseInt(ageMonths),
      //   sex,
      // });
      // setGrowthResult(data);

      await new Promise(r => setTimeout(r, 800));
      setGrowthResult({ z_score: -0.5, zone: "NORMAL", reference_month_used: parseInt(ageMonths) });
    } catch (err) {
      console.warn("Gagal cek pertumbuhan:", err);
    } finally {
      setIsCheckingGrowth(false);
    }
  };

  const getStatusStyle = (status: string) => {
    if (status === "NORMAL") return { color: colors.riskLow, bg: colors.riskLowBg, icon: "checkmark-circle" as const };
    if (status === "ABOVE_NORMAL") return { color: "#F59E0B", bg: "rgba(245,158,11,0.1)", icon: "warning" as const };
    return { color: colors.riskHigh, bg: colors.riskHighBg, icon: "alert-circle" as const };
  };

  const getZoneStyle = (zone: string) => {
    if (zone === "NORMAL") return { color: colors.riskLow, bg: colors.riskLowBg, icon: "checkmark-circle" as const, label: t.zoneNormal };
    if (zone === "CONCERN") return { color: "#F59E0B", bg: "rgba(245,158,11,0.1)", icon: "warning" as const, label: t.zoneConcern };
    return { color: colors.riskHigh, bg: colors.riskHighBg, icon: "alert-circle" as const, label: t.zoneSevere };
  };

  const indicators = [
    { key: "WEIGHT" as BayiIndicator, label: t.weightKg, unit: "kg" },
    { key: "LENGTH" as BayiIndicator, label: t.lengthCm, unit: "cm" },
    { key: "HEAD_CIRCUMFERENCE" as BayiIndicator, label: t.headCircCm, unit: "cm" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <AppHeader title={t.monitoring} />

      {/* Tab selector */}
      <View className="px-5 mb-4">
        <View className="flex-row p-1" style={{ backgroundColor: colors.surfaceContainer, borderRadius: 999 }}>
          <TouchableOpacity
            onPress={() => setTab("janin")}
            style={{ flex: 1, paddingVertical: 10, borderRadius: 999, alignItems: "center", backgroundColor: tab === "janin" ? colors.primary : "transparent" }}
          >
            <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: tab === "janin" ? "#FFFFFF" : colors.textSecondary }}>
              {t.monitoringJanin}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab("bayi")}
            style={{ flex: 1, paddingVertical: 10, borderRadius: 999, alignItems: "center", backgroundColor: tab === "bayi" ? colors.primary : "transparent" }}
          >
            <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: tab === "bayi" ? "#FFFFFF" : colors.textSecondary }}>
              {t.monitoringBayi}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
        {tab === "janin" ? (
          <View>
            {/* Info lingkar kepala statis */}
            <View className="flex-row items-center p-4 mb-4" style={{ backgroundColor: colors.primaryContainer, borderRadius: 16, gap: 10 }}>
              <Ionicons name="information-circle" size={20} color={colors. background} />
              <View className="flex-1">
                <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.background, marginBottom: 2 }}>
                  {t.headCircInfo}
                </Text>
                <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.background }}>
                  {t.headCircDesc}
                </Text>
              </View>
            </View>

            {/* Input berat janin */}
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

              <TouchableOpacity onPress={handleCheckFetal} disabled={!fetalWeight || isCheckingFetal} activeOpacity={0.85}>
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
              </TouchableOpacity>
            </View>

            {/* Hasil */}
            {fetalResult && (() => {
              const style = getStatusStyle(fetalResult.status);
              return (
                <View className="p-4 mb-6 flex-row items-start" style={{ backgroundColor: style.bg, borderRadius: 16, gap: 10 }}>
                  <Ionicons name={style.icon} size={22} color={style.color} style={{ marginTop: 2 }} />
                  <View className="flex-1">
                    <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: style.color, marginBottom: 4 }}>
                      {fetalResult.status === "NORMAL" ? t.normalResult : fetalResult.status === "BELOW_NORMAL" ? t.belowNormal : t.aboveNormal}
                    </Text>
                    <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary }}>
                      {fetalResult.message}
                    </Text>
                  </View>
                </View>
              );
            })()}
          </View>
        ) : (
          <View>
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
                <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary }}>{t.months}</Text>
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

              <TouchableOpacity onPress={handleCheckGrowth} disabled={!value || !ageMonths || isCheckingGrowth} activeOpacity={0.85}>
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
              </TouchableOpacity>
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
          </View>
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}