import { useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { alpha } from "@/utils/color";

import { ChoiceRow } from "./ChoiceRow";
import { Icon } from "./Icon";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  /** Partly selected (e.g. "select all" when only some items are checked) */
  indeterminate?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Checkbox({
  checked,
  onChange,
  label,
  description,
  indeterminate,
  disabled,
  style,
}: Props) {
  const t = useTheme();
  const styles = useStyles();
  const on = checked || !!indeterminate;

  // 0 = empty, 1 = filled → animates border/fill color and the check mark
  const progress = useSharedValue(on ? 1 : 0);
  useEffect(() => {
    progress.value = withTiming(on ? 1 : 0, { duration: 160 });
  }, [on, progress]);

  const { border, primary } = t.colors;
  const clear = alpha(primary, 0); // invisible primary → fades in without a gray flash
  const boxAnim = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [clear, primary]),
    borderColor: interpolateColor(progress.value, [0, 1], [border, primary]),
  }));
  const markAnim = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.4 + 0.6 * progress.value }], // grows from 40% to 100%
  }));

  return (
    <ChoiceRow
      onPress={() => onChange(!checked)}
      checked={checked}
      accessibilityRole="checkbox"
      label={label}
      description={description}
      disabled={disabled}
      style={style}
      control={
        <Animated.View style={[styles.box, boxAnim]}>
          <Animated.View style={markAnim}>
            <Icon
              name={indeterminate ? "remove" : "checkmark"}
              size={16}
              tint={t.colors.onPrimary}
            />
          </Animated.View>
        </Animated.View>
      }
    />
  );
}

const useStyles = makeStyles((t) => ({
  box: {
    width: 22,
    height: 22,
    borderRadius: t.radius.sm,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
}));
