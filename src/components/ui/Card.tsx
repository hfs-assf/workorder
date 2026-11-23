import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { makeStyles, useTheme } from "@/hooks/use-theme";

import { GlassBackdrop } from "./GlassView";
import { PressableScale } from "./PressableScale";

type Variant = "elevated" | "outlined" | "filled" | "glass";
type Padding = "none" | "sm" | "md" | "lg";

type Props = {
  children: ReactNode;
  variant?: Variant;
  padding?: Padding;
  onPress?: () => void; // makes the card tappable
  onLongPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Card({
  children,
  variant: variantProp,
  padding = "md",
  onPress,
  onLongPress,
  disabled,
  style,
}: Props) {
  const t = useTheme();
  const styles = useStyles();
  const variant = variantProp ?? t.cardVariant;
  const cardStyle = [
    styles.base,
    styles[variant],
    styles[`pad_${padding}`],
    style,
  ];
  const content = (
    <>
      {variant === "glass" ? <GlassBackdrop /> : null}
      {children}
    </>
  );

  // Not tappable → plain View (cheaper, no touch handling)
  if (!onPress && !onLongPress) return <View style={cardStyle}>{content}</View>;

  return (
    <PressableScale
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      haptic="select"
      scaleTo={0.98}
      style={[cardStyle, disabled && styles.disabled]}
    >
      {content}
    </PressableScale>
  );
}

/** Horizontal row inside a card: left content + right content, vertically centered. */
export function CardRow({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const styles = useStyles();
  return <View style={[styles.row, style]}>{children}</View>;
}

/** Thin separator line inside a card. */
export function CardDivider() {
  const styles = useStyles();
  return <View style={styles.divider} />;
}

const useStyles = makeStyles((t) => ({
  base: { borderRadius: t.radius.lg + 4, gap: t.spacing.sm },
  elevated: {
    backgroundColor: t.colors.surface,
    boxShadow: t.shadow.card,
    borderWidth: t.dark ? 1 : 0, // dark mode: border instead of shadow
    borderColor: t.colors.border,
  },
  outlined: {
    backgroundColor: t.colors.surface,
    borderWidth: 1,
    borderColor: t.colors.border,
  },
  filled: { backgroundColor: t.colors.surfaceMuted },
  glass: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: t.colors.glassBorder,
    boxShadow: t.shadow.glass,
  },

  pad_none: { padding: 0 },
  pad_sm: { padding: t.spacing.md },
  pad_md: { padding: t.spacing.lg },
  pad_lg: { padding: t.spacing.xl },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: t.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: t.colors.border,
    marginVertical: t.spacing.xs,
  },
  disabled: { opacity: 0.5 },
}));
