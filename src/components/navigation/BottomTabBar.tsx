import { BlurView } from "expo-blur";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { AppText, BadgeCount, PressableScale } from "@/components/ui";
import { makeStyles, useTheme } from "@/hooks/use-theme";
import { alpha } from "@/utils/color";

import { CenterFab } from "./CenterFab";

type Props = BottomTabBarProps & {
  /** Center button action. Omit to hide the button. */
  onFabPress?: () => void;
  /** Lift the center button above the bar */
  fabRaised?: boolean;
};

/**
 * Floating pill-shaped tab bar with a center action button.
 * Reads each tab's `title`, `tabBarIcon` and `tabBarBadge` from (tabs)/_layout.tsx.
 */
export function BottomTabBar({
  state,
  descriptors,
  emitter,
  navigateToTab,
  insets,
  onFabPress,
  fabRaised,
}: Props) {
  const t = useTheme();
  const styles = useStyles();

  const routes = state.routes;
  const middle = Math.ceil(routes.length / 2); // FAB goes between the two halves

  const renderTab = (route: (typeof routes)[number], index: number) => {
    const { options } = descriptors[route.key];
    const focused = state.index === index;
    const label =
      typeof options.title === "string" ? options.title : route.name;
    const color = focused ? t.colors.primary : t.colors.textMuted;

    const onPress = () => {
      const event = emitter.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });
      if (!focused && !event.defaultPrevented) navigateToTab(route.key);
    };

    return (
      <TabItem
        key={route.key}
        label={label}
        focused={focused}
        badge={options.tabBarBadge}
        onPress={onPress}
        onLongPress={() =>
          emitter.emit({ type: "tabLongPress", target: route.key })
        }
        icon={options.tabBarIcon?.({ focused, color, size: t.layout.icon })}
      />
    );
  };

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.host,
        { paddingBottom: Math.max(insets.bottom, t.layout.tabBarGap) },
      ]}
    >
      <View style={styles.bar} accessibilityRole="tablist">
        {/* Frosted background, clipped to the pill (iOS blurs, Android uses a near-solid fill).
            The bar itself is NOT clipped, so a raised FAB can stick out above it. */}
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, styles.clip]}
        >
          {Platform.OS === "ios" && t.glass.enabled ? (
            <BlurView
              tint={t.glass.tint}
              intensity={60}
              style={StyleSheet.absoluteFill}
            />
          ) : null}
          <View style={[StyleSheet.absoluteFill, styles.fill]} />
        </View>

        {routes.slice(0, middle).map((r, i) => renderTab(r, i))}
        {onFabPress ? (
          <View style={styles.fabSlot}>
            <CenterFab onPress={onFabPress} raised={fabRaised} />
          </View>
        ) : null}
        {routes.slice(middle).map((r, i) => renderTab(r, i + middle))}
      </View>
    </View>
  );
}

// ---------- One tab ----------

type TabItemProps = {
  label: string;
  focused: boolean;
  icon: React.ReactNode;
  badge?: number | string;
  onPress: () => void;
  onLongPress: () => void;
};

function TabItem({
  label,
  focused,
  icon,
  badge,
  onPress,
  onLongPress,
}: TabItemProps) {
  const t = useTheme();
  const styles = useStyles();

  // Active tab: icon lifts slightly + small pill indicator appears
  const active = useSharedValue(focused ? 1 : 0);
  useEffect(() => {
    active.value = withSpring(focused ? 1 : 0, { damping: 16, stiffness: 220 });
  }, [focused, active]);

  const iconAnim = useAnimatedStyle(() => ({
    transform: [{ translateY: -2 * active.value }],
  }));
  const dotAnim = useAnimatedStyle(() => ({
    opacity: active.value,
    transform: [{ scaleX: active.value }],
  }));

  return (
    <PressableScale
      onPress={onPress}
      onLongPress={onLongPress}
      haptic={focused ? false : "select"}
      scaleTo={0.9}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      style={styles.tab}
    >
      <Animated.View style={iconAnim}>
        {icon}
        {badge !== undefined ? (
          <BadgeCount
            count={typeof badge === "number" ? badge : undefined}
            style={styles.badge}
          />
        ) : null}
      </Animated.View>
      <AppText
        variant="caption"
        numberOfLines={1}
        style={[
          focused ? t.font("semibold") : undefined,
          { color: focused ? t.colors.primary : t.colors.textMuted },
        ]}
      >
        {label}
      </AppText>
      <Animated.View style={[styles.indicator, dotAnim]} />
    </PressableScale>
  );
}

const useStyles = makeStyles((t) => ({
  // Full-width transparent layer at the bottom; the bar floats inside it
  host: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: t.layout.screenPadding,
  },
  bar: {
    height: t.layout.tabBarHeight,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: t.spacing.sm,
    borderRadius: t.radius.pill,
    overflow: "visible",
    borderWidth: 1,
    borderColor: t.glass.enabled ? t.colors.glassBorder : t.colors.border,
    boxShadow: t.dark
      ? `0px 12px 32px ${alpha("#000000", 0.5)}`
      : `0px 10px 30px ${alpha("#111827", 0.12)}`,
  },
  clip: { borderRadius: t.radius.pill, overflow: "hidden" },
  fill: {
    backgroundColor: alpha(t.colors.surface, t.glass.enabled ? 0.88 : 1),
  },
  tab: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  badge: { top: -6, right: -10 },
  indicator: {
    position: "absolute",
    bottom: 6,
    width: 16,
    height: 3,
    borderRadius: t.radius.pill,
    backgroundColor: t.colors.primary,
  },
  fabSlot: {
    width: t.layout.fab + t.spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
}));
