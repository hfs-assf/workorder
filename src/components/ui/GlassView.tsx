import { BlurView } from "expo-blur";
import { ReactNode } from "react";
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { useTheme } from "@/hooks/use-theme";

/**
 * The frosted layer only (no padding, no layout).
 * Put it as the FIRST child of a container that has overflow: 'hidden' + a borderRadius.
 *  - iOS:     real blur + light tint
 *  - Android: translucent fill only
 */
export function GlassBackdrop() {
  const t = useTheme();
  return (
    <>
      {Platform.OS === "ios" && t.glass.enabled ? (
        <BlurView
          tint={t.glass.tint}
          intensity={t.glass.intensity}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: t.colors.glass }]}
      />
      {/* Sheen: soft highlight fading down from the top edge */}
      {t.glass.sheen ? (
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { backgroundImage: t.glass.sheen }]}
        />
      ) : null}
    </>
  );
}

type Props = {
  children?: ReactNode;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

/** A ready-made glass panel: frosted fill + bright edge + rounded corners. */
export function GlassView({ children, radius, style }: Props) {
  const t = useTheme();
  return (
    <View
      style={[
        {
          overflow: "hidden",
          borderRadius: radius ?? t.radius.lg + 4,
          borderWidth: 1,
          borderColor: t.colors.glassBorder,
        },
        style,
      ]}
    >
      <GlassBackdrop />
      {children}
    </View>
  );
}
