import { router } from "expo-router";

import { AppHeader } from "@/components/navigation";
import { AppText, Screen, Stack } from "@/components/ui";
import {
  applicationsDetail,
  pendingDetail,
  SummaryCard,
  useApplications,
  usePendingAcks,
} from "@/features/home";

export default function HomeScreen() {
  const pending = usePendingAcks();
  const applications = useApplications();

  return (
    <Screen
      scroll
      tabBar
      header={
        <AppHeader
          name="Token"
          avatarUri="https://i.pravatar.cc/150?img=12"
          notificationCount={pending.length}
          onPressNotifications={() => router.push("/pending")}
          onPressAvatar={() => router.navigate("/settings")}
        />
      }
    >
      <Stack gap="md">
        <AppText variant="label" color="textMuted">
          NEEDS YOUR ATTENTION
        </AppText>

        <SummaryCard
          icon={
            pending.length ? "alert-circle-outline" : "checkmark-circle-outline"
          }
          color={pending.length ? "warning" : "success"}
          count={pending.length}
          title="To acknowledge"
          detail={pendingDetail(pending)}
          onPress={() => router.push("/pending")}
        />

        <SummaryCard
          icon="document-text-outline"
          color="primary"
          count={applications.length}
          title="Outstanding applications"
          detail={applicationsDetail(applications)}
          onPress={() => router.push("/applications")}
        />

        <AppText variant="caption" color="textMuted" align="center">
          Tap a card to see the list.
        </AppText>
      </Stack>
    </Screen>
  );
}
