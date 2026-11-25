import {
  AppButton,
  AppText,
  Avatar,
  Badge,
  BadgeTone,
  Card,
  Icon,
  Row,
  Spacer,
  Stack,
} from "@/components/ui";
import { daysFromToday, formatRelative, timeAgo } from "@/utils/date";

import { PendingAck, Priority } from "./types";

const PRIORITY: Record<Priority, { label: string; tone: BadgeTone }> = {
  low: { label: "Low", tone: "neutral" },
  medium: { label: "Medium", tone: "primary" },
  high: { label: "High", tone: "warning" },
  urgent: { label: "Urgent", tone: "danger" },
};

type Props = {
  item: PendingAck;
  onAcknowledge: () => void;
  onOpen: () => void;
};

/** A new assignment: what, where, who sent it, when it's due → one clear "Acknowledge" button. */
export function PendingAckCard({ item, onAcknowledge, onOpen }: Props) {
  const priority = PRIORITY[item.priority];
  const dueIn = daysFromToday(item.dueAt);
  const dueColor = dueIn < 0 ? "danger" : dueIn === 0 ? "warning" : "textMuted";

  return (
    <Card onPress={onOpen}>
      {/* 1. Code + priority */}
      <Row>
        <AppText variant="label" color="textMuted">
          {item.id}
        </AppText>
        <Spacer />
        <Badge label={priority.label} tone={priority.tone} dot />
      </Row>

      {/* 2. What and where */}
      <Stack gap="xs">
        <AppText variant="heading">{item.title}</AppText>
        <Row gap="xs">
          <Icon name="location-outline" size={14} color="textMuted" />
          <AppText variant="caption" color="textMuted">
            {item.location}
          </AppText>
        </Row>
      </Stack>

      {/* 3. Who sent it + due date */}
      <Row>
        <Avatar name={item.assignedBy} size="xs" />
        <AppText
          variant="caption"
          color="textMuted"
          numberOfLines={1}
          style={{ flexShrink: 1 }}
        >
          {item.assignedBy} · {timeAgo(item.assignedAt)}
        </AppText>
        <Spacer />
        <Icon name="calendar-outline" size={14} color={dueColor} />
        <AppText variant="caption" color={dueColor}>
          Due {formatRelative(item.dueAt).toLowerCase()}
        </AppText>
      </Row>

      {/* 4. The one action */}
      <Row gap="sm">
        <AppButton
          title="View"
          variant="outline"
          size="sm"
          fullWidth={false}
          style={{ flex: 1 }}
          onPress={onOpen}
        />
        <AppButton
          title="Acknowledge"
          icon="checkmark"
          size="sm"
          fullWidth={false}
          style={{ flex: 2 }}
          onPress={onAcknowledge}
        />
      </Row>
    </Card>
  );
}
