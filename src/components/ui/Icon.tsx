import Ionicons from "@expo/vector-icons/Ionicons";
import { ComponentProps } from "react";

import { colorName } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

/** Every valid icon name (autocompletes in VS Code). Browse: https://icons.expo.fyi */
export type IconName = ComponentProps<typeof Ionicons>["name"];

type Props = {
  name: IconName;
  size?: number;
  /** Theme color name (preferred) … */
  color?: colorName;
  /** …or an exact color when it's computed (e.g. a variant's foreground) */
  tint?: string;
};

/** Themed icon. Swap the icon library here once, and the whole app follows. */
export function Icon({ name, size = 20, color = "text", tint }: Props) {
  const t = useTheme();
  return <Ionicons name={name} size={size} color={tint ?? t.colors[color]} />;
}
