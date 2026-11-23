import { useEffect, useSyncExternalStore } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeOutUp,
  LinearTransition,
  SlideInUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colorName } from "@/constants/theme";
import { makeStyles, useTheme } from "@/hooks/use-theme";
import { alpha } from "@/utils/color";
import { haptic } from "@/utils/haptics";

import { AppText } from "./AppText";
import { GlassView } from "./GlassView";
import { Icon, IconName } from "./Icon";

// ============================================================
//  Store: a tiny global list of toasts.
//  Lives outside React → `toast.success()` works from ANY file
//  (screens, hooks, API helpers), no provider or hook needed.
// ============================================================

type ToastType = "success" | "error" | "warning" | "info";

type ToastItem = {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
  duration: number;
  action?: { label: string; onPress: () => void };
};

type ToastOptions = Partial<Pick<ToastItem, "message" | "duration" | "action">>;

let toasts: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function show(type: ToastType, title: string, opts: ToastOptions = {}) {
  const item: ToastItem = {
    id: nextId++,
    type,
    title,
    duration: 3000,
    ...opts,
  };
  toasts = [...toasts, item].slice(-3); // keep at most 3 on screen
  emit();
  if (type === "error") haptic.error();
  else if (type === "success") haptic.success();
  else if (type === "warning") haptic.warning();
  return item.id;
}

function dismiss(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

/** Show a toast from anywhere: toast.success('Saved'), toast.error('Upload failed', { message: '…' }) */
export const toast = {
  success: (title: string, opts?: ToastOptions) => show("success", title, opts),
  error: (title: string, opts?: ToastOptions) => show("error", title, opts),
  warning: (title: string, opts?: ToastOptions) => show("warning", title, opts),
  info: (title: string, opts?: ToastOptions) => show("info", title, opts),
  dismiss,
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => toasts;

// ============================================================
//  UI: render <Toaster /> ONCE in app/_layout.tsx
// ============================================================

const META: Record<ToastType, { icon: IconName; color: colorName }> = {
  success: { icon: "checkmark-circle", color: "success" },
  error: { icon: "close-circle", color: "danger" },
  warning: { icon: "warning", color: "warning" },
  info: { icon: "information-circle", color: "primary" },
};

export function Toaster() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const insets = useSafeAreaInsets();
  const styles = useStyles();

  return (
    <View
      pointerEvents="box-none"
      style={[
        StyleSheet.absoluteFill,
        styles.host,
        { paddingTop: insets.top + 8 },
      ]}
    >
      {items.map((item) => (
        <ToastCard key={item.id} item={item} />
      ))}
    </View>
  );
}

function ToastCard({ item }: { item: ToastItem }) {
  const t = useTheme();
  const styles = useStyles();
  const meta = META[item.type];
  const color = t.colors[meta.color] ?? t.colors.primary;

  // Auto-dismiss
  useEffect(() => {
    const timer = setTimeout(() => dismiss(item.id), item.duration);
    return () => clearTimeout(timer);
  }, [item.id, item.duration]);

  return (
    <Animated.View
      entering={SlideInUp.springify().damping(18)}
      exiting={FadeOutUp.duration(200)}
      layout={LinearTransition}
      style={styles.wrap}
    >
      <Pressable
        onPress={() => dismiss(item.id)}
        accessibilityRole="alert"
        accessibilityLabel={item.title}
      >
        <GlassView
          style={[
            styles.card,
            { boxShadow: `0px 10px 30px ${alpha(color, 0.25)}` },
          ]}
        >
          {/* Colored strip on the left */}
          <View style={[styles.strip, { backgroundColor: color }]} />
          <Icon name={meta.icon} size={22} tint={color} />
          <View style={styles.texts}>
            <AppText variant="label" style={styles.title}>
              {item.title}
            </AppText>
            {item.message ? (
              <AppText variant="caption" color="textMuted">
                {item.message}
              </AppText>
            ) : null}
          </View>
          {item.action ? (
            <Pressable
              onPress={() => {
                item.action!.onPress();
                dismiss(item.id);
              }}
              hitSlop={8}
              style={styles.action}
            >
              <AppText variant="label" color="primary">
                {item.action.label}
              </AppText>
            </Pressable>
          ) : null}
        </GlassView>
      </Pressable>
    </Animated.View>
  );
}

const useStyles = makeStyles((t) => ({
  host: {
    alignItems: "center",
    gap: t.spacing.sm,
    paddingHorizontal: t.spacing.lg,
    zIndex: 1000,
  },
  wrap: { width: "100%", maxWidth: 480 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: t.spacing.md,
    paddingVertical: t.spacing.md,
    paddingLeft: t.spacing.lg,
    paddingRight: t.spacing.md,
    borderRadius: t.radius.lg,
    // Solid fallback under the glass so text stays readable over busy screens
    backgroundColor: alpha(t.colors.surface, t.glass.enabled ? 0.75 : 1),
  },
  strip: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4 },
  texts: { flex: 1, gap: 2 },
  title: { fontSize: t.typography.body.fontSize },
  action: { paddingHorizontal: t.spacing.sm, paddingVertical: t.spacing.xs },
}));
