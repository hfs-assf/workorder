import { Image } from "expo-image";
import { useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { colorName } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { alpha } from "@/utils/color";

import { AppText } from "./AppText";
import { Row } from "./Stack";

type Size = "xs" | "sm" | "md" | "lg" | "xl";
const SIZE: Record<Size, number> = { xs: 24, sm: 32, md: 40, lg: 56, xl: 80 };

type Status = "online" | "busy" | "away" | "offline";
const STATUS_COLOR: Record<Status, colorName> = {
  online: "success",
  busy: "danger",
  away: "warning",
  offline: "textMuted",
};

/** Colors used for initials — picked from the theme so they follow the brand */
const AVATAR_COLORS: colorName[] = [
  "primary",
  "accent",
  "success",
  "warning",
  "danger",
];

/** "Budi Santoso" → "BS", "andi" → "A" */
export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/** Same name → always the same color (simple string hash) */
function colorFor(name: string): colorName {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

type Props = {
  name: string;
  /** Photo URL. Falls back to initials if missing or it fails to load */
  uri?: string | null;
  size?: Size;
  status?: Status;
  style?: StyleProp<ViewStyle>;
};

/** Profile photo, or colored initials when there's no photo. */
export function Avatar({ name, uri, size = "md", status, style }: Props) {
  const t = useTheme();
  const [failed, setFailed] = useState(false);
  const px = SIZE[size];
  const color = t.colors[colorFor(name)] ?? t.colors.primary;
  const showImage = !!uri && !failed;
  const dot = Math.max(8, px * 0.26);
  return (
    <View style={[{ width: px, height: px }, style]} accessibilityLabel={name}>
      <View
        style={{
          width: px,
          height: px,
          borderRadius: t.radius.pill,
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: alpha(color, 0.15),
        }}
      >
        {showImage ? (
          <Image
            source={{ uri }}
            style={{ width: px, height: px }}
            contentFit="cover"
            transition={200}
            onError={() => setFailed(true)}
          />
        ) : (
          <AppText
            style={[
              t.font("bold"),
              { color, fontSize: px * 0.38, lineHeight: px * 0.5 },
            ]}
          >
            {initials(name)}
          </AppText>
        )}
      </View>

      {status ? (
        <View
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: dot,
            height: dot,
            borderRadius: t.radius.pill,
            borderWidth: 2,
            borderColor: t.colors.surface, // ring that separates the dot from the photo
            backgroundColor: t.colors[STATUS_COLOR[status]],
          }}
        />
      ) : null}
    </View>
  );
}

type GroupProps = {
  people: { name: string; uri?: string | null }[];
  /** How many avatars to show before "+N". Default 3 */
  max?: number;
  size?: Size;
};

/** Overlapping avatars, e.g. everyone assigned to a work order. */
export function AvatarGroup({ people, max = 3, size = "sm" }: GroupProps) {
  const t = useTheme();
  const px = SIZE[size];
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  const ring = {
    borderWidth: 2,
    borderColor: t.colors.surface,
    borderRadius: t.radius.pill,
  };

  return (
    <Row gap={0}>
      {shown.map((p, i) => (
        <View
          key={p.name + i}
          style={[ring, { marginLeft: i === 0 ? 0 : -px * 0.3 }]}
        >
          <Avatar name={p.name} uri={p.uri} size={size} />
        </View>
      ))}
      {extra > 0 ? (
        <View
          style={[
            ring,
            {
              marginLeft: -px * 0.3,
              width: px + 4,
              height: px + 4,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: t.colors.surfaceMuted,
            },
          ]}
        >
          <AppText variant="caption" style={t.font("bold")} color="textMuted">
            +{extra}
          </AppText>
        </View>
      ) : null}
    </Row>
  );
}
