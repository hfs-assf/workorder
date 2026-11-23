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
import { IconName } from "./Icon";
import { Row, Stack } from "./Stack";
export type Option<T extends string> = {
  value: T;
  label: string;
  icon?: IconName; // shown by Select
  description?: string;
  disabled?: boolean;
};

type Props<T extends string> = {
  options: Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
  direction?: "vertical" | "horizontal";
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** A list of options where exactly one can be selected. */
export function RadioGroup<T extends string>({
  options,
  value,
  onChange,
  direction = "vertical",
  disabled,
  style,
}: Props<T>) {
  const Container = direction === "horizontal" ? Row : Stack;
  return (
    <Container
      gap={direction === "horizontal" ? "lg" : "sm"}
      wrap={direction === "horizontal"}
      style={style}
    >
      {options.map((o) => (
        <ChoiceRow
          key={o.value}
          onPress={() => onChange(o.value)}
          checked={value === o.value}
          accessibilityRole="radio"
          label={o.label}
          description={o.description}
          disabled={disabled || o.disabled}
          control={<RadioCircle selected={value === o.value} />}
        />
      ))}
    </Container>
  );
}

function RadioCircle({ selected }: { selected: boolean }) {
  const t = useTheme();
  const styles = useStyles();
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(selected ? 1 : 0, {
      damping: 14,
      stiffness: 300,
    });
  }, [selected, progress]);

  const { border, primary } = t.colors;
  const ringAnim = useAnimatedStyle(() => ({
    borderColor: interpolateColor(progress.value, [0, 1], [border, primary]),
  }));
  const dotAnim = useAnimatedStyle(() => ({
    transform: [{ scale: progress.value }], // dot grows from 0 to full size
  }));

  return (
    <Animated.View style={[styles.ring, ringAnim]}>
      <Animated.View style={[styles.dot, dotAnim]} />
    </Animated.View>
  );
}

const useStyles = makeStyles((t) => ({
  ring: {
    width: 22,
    height: 22,
    borderRadius: t.radius.pill,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: t.radius.pill,
    backgroundColor: t.colors.primary,
  },
}));
