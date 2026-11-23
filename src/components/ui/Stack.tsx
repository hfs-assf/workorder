import { ReactNode } from "react";
import { StyleProp, View, ViewProps, ViewStyle } from "react-native";

import { spacing } from "@/constants/theme";

type Gap = keyof typeof spacing | 0;

type Props = ViewProps & {
  children?: ReactNode;
  /** Space between children, from the theme: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' */
  gap?: Gap;
  /** Cross-axis alignment (Stack: horizontal, Row: vertical) */
  align?: ViewStyle["alignItems"];
  /** Main-axis distribution, e.g. 'space-between' */
  justify?: ViewStyle["justifyContent"];
  /** Let children wrap onto the next line (chips, tags) */
  wrap?: boolean;
  /** Take all remaining space (flex: 1) */
  flex?: boolean;
  style?: StyleProp<ViewStyle>;
};

type LayoutOptions = Pick<Props, "gap" | "align" | "justify" | "wrap" | "flex">;

function layout(
  direction: "row" | "column",
  { gap, align, justify, wrap, flex }: LayoutOptions,
): ViewStyle {
  return {
    flexDirection: direction,
    gap: gap ? spacing[gap] : 0,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap ? "wrap" : undefined,
    flex: flex ? 1 : undefined,
  };
}

/** Vertical layout: children top → bottom with a theme gap. */
export function Stack({
  children,
  style,
  gap = "md",
  align,
  justify,
  wrap,
  flex,
  ...viewProps
}: Props) {
  return (
    <View
      style={[layout("column", { gap, align, justify, wrap, flex }), style]}
      {...viewProps}
    >
      {children}
    </View>
  );
}

/** Horizontal layout: children left → right, vertically centered by default. */
export function Row({
  children,
  style,
  gap = "sm",
  align = "center",
  justify,
  wrap,
  flex,
  ...viewProps
}: Props) {
  return (
    <View
      style={[layout("row", { gap, align, justify, wrap, flex }), style]}
      {...viewProps}
    >
      {children}
    </View>
  );
}

/** Pushes the next siblings to the far end of a Row/Stack. */
export function Spacer() {
  return <View style={{ flex: 1 }} />;
}
