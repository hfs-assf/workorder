/**
 * Shared pieces for every form field (AppInput, Select, DatePicker, TextArea…):
 * the label above, the message below, and the box style — so all fields look identical.
 */
import { View, ViewStyle } from "react-native";

import { Theme } from "@/constants/theme";
import { makeStyles } from "@/hooks/use-theme";
import { alpha } from "@/utils/color";

import { AppText } from "./AppText";
import { Icon, IconName } from "./Icon";
import { PressableScale } from "./PressableScale";

/** Box style for a field. Use inside makeStyles: `field: fieldBox(t)` */
export function fieldBox(t: Theme): ViewStyle {
  return {
    flexDirection: "row",
    alignItems: "center",
    gap: t.spacing.sm,
    minHeight: t.controlHeight.md,
    paddingHorizontal: t.spacing.md,
    borderWidth: 1.5,
    borderColor: t.colors.border,
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.surface,
  };
}

export function FieldLabel({
  label,
  error,
  active,
}: {
  label?: string;
  error?: string;
  active?: boolean;
}) {
  if (!label) return null;
  return (
    <AppText
      variant="label"
      color={error ? "danger" : active ? "primary" : "text"}
    >
      {label}
    </AppText>
  );
}

export function FieldMessage({
  error,
  hint,
}: {
  error?: string;
  hint?: string;
}) {
  const styles = useStyles();
  if (error) {
    return (
      <View style={styles.row}>
        <Icon name="alert-circle" size={14} color="danger" />
        <AppText variant="caption" color="danger">
          {error}
        </AppText>
      </View>
    );
  }
  if (hint)
    return (
      <AppText variant="caption" color="textMuted">
        {hint}
      </AppText>
    );
  return null;
}

type TriggerProps = {
  /** Text shown in the field (selected value) — or undefined to show the placeholder */
  valueText?: string;
  placeholder: string;
  icon?: IconName;
  /** Icon on the right: chevron-down for Select, calendar for DatePicker… */
  rightIcon?: IconName;
  onPress: () => void;
  active?: boolean;
  error?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
};

/**
 * A field that opens something when tapped (Select, DatePicker, TimePicker…).
 * Looks exactly like AppInput, but isn't typed into.
 */
export function FieldTrigger({
  valueText,
  placeholder,
  icon,
  rightIcon = "chevron-down",
  onPress,
  active,
  error,
  disabled,
  accessibilityLabel,
}: TriggerProps) {
  const styles = useStyles();
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      haptic="tap"
      scaleTo={0.99}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.field,
        active && styles.active,
        !!error && styles.error,
        disabled && styles.disabled,
      ]}
    >
      {icon ? (
        <Icon
          name={icon}
          color={error ? "danger" : active ? "primary" : "textMuted"}
        />
      ) : null}
      <AppText
        style={styles.valueText}
        color={valueText ? "text" : "textMuted"}
        numberOfLines={1}
      >
        {valueText ?? placeholder}
      </AppText>
      <Icon name={rightIcon} size={18} color="textMuted" />
    </PressableScale>
  );
}

const useStyles = makeStyles((t) => ({
  row: { flexDirection: "row", alignItems: "center", gap: t.spacing.xs },
  field: fieldBox(t),
  active: {
    borderColor: t.colors.primary,
    boxShadow: `0px 0px 0px 4px ${alpha(t.colors.primary, 0.15)}`,
  },
  error: { borderColor: t.colors.danger },
  disabled: { opacity: 0.5 },
  valueText: { flex: 1 },
}));
