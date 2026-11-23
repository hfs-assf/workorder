import { ReactNode, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

import { makeStyles } from "@/hooks/use-theme";

import { AppText } from "./AppText";
import { Icon } from "./Icon";

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Content pinned to the bottom (e.g. Save / Cancel buttons) */
  footer?: ReactNode;
  /** Max height as a fraction of the screen. Default 0.85 */
  maxHeight?: number;
};

const DURATION = 260;

/**
 * Panel that slides up from the bottom. Closes on: backdrop tap, ✕ button, Android back button.
 * Used by Select, filters, quick actions…
 */
export function BottomSheet({
  visible,
  onClose,
  title,
  children,
  footer,
  maxHeight = 0.85,
}: Props) {
  const styles = useStyles();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Keep the Modal mounted while the close animation runs
  const [mounted, setMounted] = useState(visible);
  const progress = useSharedValue(0); // 0 = hidden, 1 = open

  useEffect(() => {
    if (visible) {
      setMounted(true);
      progress.value = withTiming(1, {
        duration: DURATION,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      progress.value = withTiming(
        0,
        { duration: DURATION - 60, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (finished) scheduleOnRN(setMounted, false); // unmount after the slide-out finishes
        },
      );
    }
  }, [visible, progress]);

  const backdropAnim = useAnimatedStyle(() => ({ opacity: progress.value }));
  const sheetAnim = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * height }],
  }));

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose} // Android back button
    >
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.backdrop, backdropAnim]}
        >
          <Pressable
            style={styles.fill}
            onPress={onClose}
            accessibilityLabel="Close"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            { maxHeight: height * maxHeight, paddingBottom: insets.bottom + 8 },
            sheetAnim,
          ]}
        >
          <View style={styles.handle} />

          {title ? (
            <View style={styles.header}>
              <AppText variant="heading" style={styles.title}>
                {title}
              </AppText>
              <Pressable
                onPress={onClose}
                hitSlop={12}
                style={styles.close}
                accessibilityLabel="Close"
              >
                <Icon name="close" size={20} color="textMuted" />
              </Pressable>
            </View>
          ) : null}

          <View style={styles.body}>{children}</View>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const useStyles = makeStyles((t) => ({
  fill: { flex: 1, justifyContent: "flex-end" },
  backdrop: { backgroundColor: t.colors.overlay },
  sheet: {
    backgroundColor: t.colors.surface,
    borderTopLeftRadius: t.radius.lg + 8,
    borderTopRightRadius: t.radius.lg + 8,
    borderWidth: t.dark ? 1 : 0,
    borderColor: t.colors.border,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 5,
    borderRadius: t.radius.pill,
    backgroundColor: t.colors.border,
    marginTop: t.spacing.sm,
    marginBottom: t.spacing.xs,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: t.spacing.lg,
    paddingVertical: t.spacing.sm,
  },
  title: { flex: 1 },
  close: {
    width: 32,
    height: 32,
    borderRadius: t.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: t.colors.surfaceMuted,
  },
  body: { flexShrink: 1, paddingHorizontal: t.spacing.lg },
  footer: {
    paddingHorizontal: t.spacing.lg,
    paddingTop: t.spacing.md,
    gap: t.spacing.sm,
  },
}));
