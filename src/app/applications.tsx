import { router } from "expo-router";
import { useMemo, useState } from "react";

import { AppHeader } from "@/components/navigation";
import { ChipGroup, Screen, Stack, StateView, toast } from "@/components/ui";
import { ApplicationCard, useApplications } from "@/features/home";

type Filter = "all" | "submitted" | "in-review";

/** Everything I submitted that is still waiting for approval. Oldest first (needs follow-up). */
export default function ApplicationsScreen() {
  const all = useApplications();
  const [filter, setFilter] = useState<Filter>("all");

  const items = useMemo(
    () =>
      all
        .filter(
          (i) =>
            filter === "all" ||
            (filter === "submitted" ? i.step === 0 : i.step === 1),
        )
        .sort((a, b) => a.submittedAt.getTime() - b.submittedAt.getTime()),
    [all, filter],
  );

  return (
    <Screen
      scroll
      header={
        <AppHeader
          title="Outstanding applications"
          subtitle="Waiting for approval · oldest first"
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
              value: "submitted",
              label: "Submitted",
              count: all.filter((i) => i.step === 0).length,
            },
            {
              value: "in-review",
              label: "In review",
              count: all.filter((i) => i.step === 1).length,
            },
          ]}
        />

        {items.length === 0 ? (
          <StateView
            type="empty"
            icon="document-text-outline"
            title="Nothing here"
            message="Applications you send will show up here."
          />
        ) : (
          items.map((item) => (
            <ApplicationCard
              key={item.id}
              item={item}
              onOpen={() =>
                toast.info(`Open ${item.id}`, {
                  message: "Detail screen comes later.",
                })
              }
            />
          ))
        )}
      </Stack>
    </Screen>
  );
}
