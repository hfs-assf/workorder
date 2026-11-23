import {
  Pressable,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { alpha } from "@/utils/color";

import { AppText } from "./AppText";
import { Icon, IconName } from "./Icon";
import { PressableScale } from "./PressableScale";
import { Option } from "./RadioGroup";
import { Row } from "./Stack";

// ---------- Single chip ----------

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
  /** Small number on the right, e.g. how many items match this filter */
  count?: number;
  /** Shows an ✕ — for removable tags (e.g. active filters) */
  onRemove?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Compact, pill-shaped toggle/tag. */
export function Chip({
  label,
  selected,
  onPress,
  icon,
  count,
  onRemove,
  disabled,
  style,
}: ChipProps) {
  const t = useTheme();
  const styles = useStyles();
  const fg = selected ? t.colors.onPrimary : t.colors.text;

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled || (!onPress && !onRemove)}
      haptic="select"
      scaleTo={0.95}
      accessibilityState={{ selected, disabled }}
      style={[
        styles.chip,
        selected && styles.chipSelected,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={14} tint={fg} /> : null}
      <AppText variant="label" style={{ color: fg }}>
        {label}
      </AppText>
      {count !== undefined ? (
        <View style={[styles.count, selected && styles.countSelected]}>
          <AppText
            variant="caption"
            style={[t.font("bold"), { color: fg, fontSize: 11 }]}
          >
            {count}
          </AppText>
        </View>
      ) : null}
      {onRemove ? (
        <Pressable
          onPress={onRemove}
          hitSlop={8}
          accessibilityLabel={`Remove ${label}`}
        >
          <Icon name="close" size={14} tint={fg} />
        </Pressable>
      ) : null}
    </PressableScale>
  );
}

// ---------- Group of chips (filters) ----------

type GroupBase<T extends string> = {
  options: (Option<T> & { count?: number })[];
  /** Horizontal scroll (filter bar) or wrap onto new lines (tags) */
  layout?: "scroll" | "wrap";
  style?: StyleProp<ViewStyle>;
};

type SingleProps<T extends string> = GroupBase<T> & {
  multiple?: false;
  value: T;
  onChange: (value: T) => void;
};

type MultiProps<T extends string> = GroupBase<T> & {
  multiple: true;
  value: T[];
  onChange: (value: T[]) => void;
};

/** A row of chips where one (or several, with `multiple`) can be selected. */
export function ChipGroup<T extends string>(
  props: SingleProps<T> | MultiProps<T>,
) {
  const styles = useStyles();
  const { options, layout = "scroll", style } = props;

  const isSelected = (v: T) =>
    props.multiple ? props.value.includes(v) : props.value === v;

  const press = (v: T) => {
    if (props.multiple) {
      const cur = props.value;
      props.onChange(
        cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v],
      );
    } else {
      props.onChange(v);
    }
  };

  const chips = options.map((o) => (
    <Animated.View
      key={o.value}
      layout={LinearTransition}
      entering={FadeIn}
      exiting={FadeOut}
    >
      <Chip
        label={o.label}
        icon={o.icon}
        count={o.count}
        disabled={o.disabled}
        selected={isSelected(o.value)}
        onPress={() => press(o.value)}
      />
    </Animated.View>
  ));

  if (layout === "wrap") {
    return (
      <Row wrap gap="sm" style={style}>
        {chips}
      </Row>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
      style={[styles.scrollOuter, style]}
    >
      {chips}
    </ScrollView>
  );
}

const useStyles = makeStyles((t) => ({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: t.spacing.xs + 2,
    height: t.controlHeight.sm,
    paddingHorizontal: t.spacing.md,
    borderRadius: t.radius.pill,
    borderWidth: 1,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
  chipSelected: {
    backgroundColor: t.colors.primary,
    borderColor: t.colors.primary,
    boxShadow: t.shadow.glow(t.colors.primary),
  },
  count: {
    minWidth: 20,
    paddingHorizontal: 6,
    height: 18,
    borderRadius: t.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: t.colors.surfaceMuted,
  },
  countSelected: { backgroundColor: alpha(t.colors.onPrimary, 0.25) },
  disabled: { opacity: 0.45 },
  // Negative margin + padding: chips scroll edge-to-edge but start aligned with the
  // screen content (matches Screen's padding = spacing.lg)
  scrollOuter: { marginHorizontal: -t.spacing.lg, flexGrow: 0 },
  scroll: {
    gap: t.spacing.sm,
    paddingHorizontal: t.spacing.lg,
    paddingVertical: t.spacing.xs,
  },
}));
