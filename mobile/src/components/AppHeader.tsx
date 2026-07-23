import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";
import { useLanguageStore } from "../store/useLanguageStore";

interface AppHeaderProps {
  title: string;
}

export default function AppHeader({ title }: AppHeaderProps) {
  const { language, setLanguage } = useLanguageStore();

  return (
    <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
      <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.primary }}>{title}</Text>
      <View className="flex-row" style={{ gap: 8 }}>
        <TouchableOpacity
          onPress={() => setLanguage(language === "id" ? "en" : "id")}
          style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceContainer, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: colors.primary }}>
            {language === "id" ? "ID" : "EN"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceContainer, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="notifications-outline" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}