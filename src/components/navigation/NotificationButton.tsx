import { useEffect, useRef } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { IconButton } from "@/components/ui";

type Props = {
  /** Unread notifications. 0 = no badge */
  count?: number;
  onPress: () => void;
  variant?: "glass" | "surface" | "tonal" | "ghost";
};

/** Bell icon button with an unread badge. Rings (wiggles) when the count goes up. */
export function NotificationButton({
  count = 0,
  onPress,
  variant = "surface",
}: Props) {
  const rotate = useSharedValue(0);
  const previous = useRef(count);

  useEffect(() => {
    if (count > previous.current) {
      // New notification → ring the bell
      rotate.value = withSequence(
        withTiming(-14, { duration: 70 }),
        withTiming(14, { duration: 90 }),
        withTiming(-10, { duration: 90 }),
        withTiming(8, { duration: 90 }),
        withTiming(0, { duration: 80 }),
      );
    }
    previous.current = count;
  }, [count, rotate]);

  // Rotate around the top (where a bell hangs) → origin shifted upward
  const ringAnim = useAnimatedStyle(() => ({
    transform: [
      { translateY: -8 },
      { rotate: `${rotate.value}deg` },
      { translateY: 8 },
    ],
  }));

  return (
    <Animated.View style={ringAnim}>
      <IconButton
        icon={count > 0 ? "notifications" : "notifications-outline"}
        variant={variant}
        badge={count}
        onPress={onPress}
        accessibilityLabel={
          count > 0 ? `Notifications, ${count} unread` : "Notifications"
        }
      />
    </Animated.View>
  );
}
