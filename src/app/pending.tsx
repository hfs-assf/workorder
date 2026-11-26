import { router } from "expo-router";
import { useMemo, useState } from "react";
import Animated, { FadeOut, LinearTransition } from "react-native-reanimated";

import { AppHeader } from "@/components/navigation";
import {
  AppText,
  Card,
  ChipGroup,
  Icon,
  Row,
  Screen,
  Stack,
  toast,
} from "@/components/ui";
import {
  acknowledge,
  Facility,
  PendingAckCard,
  Priority,
  restorePending,
  usePendingAcks,
} from "@/features/home";

type Filter = "all" | Facility;

const PRIORITY_RANK: Record<Priority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

/** Full list of work assigned to me that I still need to acknowledge. Most urgent first. */
export default function PendingScreen() {
  const all = usePendingAcks();
  const [filter, setFilter] = useState<Filter>("all");

  const items = useMemo(
    () =>
      all
        .filter((i) => filter === "all" || i.facility === filter)
        .sort(
          (a, b) =>
            PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] ||
            a.dueAt.getTime() - b.dueAt.getTime(),
        ),
    [all, filter],
  );

  const onAcknowledge = (id: string) => {
    const item = acknowledge(id);
    if (!item) return;
    toast.success("Acknowledged", {
      message: `${item.id} is now in your work orders.`,
      action: { label: "Undo", onPress: () => restorePending(item) },
      duration: 5000,
    });
  };

  return (
    <Screen
      scroll
      header={
        <AppHeader
          title="Pending acknowledge"
          subtitle={
            all.length
              ? `${all.length} new assignment${all.length > 1 ? "s" : ""} · most urgent first`
              : "All done"
          }
          onBack={() => router.back()}
        />
      }
    >
      <Stack gap="md">
        <ChipGroup<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All", count: all.length },
            {
              value: "house",
              label: "House",
              icon: "home-outline",
              count: all.filter((i) => i.facility === "house").length,
            },
            {
              value: "mess",
              label: "Mess",
              icon: "restaurant-outline",
              count: all.filter((i) => i.facility === "mess").length,
            },
          ]}
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
            <Animated.View
              key={item.id}
              exiting={FadeOut.duration(200)}
              layout={LinearTransition}
            >
              <PendingAckCard
                item={item}
                onAcknowledge={() => onAcknowledge(item.id)}
                onOpen={() =>
                  toast.info(`Open ${item.id}`, {
                    message: "Detail screen comes in Step 5.",
                  })
                }
              />
            </Animated.View>
          ))
        )}
      </Stack>
    </Screen>
  );
}
