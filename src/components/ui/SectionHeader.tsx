import { StyleProp, ViewStyle } from "react-native";

import { AppText } from "./AppText";
import { Badge, BadgeTone } from "./Badge";
import { PressableScale } from "./PressableScale";
import { Row, Spacer, Stack } from "./Stack";

type Props = {
  title: string;
  /** Number shown next to the title (hidden when undefined or 0) */
  count?: number;
  countTone?: BadgeTone;
  /** Short helper line under the title */
  subtitle?: string;
  /** Link on the right, e.g. "See all" */
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Title row above a group of cards: "Pending acknowledge (3) ........ See all" */
export function SectionHeader({
  title,
  count,
  countTone = "primary",
  subtitle,
  actionLabel,
  onAction,
  style,
}: Props) {
  return (
    <Row align="flex-end" style={style}>
      <Stack gap="xs" style={{ flexShrink: 1 }}>
        <Row gap="sm">
          <AppText
            variant="heading"
            numberOfLines={1}
            style={{ flexShrink: 1 }}
          >
            {title}
          </AppText>
          {count ? (
            <Badge
              label={String(count)}
              tone={countTone}
              variant="solid"
              size="sm"
            />
          ) : null}
        </Row>
        {subtitle ? (
          <AppText variant="caption" color="textMuted">
            {subtitle}
          </AppText>
        ) : null}
      </Stack>
      <Spacer />
      {actionLabel && onAction ? (
        <PressableScale
          onPress={onAction}
          haptic="select"
          scaleTo={0.95}
          hitSlop={8}
        >
          <AppText variant="label" color="primary">
            {actionLabel}
          </AppText>
        </PressableScale>
      ) : null}
    </Row>
  );
}
