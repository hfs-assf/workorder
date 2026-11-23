import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { Icon, IconName, PressableScale } from "@/components/ui";
import { makeStyles, useTheme } from "@/hooks/use-theme";

type Props = {
  onPress: () => void;
  icon?: IconName;
  accessibilityLabel?: string;
  /** Lift the button above the bar (true) or keep it centered inside (false, default) */
  raised?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Round primary action in the middle of the tab bar. Spins its icon a quarter turn on press. */
export function CenterFab({
  onPress,
  icon = "add",
  accessibilityLabel = "Create",
  raised = false,
  style,
}: Props) {
  const t = useTheme();
  const styles = useStyles();
  const spin = useSharedValue(0);

  const iconAnim = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }],
  }));

  const handlePress = () => {
    // + turns 90° and springs back — a small "something is opening" cue
    spin.value = withSequence(
      withTiming(90, { duration: 160 }),
      withSpring(0, { damping: 12 }),
    );
    onPress();
  };

  return (
    <PressableScale
      onPress={handlePress}
      haptic="tap"
      scaleTo={0.9}
      accessibilityLabel={accessibilityLabel}
      style={[styles.fab, raised && styles.raised, style]}
    >
      <Animated.View style={iconAnim}>
        <Icon name={icon} size={t.layout.icon + 6} tint={t.colors.onPrimary} />
      </Animated.View>
    </PressableScale>
  );
}

const useStyles = makeStyles((t) => ({
  fab: {
    width: t.layout.fab,
    height: t.layout.fab,
    borderRadius: t.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: t.colors.primary,
    boxShadow: t.shadow.glow(t.colors.primary),
  },
  // Pops up out of the bar, with a ring in the background color so it looks "cut out"
  raised: {
    marginTop: -t.layout.fab / 2,
    borderWidth: 4,
    borderColor: t.colors.background,
  },
}));
