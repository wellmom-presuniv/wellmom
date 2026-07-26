import React from "react";
import { Pressable, PressableProps, ViewStyle, StyleProp } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { colors } from "../theme/colors";

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

interface PressableRowProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/** List row with a subtle background highlight on press — used for settings-style rows. */
export default function PressableRow({ style, onPressIn, onPressOut, children, ...rest }: PressableRowProps) {
  const highlight = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(highlight.value, [0, 1], ["rgba(255,232,238,0)", colors.surfaceContainer]),
  }));

  return (
    <AnimatedPressableBase
      style={[style, animatedStyle]}
      onPressIn={(e) => {
        highlight.value = withTiming(1, { duration: 100 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        highlight.value = withTiming(0, { duration: 150 });
        onPressOut?.(e);
      }}
      {...rest}
    >
      {children}
    </AnimatedPressableBase>
  );
}
