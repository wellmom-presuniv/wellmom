import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, Platform, ActivityIndicator} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useAuthStore } from "../../store/useAuthStore";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { submitProfile } from "../../api/profileService";
import { PregnancyProfile } from "../../types";

const MONTHS_ID = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agt", "Sep", "Okt", "Nov", "Des",
];

function daysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Hitung trimester & minggu kehamilan dari HPL (Hari Perkiraan Lahir).
 * Asumsi standar: kehamilan = 40 minggu (280 hari) dari HPL ke belakang.
 * TODO: kalau nanti ada input HPHT (hari pertama haid terakhir), hitungan bisa
 * lebih presisi — untuk sekarang cukup pakai HPL sesuai yang diminta di proposal.
 */
// function getGestationalInfo(dueDate: Date, today: Date = new Date()) {
//   const msPerDay = 24 * 60 * 60 * 1000;
//   const daysUntilDue = Math.round((dueDate.getTime() - today.getTime()) / msPerDay);
//   const daysPregnant = Math.max(0, 280 - daysUntilDue);
//   const week = Math.min(40, Math.floor(daysPregnant / 7));
//   const trimester = week <= 13 ? 1 : week <= 27 ? 2 : 3;
//   return { week, trimester };
// }

export default function ProfileSetupScreen() {
  const today = new Date();
  const [day, setDay] = useState(today.getDate());
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [showCelebration, setShowCelebration] = useState(false);

  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);

  const maxDay = daysInMonth(month, year);
  const selectedDate = useMemo(() => new Date(year, month, Math.min(day, maxDay)), [day, month, year, maxDay]);
  const formattedDate = `${Math.min(day, maxDay)} ${MONTHS_ID[month]} ${year}`;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedProfile, setSubmittedProfile] = useState<PregnancyProfile | null>(null);

  // ===== Floating illustration =====
  const floatY = useSharedValue(0);
  React.useEffect(() => {
    floatY.value = withRepeat(withTiming(-10, { duration: 1500, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);
  const floatStyle = useAnimatedStyle(() => ({ transform: [{ translateY: floatY.value }] }));

  // ===== Celebration overlay (pengganti Moti) =====
  const overlayOpacity = useSharedValue(0);
  const heart0 = useSharedValue(0);
  const heart1 = useSharedValue(0);
  const heart2 = useSharedValue(0);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.value }));
  const heartStyle0 = useAnimatedStyle(() => ({
    opacity: heart0.value,
    transform: [{ scale: heart0.value }, { translateY: heart0.value * -12 }],
  }));
  const heartStyle1 = useAnimatedStyle(() => ({
    opacity: heart1.value,
    transform: [{ scale: heart1.value }, { translateY: heart1.value * -12 }],
  }));
  const heartStyle2 = useAnimatedStyle(() => ({
    opacity: heart2.value,
    transform: [{ scale: heart2.value }, { translateY: heart2.value * -12 }],
  }));

  const handleContinue = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const safeDay = Math.min(day, maxDay);
      const hpht = `${year}-${String(month + 1).padStart(2, "0")}-${String(safeDay).padStart(2, "0")}`;
      const profile = await submitProfile({ hpht });
      setSubmittedProfile(profile);

      setShowCelebration(true);
      overlayOpacity.value = withTiming(1, { duration: 200 });
      heart0.value = withDelay(0, withTiming(1, { duration: 400 }));
      heart1.value = withDelay(120, withTiming(1, { duration: 400 }));
      heart2.value = withDelay(240, withTiming(1, { duration: 400 }));

      setTimeout(() => {
        completeOnboarding();
      }, 900);
    } catch (err) {
      setError("Gagal menyimpan profil. Cek koneksi internet kamu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Atmospheric blob decoration — versi simple tanpa blur native, biar ga nambah dependency */}
      <View
        style={{
          position: "absolute",
          top: -60,
          left: -60,
          width: 220,
          height: 220,
          borderRadius: 110,
          backgroundColor: colors.primaryContainer,
          opacity: 0.12,
        }}
      />
      <View
        style={{
          position: "absolute",
          top: 180,
          right: -80,
          width: 260,
          height: 260,
          borderRadius: 130,
          backgroundColor: colors.secondaryContainer,
          opacity: 0.1,
        }}
      />

      {/* Header — back = logout (bukan goBack, karena nggak ada screen "sebelumnya" yang valid) */}
      <View className="flex-row justify-between items-center px-5 pt-2">
        <TouchableOpacity
          onPress={() => useAuthStore.getState().logout()}
          style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.5)", alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => completeOnboarding()}>
          <Text style={{ fontFamily: fonts.semibold, color: colors.primary, fontSize: 14 }}>Lewati</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-5 pt-4">
        {/* Floating illustration */}
        <View className="items-center mb-6">
          <Animated.View style={floatStyle}>
            <View
              style={{
                width: 140,
                height: 140,
                borderRadius: 70,
                backgroundColor: colors.surfaceContainer,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="woman" size={64} color={colors.primary} />
              <View
                style={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="calendar" size={18} color="#FFFFFF" />
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Heading */}
        <View className="items-center mb-6">
          <Text style={{ fontFamily: fonts.bold, fontSize: 24, color: colors.textPrimary }}>Lengkapi Profil</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary, textAlign: "center", marginTop: 8 }}>
            Masukkan Hari Pertama Haid Terakhir (HPHT) Anda untuk menghitung usia kehamilan dan mendapatkan panduan yang personal.
          </Text>
        </View>

        {/* Glass card — disimulasikan pakai white/70 + border, tanpa BlurView native dulu */}
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.75)",
            borderRadius: 24,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.5)",
            padding: 20,
            shadowColor: colors.primary,
            shadowOpacity: 0.1,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 8 },
            elevation: 4,
          }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.textPrimary }}>Pilih Tanggal HPHT</Text>
            <Ionicons name="calendar" size={20} color={colors.primary} />
          </View>

          <View className="flex-row justify-center">
            <Picker
              style={{ width: 100 }} 
              mode="dropdown"
              selectedValue={day}
              onValueChange={setDay}
              itemStyle={Platform.OS === "ios" ? { fontFamily: fonts.semibold } : undefined}
            >
              {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => (
                <Picker.Item key={d} label={String(d)} value={d} />
              ))}
            </Picker>
            <Picker
              style={{ width: 100 }}
              mode="dropdown"
              selectedValue={month}
              onValueChange={setMonth}
              itemStyle={Platform.OS === "ios" ? { fontFamily: fonts.semibold, color: colors.primary } : undefined}
            >
              {MONTHS_ID.map((m, i) => (
                <Picker.Item key={m} label={m} value={i} />
              ))}
            </Picker>
            <Picker
              style={{ width: 120 }}
              mode="dropdown"
              selectedValue={year}
              onValueChange={setYear}
              itemStyle={Platform.OS === "ios" ? { fontFamily: fonts.semibold } : undefined}
            >
              {[today.getFullYear() - 1, today.getFullYear()].map((y) => (
                <Picker.Item key={y} label={String(y)} value={y} />
              ))}
            </Picker>
          </View>

          <View className="items-center mt-2 pt-3" style={{ borderTopWidth: 1, borderTopColor: colors.outlineVariant }}>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 11, color: colors.textSecondary, letterSpacing: 1 }}>
              HPHT TERPILIH
            </Text>
            <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.primary, marginTop: 2 }}>
              {formattedDate}
            </Text>
          </View>
        </View>

        {/* <Text
          style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, textAlign: "center", marginTop: 16 }}
        >
          Belum tahu HPHT Anda?{" "}
          <Text style={{ fontFamily: fonts.bold, color: colors.secondary }}>Hitung di sini</Text>
        </Text> */}
      </View>

      {/* Celebration overlay — pakai Reanimated langsung, bukan Moti */}
      <Animated.View
        pointerEvents={showCelebration ? "auto" : "none"}
        style={[
          overlayStyle,
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255,248,248,0.85)",
          },
        ]}
      >
        <View className="flex-row mb-4">
          <Animated.View style={[heartStyle0, { marginHorizontal: 6 }]}>
            <Ionicons name="heart" size={28} color={colors.primary} />
          </Animated.View>
          <Animated.View style={[heartStyle1, { marginHorizontal: 6 }]}>
            <Ionicons name="heart" size={28} color={colors.primary} />
          </Animated.View>
          <Animated.View style={[heartStyle2, { marginHorizontal: 6 }]}>
            <Ionicons name="heart" size={28} color={colors.primary} />
          </Animated.View>
        </View>
        <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.primary }}>
          Kamu di Trimester {submittedProfile?.trimester}, Minggu ke-{submittedProfile?.gestational_week}! 🎉
        </Text>
      </Animated.View>

      {/* Bottom action */}
      <View className="px-5 pb-4">
        {error && (
          <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.riskHigh, textAlign: "center", marginBottom: 8 }}>
            {error}
          </Text>
        )}
        <TouchableOpacity onPress={handleContinue} activeOpacity={0.85} disabled={isSubmitting}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              height: 56,
              borderRadius: 28,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              shadowColor: colors.primary,
              shadowOpacity: 0.25,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 4,
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: "#FFFFFF", marginRight: 8 }}>Lanjutkan</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}