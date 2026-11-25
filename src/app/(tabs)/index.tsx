import { router } from "expo-router";
import { useState } from "react";
import Animated, { FadeOut, LinearTransition } from "react-native-reanimated";

import { AppHeader } from "@/components/navigation";
import {
  AppText,
  Card,
  Icon,
  IconName,
  Row,
  Screen,
  SectionHeader,
  Stack,
  StateView,
  toast,
} from "@/components/ui";
import { colorName } from "@/constants/theme";
import {
  Application,
  ApplicationCard,
  APPLICATIONS,
  PENDING_ACKS,
  PendingAck,
  PendingAckCard,
} from "@/features/home";

// ─────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────

export default function HomeScreen() {
  const [pending, setPending] = useState<PendingAck[]>(PENDING_ACKS);
  const [applications] = useState<Application[]>(APPLICATIONS);

  const acknowledge = (item: PendingAck) => {
    setPending((list) => list.filter((p) => p.id !== item.id));
    toast.success("Acknowledged", {
      message: `${item.id} is now in your work orders.`,
      action: {
        label: "Undo",
        onPress: () => setPending((list) => [item, ...list]),
      },
      duration: 5000,
    });
  };

  const openWorkOrder = (id: string) =>
    toast.info(`Open ${id}`, { message: "Detail screen comes in Step 5." });
  const openApplication = (id: string) =>
    toast.info(`Open ${id}`, { message: "Detail screen comes later." });

  return (
    <Screen
      scroll
      tabBar
      header={
        <AppHeader
          name="Token"
          avatarUri="https://i.pravatar.cc/150?img=12"
          notificationCount={pending.length}
          onPressNotifications={() => toast.info("Notifications coming soon")}
          onPressAvatar={() => router.navigate("/settings")}
        />
      }
    >
      <Stack gap="xl">
        <Summary
          pendingCount={pending.length}
          applicationCount={applications.length}
        />

        <PendingSection
          items={pending}
          onAcknowledge={acknowledge}
          onOpen={openWorkOrder}
        />

        <ApplicationsSection items={applications} onOpen={openApplication} />
      </Stack>
    </Screen>
  );
}

// ─────────────────────────────────────────────
// Sections
// ─────────────────────────────────────────────

/** Two big numbers: what needs me now, and what I'm waiting on. */
function Summary({
  pendingCount,
  applicationCount,
}: {
  pendingCount: number;
  applicationCount: number;
}) {
  return (
    <Row gap="md" align="stretch">
      <SummaryTile
        icon="alert-circle-outline"
        color={pendingCount > 0 ? "warning" : "success"}
        value={pendingCount}
        label="To acknowledge"
      />
      <SummaryTile
        icon="document-text-outline"
        color="primary"
        value={applicationCount}
        label="Applications waiting"
      />
    </Row>
  );
}

function SummaryTile({
  icon,
  color,
  value,
  label,
}: {
  icon: IconName;
  color: colorName;
  value: number;
  label: string;
}) {
  return (
    <Card padding="sm" style={{ flex: 1 }}>
      <Icon name={icon} color={color} />
      <AppText variant="title">{value}</AppText>
      <AppText variant="caption" color="textMuted">
        {label}
      </AppText>
    </Card>
  );
}

function PendingSection({
  items,
  onAcknowledge,
  onOpen,
}: {
  items: PendingAck[];
  onAcknowledge: (item: PendingAck) => void;
  onOpen: (id: string) => void;
}) {
  return (
    <Stack gap="md">
      <SectionHeader
        title="Pending acknowledge"
        count={items.length}
        countTone="warning"
        subtitle="New work assigned to you. Confirm you've seen it."
      />

      {items.length === 0 ? (
        <Card variant="filled">
          <Row gap="md">
            <Icon name="checkmark-circle" size={28} color="success" />
            <Stack gap="xs" flex>
              <AppText variant="label">You're all caught up</AppText>
              <AppText variant="caption" color="textMuted">
                New assignments will show up here.
              </AppText>
            </Stack>
          </Row>
        </Card>
      ) : (
        items.map((item) => (
          // Animated wrapper: a card fades out when acknowledged, the rest slide up smoothly
          <Animated.View
            key={item.id}
            exiting={FadeOut.duration(200)}
            layout={LinearTransition}
          >
            <PendingAckCard
              item={item}
              onAcknowledge={() => onAcknowledge(item)}
              onOpen={() => onOpen(item.id)}
            />
          </Animated.View>
        ))
      )}
    </Stack>
  );
}

function ApplicationsSection({
  items,
  onOpen,
}: {
  items: Application[];
  onOpen: (id: string) => void;
}) {
  return (
    <Stack gap="md">
      <SectionHeader
        title="Outstanding applications"
        count={items.length}
        subtitle="Requests you sent that are still waiting for approval."
        actionLabel="See all"
        onAction={() =>
          toast.info("All applications", {
            message: "List screen comes later.",
          })
        }
      />

      {items.length === 0 ? (
        <StateView
          type="empty"
          icon="document-text-outline"
          title="No open applications"
          message="Requests you send will show up here."
        />
      ) : (
        items.map((item) => (
          <ApplicationCard
            key={item.id}
            item={item}
            onOpen={() => onOpen(item.id)}
          />
        ))
      )}
    </Stack>
  );
}
