import { useEffect, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { makeStyles, useTheme } from "@/hooks/use-theme";

import { AppText } from "./AppText";
import { Icon } from "./Icon";
import { PressableScale } from "./PressableScale";
import { Option } from "./RadioGroup";

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
};

const PAD = 3; // space between the track edge and the sliding pill

/** 2–4 equal-width options in one bar, with a sliding highlight (e.g. List · Board, Today · Week). */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  style,
}: Props<T>) {
  const t = useTheme();
  const styles = useStyles();
  const [width, setWidth] = useState(0);

  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const segment = width > 0 ? (width - PAD * 2) / options.length : 0;

  const x = useSharedValue(0);
  useEffect(() => {
    x.value = withSpring(index * segment, { damping: 20, stiffness: 260 });
  }, [index, segment, x]);

  const pillAnim = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  return (
    <View
      style={[styles.track, style]}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      accessibilityRole="tablist"
    >
      {segment > 0 ? (
        <Animated.View style={[styles.pill, { width: segment }, pillAnim]} />
      ) : null}

      {options.map((o) => {
        const active = o.value === value;
        return (
          <PressableScale
            key={o.value}
            onPress={() => onChange(o.value)}
            disabled={o.disabled}
            haptic={active ? false : "select"}
            scaleTo={0.96}
            accessibilityRole="tab"
            accessibilityState={{ selected: active, disabled: o.disabled }}
            style={styles.segment}
          >
            {o.icon ? (
              <Icon
                name={o.icon}
                size={16}
                color={active ? "text" : "textMuted"}
              />
            ) : null}
            <AppText
              variant="label"
              color={active ? "text" : "textMuted"}
              style={active ? t.font("bold") : undefined}
              numberOfLines={1}
            >
              {o.label}
            </AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  track: {
    flexDirection: "row",
    height: t.controlHeight.md - 8,
    padding: PAD,
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.surfaceMuted,
  },
  pill: {
    position: "absolute",
    top: PAD,
    bottom: PAD,
    left: PAD,
    borderRadius: t.radius.lg - PAD,
    backgroundColor: t.colors.surface,
    boxShadow: t.shadow.control,
  },
  segment: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: t.spacing.xs + 2,
  },
}));
