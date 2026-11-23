import { ComponentProps, useEffect, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { alpha } from "@/utils/color";
import { haptic } from "@/utils/haptics";

import { FieldLabel, FieldMessage, fieldBox } from "./Field";
import { Icon, IconName } from "./Icon";

type Props = ComponentProps<typeof TextInput> & {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: IconName;
  clearable?: boolean; // show an ✕ button when there is text
};

export function AppInput({
  label,
  error,
  hint,
  leftIcon,
  clearable,
  secureTextEntry,
  editable = true,
  value,
  onChangeText,
  onFocus,
  onBlur,
  style,
  ref,
  ...rest
}: Props) {
  const t = useTheme();
  const styles = useStyles();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry);

  const focus = useSharedValue(0); // 0 = idle, 1 = focused
  const shakeX = useSharedValue(0); // horizontal offset for the error shake

  const { border, primary, danger } = t.colors;
  const fieldAnim = useAnimatedStyle(() => ({
    borderColor: error
      ? danger
      : interpolateColor(focus.value, [0, 1], [border, primary]),
    transform: [{ translateX: shakeX.value }],
  }));

  // Shake + error vibration whenever a new error message appears
  useEffect(() => {
    if (!error) return;
    haptic.error();
    shakeX.value = withSequence(
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 50 }),
      withTiming(-4, { duration: 50 }),
      withTiming(4, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );
  }, [error, shakeX]);

  const iconColor = error ? "danger" : focused ? "primary" : "textMuted";
  const showClear = clearable && !!value && editable;

  return (
    <View style={styles.wrapper}>
      <FieldLabel label={label} error={error} active={focused} />

      <Animated.View
        style={[
          styles.field,
          focused && !error && styles.focusRing,
          error && styles.errorRing,
          !editable && styles.disabled,
          fieldAnim,
        ]}
      >
        {leftIcon ? <Icon name={leftIcon} color={iconColor} /> : null}

        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          secureTextEntry={hidden}
          placeholderTextColor={t.colors.textMuted}
          selectionColor={t.colors.primary}
          style={[styles.input, style]}
          onFocus={(e) => {
            setFocused(true);
            focus.value = withTiming(1, { duration: 180 });
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            focus.value = withTiming(0, { duration: 180 });
            onBlur?.(e);
          }}
          {...rest}
        />

        {showClear ? (
          <Pressable
            onPress={() => onChangeText?.("")}
            hitSlop={10}
            accessibilityLabel="Clear text"
          >
            <Icon name="close-circle" size={18} color="textMuted" />
          </Pressable>
        ) : null}

        {secureTextEntry ? (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={10}
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
          >
            <Icon
              name={hidden ? "eye-off-outline" : "eye-outline"}
              color="textMuted"
            />
          </Pressable>
        ) : null}
      </Animated.View>

      <FieldMessage error={error} hint={hint} />
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  wrapper: { gap: t.spacing.xs + 2 },
  field: fieldBox(t),
  focusRing: { boxShadow: `0px 0px 0px 4px ${alpha(t.colors.primary, 0.15)}` },
  errorRing: { boxShadow: `0px 0px 0px 4px ${alpha(t.colors.danger, 0.12)}` },
  disabled: { backgroundColor: t.colors.surfaceMuted, opacity: 0.7 },
  input: {
    flex: 1,
    paddingVertical: t.spacing.sm,
    ...t.typography.body,
    color: t.colors.text,
  },
  helperRow: { flexDirection: "row", alignItems: "center", gap: t.spacing.xs },
}));
