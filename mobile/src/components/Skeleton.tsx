import React, { useEffect } from "react";
import { View, ViewStyle, StyleProp } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from "react-native-reanimated";
import { colors } from "../theme/colors";

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function SkeletonBlock({ width = "100%", height = 16, borderRadius = 8, style }: SkeletonProps) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: colors.surfaceContainer },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function SkeletonListItem() {
  return (
    <View
      className="flex-row items-center mb-3 p-4"
      style={{ backgroundColor: colors.surface, borderRadius: 20 }}
    >
      <SkeletonBlock width={48} height={48} borderRadius={24} style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <SkeletonBlock width="70%" height={14} style={{ marginBottom: 8 }} />
        <SkeletonBlock width="40%" height={11} />
      </View>
    </View>
  );
}
