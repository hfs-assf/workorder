import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { makeStyles } from "@/hooks/use-theme";

import { AppText } from "./AppText";
import { PressableScale } from "./PressableScale";

type Props = {
  control: ReactNode; // the box / circle / switch
  label?: string;
  description?: string;
  controlPosition?: "left" | "right";
  disabled?: boolean;
  onPress: () => void;
  accessibilityRole: "checkbox" | "radio" | "switch";
  checked: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Shared layout for Checkbox, Radio and Switch:
 * the whole row (control + label + description) is tappable — bigger touch target.
 */
export function ChoiceRow({
  control,
  label,
  description,
  controlPosition = "left",
  disabled,
  onPress,
  accessibilityRole,
  checked,
  style,
}: Props) {
  const styles = useStyles();

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      haptic="select"
      scaleTo={0.98}
      accessibilityRole={accessibilityRole}
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={label}
      style={[
        styles.row,
        controlPosition === "right" && styles.reverse,
        disabled && styles.disabled,
        style,
      ]}
    >
      {control}
      {label || description ? (
        <View style={styles.texts}>
          {label ? <AppText>{label}</AppText> : null}
          {description ? (
            <AppText variant="caption" color="textMuted">
              {description}
            </AppText>
          ) : null}
        </View>
      ) : null}
    </PressableScale>
  );
}

const useStyles = makeStyles((t) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: t.spacing.md,
    paddingVertical: t.spacing.xs,
  },
  reverse: { flexDirection: "row-reverse" },
  texts: { flex: 1, gap: 2 },
  disabled: { opacity: 0.45 },
}));
