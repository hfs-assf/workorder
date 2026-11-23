/**
 * Font files + family names.
 * To use a different Google Font: install @expo-google-fonts/<name>,
 * import its weights here and add an entry to FONT_FAMILIES.
 */
// Import each weight from its own path → only these 5 files end up in the app
// (importing from '@expo-google-fonts/inter' directly would bundle ALL 18 styles).
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold";
import { Inter_800ExtraBold } from "@expo-google-fonts/inter/800ExtraBold";

import { brand } from "./brand";

export type FontWeightName =
  | "regular"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold";

/** Font files to load at app start (see app/_layout.tsx). Empty for the system font. */
export const FONT_FILES: Record<string, number> =
  brand.font === "inter"
    ? {
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        Inter_800ExtraBold,
      }
    : {};

/**
 * Custom fonts on Android need one font FILE per weight —
 * `fontWeight: '700'` alone does not work. So each weight maps to its own family name.
 */
const FONT_FAMILIES: Record<
  typeof brand.font,
  Record<FontWeightName, string> | null
> = {
  inter: {
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semibold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
    extrabold: "Inter_800ExtraBold",
  },
  system: null, // use the phone's font + fontWeight
};

export const fontFamilies = FONT_FAMILIES[brand.font];
