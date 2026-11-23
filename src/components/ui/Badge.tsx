import { View } from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { alpha } from "@/utils/color";

import { AppText } from "./AppText";
import { Icon, IconName } from "./Icon";

export type BadgeTone =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "neutral";
type Variant = "soft" | "solid" | "outline";
type Size = "sm" | "md";

type Props = {
  label: string;
  tone?: BadgeTone;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  dot?: boolean; // small colored dot before the label (e.g. "● Online")
};

/** Small status pill. Generic: work order status, priority, roles, tags… */
export function Badge({
  label,
  tone = "neutral",
  variant = "soft",
  size = "md",
  icon,
  dot,
}: Props) {
  const t = useTheme();
  const base = tone === "neutral" ? t.colors.textMuted : t.colors[tone];
  const isSm = size === "sm";

  const bg = { soft: alpha(base, 0.12), solid: base, outline: "transparent" }[
    variant
  ];
  const fg = variant === "solid" ? t.colors.onPrimary : base;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: t.spacing.xs,
        paddingHorizontal: isSm ? t.spacing.sm - 2 : t.spacing.sm + 2,
        paddingVertical: isSm ? 2 : t.spacing.xs,
        borderRadius: t.radius.pill,
        backgroundColor: bg,
        borderWidth: variant === "outline" ? 1 : 0,
        borderColor: base,
      }}
    >
      {dot ? (
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: t.radius.pill,
            backgroundColor: fg,
          }}
        />
      ) : null}
      {icon ? <Icon name={icon} size={isSm ? 10 : 12} tint={fg} /> : null}
      <AppText
        variant="caption"
        style={[t.font("bold"), { color: fg, fontSize: isSm ? 10 : 12 }]}
      >
        {label}
      </AppText>
    </View>
  );
}
