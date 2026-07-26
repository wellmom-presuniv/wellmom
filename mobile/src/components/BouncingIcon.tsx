import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from "react-native-reanimated";

interface BouncingIconProps {
  name: keyof typeof Ionicons.glyphMap;
  size: number;
  color: string;
}

/** Subtle looping bounce, used for empty-state illustrations. */
export default function BouncingIcon({ name, size, color }: BouncingIconProps) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(withTiming(-6, { duration: 900, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
}
