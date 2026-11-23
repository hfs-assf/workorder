import { StyleProp, View, ViewStyle } from "react-native";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { alpha } from "@/utils/color";

import { AppText } from "./AppText";
import { GlassBackdrop } from "./GlassView";
import { Icon, IconName } from "./Icon";
import { PressableScale } from "./PressableScale";

type Variant = "glass" | "surface" | "tonal" | "ghost";

type Props = {
  icon: IconName;
  onPress: () => void;
  /** Required for screen readers, since there's no visible text */
  accessibilityLabel: string;
  variant?: Variant;
  /** Diameter. Defaults to the theme's layout.iconButton */
  size?: number;
  /** Number badge (e.g. unread count). 0 or undefined = hidden. */
  badge?: number;
  /** Small dot instead of a number */
  dot?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Round button with only an icon (header actions, toolbars, close buttons…). */
export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  variant = "surface",
  size,
  badge,
  dot,
  disabled,
  style,
}: Props) {
  const t = useTheme();
  const styles = useStyles();
  const d = size ?? t.layout.iconButton;

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      haptic="tap"
      scaleTo={0.9}
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      style={[
        styles.base,
        styles[variant],
        { width: d, height: d },
        disabled && styles.disabled,
        style,
      ]}
    >
      {variant === "glass" ? <GlassBackdrop /> : null}
      <Icon
        name={icon}
        size={t.layout.icon}
        color={variant === "tonal" ? "primary" : "text"}
      />
      {badge || dot ? <BadgeCount count={dot ? undefined : badge} /> : null}
    </PressableScale>
  );
}

/** Red counter / dot pinned to the top-right corner. Exported so tabs can reuse it. */
export function BadgeCount({
  count,
  style,
}: {
  count?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const styles = useStyles();
  const label = count === undefined ? "" : count > 99 ? "99+" : String(count);
  return (
    <View
      style={[styles.badge, !label && styles.badgeDot, style]}
      pointerEvents="none"
    >
      {label ? (
        <AppText variant="caption" style={styles.badgeText}>
          {label}
        </AppText>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  base: {
    borderRadius: t.radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  glass: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: t.colors.glassBorder,
  },
  surface: {
    backgroundColor: t.colors.surface,
    borderWidth: 1,
    borderColor: t.colors.border,
    boxShadow: t.shadow.card,
  },
  tonal: { backgroundColor: alpha(t.colors.primary, 0.1) },
  ghost: { backgroundColor: "transparent" },
  disabled: { opacity: 0.45 },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: t.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: t.colors.danger,
    borderWidth: 2,
    borderColor: t.colors.background, // ring so it "cuts out" from the button
  },
  badgeDot: {
    minWidth: 12,
    width: 12,
    height: 12,
    top: 2,
    right: 2,
    paddingHorizontal: 0,
  },
  badgeText: {
    ...t.font("bold"),
    fontSize: 10,
    lineHeight: 12,
    color: t.colors.onPrimary,
  },
}));
