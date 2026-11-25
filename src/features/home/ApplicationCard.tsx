import {
  AppText,
  Badge,
  Card,
  Icon,
  Row,
  Spacer,
  StepProgress,
} from "@/components/ui";
import { daysFromToday, timeAgo } from "@/utils/date";

import { Application, APPLICATION_STEPS } from "./types";

/** Waiting longer than this many days → highlighted so the user can follow up */
const SLOW_AFTER_DAYS = 3;

type Props = {
  item: Application;
  onOpen: () => void;
};

/** Something I submitted: where it is in the process and who it's waiting for. */
export function ApplicationCard({ item, onOpen }: Props) {
  const waitingDays = -daysFromToday(item.submittedAt);
  const slow = waitingDays >= SLOW_AFTER_DAYS;

  return (
    <Card onPress={onOpen}>
      {/* 1. Type + id */}
      <Row>
        <AppText variant="label" color="textMuted">
          {item.type} · {item.id}
        </AppText>
        <Spacer />
        {slow ? (
          <Badge
            label={`Waiting ${waitingDays} days`}
            tone="warning"
            icon="time-outline"
            size="sm"
          />
        ) : null}
      </Row>

      {/* 2. What */}
      <AppText variant="heading">{item.title}</AppText>

      {/* 3. Where it is now */}
      <StepProgress steps={APPLICATION_STEPS} current={item.step} />

      {/* 4. Who has to act next */}
      <Row gap="xs">
        <Icon name="hourglass-outline" size={14} color="textMuted" />
        <AppText variant="caption" color="textMuted" style={{ flex: 1 }}>
          Waiting for {item.waitingFor.toLowerCase()} · sent{" "}
          {timeAgo(item.submittedAt).toLowerCase()}
        </AppText>
        <Icon name="chevron-forward" size={16} color="textMuted" />
      </Row>
    </Card>
  );
}
