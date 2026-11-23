import { Text, TextProps } from "react-native";

import { colorName } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type Variant = "title" | "heading" | "body" | "label" | "caption";

type Props = TextProps & {
  variant?: Variant;
  color?: colorName; // any color name from the theme
  align?: "left" | "center" | "right";
};

export function AppText({
  variant = "body",
  color = "text",
  align,
  style,
  ...rest
}: Props) {
  const t = useTheme();
  return (
    <Text
      style={[
        t.typography[variant],
        { color: t.colors[color], textAlign: align },
        style,
      ]}
      {...rest}
    />
  );
}
