import { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import {
  Edge,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { makeStyles, useTheme } from "@/hooks/use-theme";

type Props = {
  children: ReactNode;
  scroll?: boolean; // wrap content in a ScrollView (forms, long pages)
  padded?: boolean; // default padding around content
  edges?: Edge[]; // which sides avoid the notch / home bar
  background?: "glow" | "plain"; // ← FIX 2: 'glow' = soft color glows behind glass components
  /** Fixed header above the content (e.g. <AppHeader />). Shares the same background. */
  header?: ReactNode;
  /** Screen sits above the floating tab bar → adds bottom space so content isn't hidden behind it */
  tabBar?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Base wrapper for every screen: background, safe area, keyboard handling, header, tab bar space. */
export function Screen({
  children,
  scroll,
  padded = true,
  edges = ["top", "bottom"],
  background = "glow",
  header,
  tabBar,
  style,
}: Props) {
  const t = useTheme();
  const styles = useStyles();
  const insets = useSafeAreaInsets();

  // Space taken by the floating bar: bar height + gap under it + home-indicator area
  const tabBarSpace = tabBar
    ? t.layout.tabBarHeight +
      Math.max(insets.bottom, t.layout.tabBarGap) +
      t.spacing.lg
    : 0;

  const contentStyle = [
    padded && styles.padded,
    style,
    tabBar && { paddingBottom: tabBarSpace },
  ];

  // A header handles the top safe area itself; the tab bar handles the bottom one
  const safeEdges = edges.filter(
    (e) => !(header && e === "top") && !(tabBar && e === "bottom"),
  );

  return (
    <SafeAreaView
      style={[styles.safe, background === "glow" && styles.glow]} // ← FIX 3
      edges={safeEdges}
    >
      {
        header /* ← FIX 1: header sits above the content, on the same background */
      }
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {scroll ? (
          <ScrollView
            contentContainerStyle={[styles.grow, contentStyle]}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.flex, contentStyle]}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const useStyles = makeStyles((t) => ({
  safe: { flex: 1, backgroundColor: t.colors.background },
  glow: { backgroundImage: t.glass.backgroundImage }, // ← FIX 3
  flex: { flex: 1 },
  grow: { flexGrow: 1 },
  padded: { padding: t.spacing.lg },
}));
