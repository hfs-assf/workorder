/**
 * Theme = design tokens generated from brand.ts.
 * Components read ONLY from here (via useTheme / makeStyles), never hard-coded values.
 * You normally don't edit this file — edit brand.ts instead.
 */
import type { BlurTint } from "expo-blur";
import { Platform, type TextStyle } from "react-native";

import { alpha } from "@/utils/color";

import { brand } from "./brand";
import { fontFamilies, FontWeightName } from "./fonts";

type Mode = "light" | "dark";

// ---------- Scales chosen by brand settings ----------

const RADIUS = {
  sharp: { sm: 4, md: 6, lg: 8 },
  rounded: { sm: 6, md: 10, lg: 16 },
  soft: { sm: 8, md: 14, lg: 22 },
}[brand.roundness];

export const radius = { ...RADIUS, pill: 999 } as const;

export const spacing = (
  brand.density === "compact"
    ? { xs: 4, sm: 6, md: 10, lg: 14, xl: 20, xxl: 28 }
    : { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 }
) as {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
};

/** Height of buttons and inputs, so all controls line up. */
export const controlHeight =
  brand.density === "compact"
    ? { sm: 32, md: 42, lg: 50 }
    : { sm: 36, md: 48, lg: 56 };

/**
 * Shared layout sizes for the app "chrome" (header, tab bar, FAB).
 * Header and bottom bar both read from here → they always stay consistent.
 */
export const layout = {
  /** Left/right padding of screens, header and floating tab bar */
  screenPadding: spacing.lg,
  /** Round icon buttons (header actions, tab icons hit area) */
  iconButton: controlHeight.md - 4,
  /** Icon size used in header + tab bar */
  icon: 22,
  /** Header row height (below the status bar) */
  headerHeight: 64,
  /** Floating tab bar */
  tabBarHeight: 68,
  tabBarGap: spacing.md, // space between the bar and the bottom edge / home indicator
  /** Center action button */
  fab: 60,
};

// ---------- Fonts ----------

const WEIGHT_NUMBER: Record<FontWeightName, TextStyle["fontWeight"]> = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
};

/**
 * Style for a font weight that works with BOTH custom and system fonts.
 * Use this instead of writing fontWeight: '600' in components:
 *   style={[styles.text, t.font('semibold')]}
 */
export function font(weight: FontWeightName): TextStyle {
  return fontFamilies
    ? { fontFamily: fontFamilies[weight] }
    : { fontWeight: WEIGHT_NUMBER[weight] };
}

const typography = {
  title: {
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
    ...font("extrabold"),
  },
  heading: {
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.3,
    ...font("bold"),
  },
  body: { fontSize: 15, lineHeight: 22, ...font("regular") },
  label: { fontSize: 13, lineHeight: 18, ...font("semibold") },
  caption: { fontSize: 12, lineHeight: 16, ...font("regular") },
} satisfies Record<string, TextStyle>;

// ---------- Colors ----------

function buildColors(mode: Mode) {
  const dark = mode === "dark";
  const primary = brand.colors.primary[mode];

  const base = dark
    ? {
        background: "#0B0F14",
        surface: "#161B22",
        surfaceMuted: "#1F2630",
        border: "#2A323D",
        text: "#F3F4F6",
        textMuted: "#9CA3AF",
        danger: "#F87171",
        success: "#34D399",
        warning: "#FBBF24",
        skeleton: dark ? alpha("#FFFFFF", 0.08) : alpha("#111827", 0.08),
        overlay: alpha("#000000", dark ? 0.6 : 0.4),
      }
    : {
        background: "#F5F7FA",
        surface: "#FFFFFF",
        surfaceMuted: "#EEF1F5",
        border: "#E3E8EF",
        text: "#111827",
        textMuted: "#6B7280",
        danger: "#DC2626",
        success: "#059669",
        warning: "#D97706",
      };

  // Glass fill / edge depend on the glass strength
  const glassFill = {
    off: base.surface,
    subtle: dark ? alpha("#FFFFFF", 0.06) : alpha("#FFFFFF", 0.55),
    strong: dark ? alpha("#FFFFFF", 0.04) : alpha("#FFFFFF", 0.35),
  }[brand.glass];

  const glassBorder =
    brand.glass === "off"
      ? base.border
      : dark
        ? alpha("#FFFFFF", 0.12)
        : alpha("#FFFFFF", 0.85);

  return {
    ...base,
    primary,
    onPrimary: "#FFFFFF",
    accent: brand.colors.accent[mode],
    glass: glassFill,
    glassBorder,
    skeleton: dark ? alpha("#FFFFFF", 0.08) : alpha("#111827", 0.08),
  };
}

// ---------- Shadows ----------

function buildShadow(mode: Mode) {
  const dark = mode === "dark";
  return {
    /** Soft card shadow (none in dark mode — borders read better there) */
    card: dark ? "none" : `0px 4px 20px ${alpha("#111827", 0.06)}`,
    glass: dark ? "none" : `0px 8px 32px ${alpha("#1F2687", 0.1)}`,
    /** Small lift for knobs/thumbs (switch thumb, slider handle) */
    control: `0px 2px 4px ${alpha("#000000", dark ? 0.4 : 0.2)}`,
    /** Colored glow under a button/icon: shadow.glow(t.colors.primary) */
    glow: (color: string) => `0px 6px 16px ${alpha(color, 0.25)}`,
  };
}

// ---------- Glass (background glows + blur) ----------

function buildGlass(mode: Mode) {
  const dark = mode === "dark";
  const c = brand.colors;
  const strength = { off: 0, subtle: 1, strong: 1.4 }[brand.glass];

  const glow = (hex: string, opacity: number, pos: string, size: number) =>
    `radial-gradient(circle at ${pos}, ${alpha(hex, opacity * strength)} 0%, transparent ${size}%)`;

  return {
    tint: (dark ? "dark" : "light") as BlurTint,
    sheen:
      brand.glass === "off"
        ? undefined
        : `linear-gradient(180deg, ${alpha("#FFFFFF", dark ? 0.1 : 0.5)} 0%, ${alpha("#FFFFFF", 0)} 55%)`,
    intensity: brand.glass === "strong" ? 60 : 40,
    enabled: brand.glass !== "off",
    // Glows are built from YOUR brand colors → change primary, glows follow.
    backgroundImage:
      brand.glass === "off"
        ? undefined
        : [
            glow(c.primary[mode], dark ? 0.28 : 0.22, "0% 0%", 55),
            glow(c.accent[mode], dark ? 0.2 : 0.16, "100% 35%", 50),
            glow(c.accent2[mode], dark ? 0.12 : 0.14, "20% 100%", 50),
          ].join(", "),
  };
}

// ---------- Assemble ----------

function buildTheme(mode: Mode) {
  return {
    dark: mode === "dark",
    colors: buildColors(mode),
    spacing,
    radius,
    controlHeight,
    layout,
    cardVariant: brand.cardStyle,
    typography,
    font,
    shadow: buildShadow(mode),
    glass: buildGlass(mode),
  };
}

export type Theme = ReturnType<typeof buildTheme>;
export type ThemeColors = Theme["colors"];
export type colorName = keyof ThemeColors;
export type GlassTokens = Theme["glass"];
export type ThemeColor = colorName;

// Built once → stable object identity (important for memoized styles)
export const lightTheme: Theme = buildTheme("light");
export const darkTheme: Theme = buildTheme("dark");

// ---- paste your template block here (global.css import, Fonts, Spacing, BottomTabInset, MaxContentWidth) ----
export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
});

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
