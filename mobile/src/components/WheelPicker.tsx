import React, { useCallback, useEffect, useRef } from "react";
import { View, Text, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import * as Haptics from "expo-haptics";
import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 3; // 1 above, 1 selected (center), 1 below

interface WheelPickerItem {
  label: string;
  value: number;
}

interface WheelPickerProps {
  items: WheelPickerItem[];
  selectedValue: number;
  onValueChange: (value: number) => void;
  width?: number;
}

/**
 * Custom wheel picker — renders identically on iOS and Android since it's
 * pure JS/ScrollView instead of the native Picker (which looks inconsistent
 * per-platform and can't be restyled on some Android OEM skins).
 */
export default function WheelPicker({ items, selectedValue, onValueChange, width = 90 }: WheelPickerProps) {
  const scrollRef = useRef<ScrollView>(null);
  const isUserScrolling = useRef(false);

  const indexForValue = useCallback(
    (value: number) => {
      const idx = items.findIndex((item) => item.value === value);
      // selectedValue can be momentarily out of range (e.g. day=31 while month
      // shrinks to Feb) — the screens clamp it at display/submit time, so here
      // we just fall back to the last item instead of crashing on index -1.
      return idx !== -1 ? idx : Math.max(0, items.length - 1);
    },
    [items]
  );

  // Keep the wheel in sync when selectedValue/items change from OUTSIDE
  // (parent state, or the day list shrinking) — skip while the user's own
  // gesture is still in progress so we don't fight their scroll.
  useEffect(() => {
    if (isUserScrolling.current) return;
    scrollRef.current?.scrollTo({ y: indexForValue(selectedValue) * ITEM_HEIGHT, animated: false });
  }, [selectedValue, items, indexForValue]);

  const handleMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      isUserScrolling.current = false;

      const y = e.nativeEvent.contentOffset.y;
      const rawIndex = Math.round(y / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(rawIndex, items.length - 1));
      const item = items[clampedIndex];

      if (item && item.value !== selectedValue) {
        Haptics.selectionAsync();
        onValueChange(item.value);
      }
      // Snap precisely in case momentum stopped slightly off-grid.
      scrollRef.current?.scrollTo({ y: clampedIndex * ITEM_HEIGHT, animated: true });
    },
    [items, selectedValue, onValueChange]
  );

  return (
    <View style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS, width, overflow: "hidden" }}>
      {/* Center highlight band */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: ITEM_HEIGHT,
          left: 0,
          right: 0,
          height: ITEM_HEIGHT,
          backgroundColor: "rgba(177,14,107,0.08)",
          borderRadius: 10,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: colors.outlineVariant,
        }}
      />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onScrollBeginDrag={() => { isUserScrolling.current = true; }}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
      >
        {items.map((item) => {
          const isSelected = item.value === selectedValue;
          return (
            <View key={item.value} style={{ height: ITEM_HEIGHT, alignItems: "center", justifyContent: "center" }}>
              <Text
                style={{
                  fontFamily: isSelected ? fonts.bold : fonts.regular,
                  fontSize: isSelected ? 17 : 15,
                  color: isSelected ? colors.primary : colors.textSecondary,
                  opacity: isSelected ? 1 : 0.5,
                }}
              >
                {item.label}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
