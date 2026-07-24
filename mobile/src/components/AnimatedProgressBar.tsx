import React, { useEffect } from "react";
import { View, ViewStyle, StyleProp } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from "react-native-reanimated";

interface AnimatedProgressBarProps {
  progress: number; // 0..1
  height?: number;
  trackColor: string;
  fillColor: string;
  style?: StyleProp<ViewStyle>;
}

export default function AnimatedProgressBar({ progress, height = 8, trackColor, fillColor, style }: AnimatedProgressBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(Math.max(0, Math.min(1, progress)) * 100, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View style={[{ height, borderRadius: height / 2, backgroundColor: trackColor, overflow: "hidden" }, style]}>
      <Animated.View style={[{ height: "100%", borderRadius: height / 2, backgroundColor: fillColor }, animatedStyle]} />
    </View>
  );
}
