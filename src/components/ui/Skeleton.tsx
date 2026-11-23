import { useEffect } from "react";
import { DimensionValue, StyleProp, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/use-theme";

type Props = {
  width?: DimensionValue; // number (px) or '60%'
  height?: number;
  radius?: number;
  circle?: boolean; // perfect circle (avatars); uses `height` as size
  style?: StyleProp<ViewStyle>;
};

/** Gray placeholder that gently pulses while content is loading. */
export function Skeleton({
  width = "100%",
  height = 14,
  radius,
  circle,
  style,
}: Props) {
  const t = useTheme();
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    // fade 0.5 → 1 → 0.5 … forever
    opacity.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1, // repeat forever
      true, // reverse each time (back and forth)
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width: circle ? height : width,
          height,
          borderRadius: circle ? height / 2 : (radius ?? t.radius.sm),
          backgroundColor: t.colors.skeleton, // was: t.dark ? 'rgba(255,255,255,0.08)' : 'rgba(17,24,39,0.08)'
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

/** Ready-made skeleton shaped like a typical list card. */
export function SkeletonCard() {
  const t = useTheme();
  return (
    <View
      style={{
        gap: t.spacing.sm,
        padding: t.spacing.lg,
        borderRadius: t.radius.lg + 4,
        borderWidth: 1,
        borderColor: t.colors.border,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Skeleton width={80} height={12} />
        <Skeleton width={60} height={18} radius={t.radius.pill} />
      </View>
      <Skeleton width="70%" height={20} />
      <Skeleton width="45%" height={14} />
    </View>
  );
}
