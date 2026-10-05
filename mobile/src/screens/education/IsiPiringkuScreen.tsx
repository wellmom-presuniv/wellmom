import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { useTranslation } from "../../hooks/useTranslation";
import { getMyProfile } from "../../api/profileService";
import {
  ISI_PIRINGKU_ITEMS,
  ISI_PIRINGKU_NOTES,
  ISI_PIRINGKU_SOURCE,
  IsiPiringkuItem,
  Lang,
} from "../../data/isiPiringku";

export default function IsiPiringkuScreen({ navigation }: any) {
  const { t, language } = useTranslation();
  const lang = language as Lang;
  const [trimester, setTrimester] = useState<1 | 2 | 3 | null>(null);

  // Trimester dihitung backend; kalau gagal dimuat, tampilkan semua trimester.
  useFocusEffect(
    useCallback(() => {
      getMyProfile()
        .then((p) => setTrimester(p.trimester))
        .catch(() => setTrimester(null));
    }, [])
  );

  const amountText = (item: IsiPiringkuItem): string => {
    const byTri = item.amount.byTrimester;
    if (byTri) {
      if (trimester) return `${byTri[trimester]} ${item.unit[lang]}`;
      return `${byTri[1]} ${item.unit[lang]} (${t.isiPiringkuTrimesterShort.replace("{n}", "1")}), ${byTri[2]} ${item.unit[lang]} (${t.isiPiringkuTrimesterShort.replace("{n}", "2-3")})`;
    }
    return `${item.amount.fixed} ${item.unit[lang]}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-5 pt-2 pb-3">
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.textPrimary }}>{t.isiPiringkuTitle}</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary }}>{t.isiPiringkuSubtitle}</Text>
        </View>
      </View>

      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
        {trimester && (
          <View className="flex-row items-center p-3 mb-4" style={{ backgroundColor: colors.primaryContainer, borderRadius: 12, gap: 8 }}>
            <Ionicons name="information-circle" size={16} color={colors.background} />
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.background }}>
              {t.isiPiringkuTrimesterBanner.replace("{trimester}", t.trimester.replace("{n}", String(trimester)))}
            </Text>
          </View>
        )}

        {ISI_PIRINGKU_ITEMS.map((item, idx) => (
          <Animated.View
            key={item.key}
            entering={FadeInDown.delay(idx * 40).duration(300)}
            className="p-4 mb-3"
            style={{ backgroundColor: colors.surface, borderRadius: 18 }}
          >
            <View className="flex-row items-center" style={{ gap: 12 }}>
              <View
                style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryContainer, alignItems: "center", justifyContent: "center" }}
              >
                <Ionicons name={item.icon} size={22} color={colors.background} />
              </View>
              <View className="flex-1">
                <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.textPrimary }}>{item.name[lang]}</Text>
                <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.primary, marginTop: 2 }}>{amountText(item)}</Text>
              </View>
            </View>
            {item.portions.map((portion, i) => (
              <Text
                key={i}
                style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, marginTop: i === 0 ? 10 : 4, lineHeight: 18 }}
              >
                • {portion[lang]}
              </Text>
            ))}
          </Animated.View>
        ))}

        <View className="p-4 mb-3" style={{ backgroundColor: colors.surface, borderRadius: 18 }}>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.textPrimary, marginBottom: 8 }}>{t.isiPiringkuNotes}</Text>
          {ISI_PIRINGKU_NOTES.map((note, i) => (
            <Text key={i} style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, lineHeight: 20, marginBottom: 4 }}>
              • {note[lang]}
            </Text>
          ))}
        </View>

        <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary, marginBottom: 24, paddingHorizontal: 4 }}>
          {t.isiPiringkuSource}: {ISI_PIRINGKU_SOURCE}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
