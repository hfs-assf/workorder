/**
 * ============================================================
 *  BRAND CONFIG — the ONLY file you need to edit to rebrand.
 *  Everything in theme.ts is generated from these choices.
 * ============================================================
 */
export const brand = {
  /** App name (used in headers, login screen, etc.) */
  name: "Inventory",

  /** Brand colors: a light-mode and a dark-mode value each */
  colors: {
    primary: { light: "#1E6FD9", dark: "#4C8EF0" }, // buttons, links, active states
    accent: { light: "#A855F7", dark: "#C084FC" }, // 2nd background glow, highlights
    accent2: { light: "#10B981", dark: "#34D399" }, // 3rd background glow
  },

  /** Font: 'inter' (modern, loaded from Google Fonts) · 'system' (phone's default font) */
  font: "inter" as "inter" | "system",

  /** Corner style: 'sharp' (business) · 'rounded' (default) · 'soft' (playful) */
  roundness: "rounded" as "sharp" | "rounded" | "soft",

  /** Spacing + control sizes: 'comfortable' (default) · 'compact' (dense data apps) */
  density: "comfortable" as "comfortable" | "compact",

  /** Glass effect strength: 'off' (solid) · 'subtle' · 'strong' */
  glass: "subtle" as "off" | "subtle" | "strong",

  /** Default look of <Card> when no variant is given: 'glass' (frosted) · 'elevated' (solid) */
  cardStyle: "glass" as "glass" | "elevated",
};
