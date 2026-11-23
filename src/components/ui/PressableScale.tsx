import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { haptic as haptics, HapticType } from "@/utils/haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const SPRING = { damping: 18, stiffness: 350 };

type Props = Omit<PressableProps, "style"> & {
  style?: StyleProp<ViewStyle>;
  /** How much it shrinks while pressed (0.96 = 4% smaller). Default 0.97 */
  scaleTo?: number;
  /** Vibration on press, or false for none. Default 'tap' */
  haptic?: HapticType | false;
};

/**
 * Pressable that shrinks slightly while pressed + vibrates on press.
 * The base for every tappable thing (buttons, cards, chips, list rows…).
 */
export function PressableScale({
  scaleTo = 0.97,
  haptic = "tap",
  onPress,
  onPressIn,
  onPressOut,
  style,
  ...rest
}: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      {...rest}
      onPress={(e) => {
        if (haptic) haptics[haptic]();
        onPress?.(e);
      }}
      onPressIn={(e) => {
        scale.value = withSpring(scaleTo, SPRING);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, SPRING);
        onPressOut?.(e);
      }}
      style={[style, animatedStyle]}
    />
  );
}
