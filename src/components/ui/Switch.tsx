import { useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { makeStyles, useTheme } from "@/hooks/use-theme";

import { ChoiceRow } from "./ChoiceRow";

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const TRACK_W = 50;
const TRACK_H = 30;
const THUMB = 24;
const TRAVEL = TRACK_W - THUMB - 6; // distance the thumb slides

/** On/off toggle for settings. The control sits on the RIGHT (settings-list style). */
export function Switch({
  value,
  onChange,
  label,
  description,
  disabled,
  style,
}: Props) {
  const t = useTheme();
  const styles = useStyles();
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, { damping: 18, stiffness: 260 });
  }, [value, progress]);

  const { border, primary } = t.colors;
  const trackAnim = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [border, primary],
    ),
  }));
  const thumbAnim = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * TRAVEL }],
  }));

  return (
    <ChoiceRow
      onPress={() => onChange(!value)}
      checked={value}
      accessibilityRole="switch"
      label={label}
      description={description}
      disabled={disabled}
      controlPosition="right"
      style={style}
      control={
        <Animated.View style={[styles.track, trackAnim]}>
          <Animated.View style={[styles.thumb, thumbAnim]} />
        </Animated.View>
      }
    />
  );
}

const useStyles = makeStyles((t) => ({
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: t.radius.pill,
    padding: 3,
    justifyContent: "center",
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: t.radius.pill,
    backgroundColor: t.colors.onPrimary,
    boxShadow: t.shadow.control,
  },
}));
