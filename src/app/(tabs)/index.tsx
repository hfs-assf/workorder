import { router } from "expo-router";

import { AppHeader } from "@/components/navigation";
import {
  AppText,
  Badge,
  Card,
  Icon,
  Row,
  Screen,
  Spacer,
  Stack,
  StateView,
  toast,
} from "@/components/ui";

export default function HomeScreen() {
  return (
    <Screen
      scroll
      tabBar
      header={
        <AppHeader
          name="Token"
          avatarUri="https://i.pravatar.cc/150?img=12"
          notificationCount={3}
          onPressNotifications={() => toast.info("Notifications coming soon")}
          onPressAvatar={() => router.navigate("/settings")}
        />
      }
    >
      <Stack gap="lg">
        {/* Summary */}
        <Row gap="md">
          {[
            {
              label: "Open",
              value: 8,
              icon: "folder-open-outline" as const,
              color: "primary" as const,
            },
            {
              label: "Due today",
              value: 3,
              icon: "alarm-outline" as const,
              color: "warning" as const,
            },
            {
              label: "Done",
              value: 12,
              icon: "checkmark-done-outline" as const,
              color: "success" as const,
            },
          ].map((s) => (
            <Card key={s.label} padding="sm" style={{ flex: 1 }}>
              <Icon name={s.icon} color={s.color} />
              <AppText variant="title">{s.value}</AppText>
              <AppText variant="caption" color="textMuted">
                {s.label}
              </AppText>
            </Card>
          ))}
        </Row>

        <Row>
          <AppText variant="heading">Recent</AppText>
          <Spacer />
          <Badge label="Preview" tone="primary" size="sm" />
        </Row>

        <StateView
          type="empty"
          icon="clipboard-outline"
          title="No work orders yet"
          message="Tap + to create your first work order."
        />
      </Stack>
    </Screen>
  );
}
