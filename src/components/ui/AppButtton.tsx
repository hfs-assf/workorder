import { ActivityIndicator, StyleProp, View, ViewStyle } from "react-native";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { alpha } from "@/utils/color";

import { AppText } from "./AppText";
import { Icon, IconName } from "./Icon";
import { PressableScale } from "./PressableScale";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({
  title,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = true,
  haptic = true,
  style,
}: Props) {
  const t = useTheme();
  const styles = useStyles();
  const isDisabled = disabled || loading;

  const fg: Record<Variant, string> = {
    primary: t.colors.onPrimary,
    danger: t.colors.onPrimary,
    secondary: t.colors.primary,
    outline: t.colors.text,
    ghost: t.colors.primary,
  };
  const color = fg[variant];
  const iconEl = icon ? (
    <Icon name={icon} size={size === "sm" ? 16 : 18} tint={color} />
  ) : null;

  return (
    <PressableScale
      onPress={onPress}
      disabled={isDisabled}
      haptic={haptic ? "tap" : false}
      scaleTo={0.96}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[
        styles.base,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : styles.inline,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {/* Content stays in place while loading so the button doesn't change size */}
      <View style={[styles.content, loading && styles.hidden]}>
        {iconPosition === "left" && iconEl}
        <AppText
          variant={size === "sm" ? "label" : "body"}
          style={[styles.text, { color }]}
          numberOfLines={1}
        >
          {title}
        </AppText>
        {iconPosition === "right" && iconEl}
      </View>
      {loading ? (
        <ActivityIndicator color={color} style={styles.spinner} />
      ) : null}
    </PressableScale>
  );
}

const useStyles = makeStyles((t) => ({
  base: {
    borderRadius: t.radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  sm: { height: t.controlHeight.sm, paddingHorizontal: t.spacing.md },
  md: { height: t.controlHeight.md, paddingHorizontal: t.spacing.lg + 4 },
  lg: { height: t.controlHeight.lg, paddingHorizontal: t.spacing.xl },
  fullWidth: { alignSelf: "stretch" },
  inline: { alignSelf: "flex-start" },
  content: { flexDirection: "row", alignItems: "center", gap: t.spacing.sm },
  hidden: { opacity: 0 },
  spinner: { position: "absolute" },
  text: { ...t.font("semibold"), letterSpacing: 0.2 },

  primary: {
    backgroundColor: t.colors.primary,
    boxShadow: t.shadow.glow(t.colors.primary),
  },
  danger: {
    backgroundColor: t.colors.danger,
    boxShadow: t.shadow.glow(t.colors.danger),
  },
  secondary: { backgroundColor: alpha(t.colors.primary, 0.1) }, // "tonal" button
  outline: {
    borderWidth: 1,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
  ghost: { backgroundColor: "transparent" },
  disabled: { opacity: 0.45, boxShadow: "none" },
}));
