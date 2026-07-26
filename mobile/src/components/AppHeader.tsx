import React, { useEffect, useRef, useState } from "react";
import { Animated, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ReanimatedView, { FadeInDown } from "react-native-reanimated";
import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";
import { useLanguageStore } from "../store/useLanguageStore";
import { useNotificationStore } from "../store/useNotificationStore";
import { useTranslation } from "../hooks/useTranslation";
import { sendLocalNotification } from "../services/notificationService";
import AnimatedPressable from "./AnimatedPressable";

interface AppHeaderProps {
  title: string;
  notificationMessage?: string;
}

export default function AppHeader({ title, notificationMessage }: AppHeaderProps) {
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const notificationsEnabled = useNotificationStore((s) => s.notificationsEnabled);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [bubbleText, setBubbleText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, []);

  const animateBubbleIn = () => {
    setIsAnimating(true);
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start(() => setIsAnimating(false));
  };

  const animateBubbleOut = (callback?: () => void) => {
    setIsAnimating(true);
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.92,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsAnimating(false);
      callback?.();
    });
  };

  const showNotificationBubble = (text: string) => {
    setBubbleText(text);
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
    setBubbleVisible(true);
    animateBubbleIn();

    hideTimeout.current = setTimeout(() => {
      animateBubbleOut(() => {
        setBubbleVisible(false);
      });
      hideTimeout.current = null;
    }, 4200);
  };

  const hideNotificationBubble = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    animateBubbleOut(() => setBubbleVisible(false));
  };

  const onNotificationPress = async () => {
    if (bubbleVisible) {
      hideNotificationBubble();
      return;
    }

    const message = notificationMessage || t.notificationDefault;

    if (!notificationsEnabled) {
      showNotificationBubble(t.notificationsOffText);
      return;
    }

    showNotificationBubble(message);
    await sendLocalNotification(message);
  };

  return (
    <ReanimatedView.View
      entering={FadeInDown.duration(300)}
      className="flex-row items-center justify-between px-5 pt-2 pb-4"
      style={{ position: "relative", zIndex: 50, elevation: 1 }}
    >
      <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.primary }}>{title}</Text>
      <View className="flex-row" style={{ gap: 8, position: "relative" }}>
        <AnimatedPressable
          haptic
          onPress={() => setLanguage(language === "id" ? "en" : "id")}
          style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceContainer, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: colors.primary }}>
            {language === "id" ? "ID" : "EN"}
          </Text>
        </AnimatedPressable>
        <View style={styles.notificationWrapper}>
          <AnimatedPressable
            haptic
            onPress={onNotificationPress}
            style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceContainer, alignItems: "center", justifyContent: "center" }}
          >
            <Ionicons
              name={notificationsEnabled ? "notifications-outline" : "notifications-off-outline"}
              size={18}
              color={colors.primary}
            />
          </AnimatedPressable>
          {bubbleVisible && (
            <Animated.View
              style={[
                styles.bubbleContainer,
                {
                  opacity: opacityAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <Text style={styles.bubbleText}>{bubbleText}</Text>
            </Animated.View>
          )}
        </View>
      </View>
    </ReanimatedView.View>
  );
}

const styles = StyleSheet.create({
  notificationWrapper: {
    position: "relative",
  },
  bubbleContainer: {
    position: "absolute",
    right: 0,
    top: 44,
    minWidth: 220,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    zIndex: 20,
  },
  bubbleText: {
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
  },
});
