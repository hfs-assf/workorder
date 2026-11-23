import { router } from "expo-router";
import { useState } from "react";

import { AppHeader } from "@/components/navigation";
import {
  AppButton,
  AppText,
  Avatar,
  Card,
  CardDivider,
  Row,
  Screen,
  Stack,
  Switch,
} from "@/components/ui";

export default function SettingsScreen() {
  const [push, setPush] = useState(true);
  const [offline, setOffline] = useState(false);

  return (
    <Screen
      scroll
      tabBar
      header={<AppHeader title="Settings" subtitle="Account & preferences" />}
    >
      <Stack gap="lg">
        <Card>
          <Row gap="md">
            <Avatar
              name="Token"
              uri="https://i.pravatar.cc/150?img=12"
              size="lg"
              status="online"
            />
            <Stack gap="xs" flex>
              <AppText variant="heading">Token</AppText>
              <AppText variant="caption" color="textMuted">
                Technician · Workshop A
              </AppText>
            </Stack>
          </Row>
        </Card>

        <Card>
          <AppText variant="label" color="textMuted">
            NOTIFICATIONS
          </AppText>
          <Switch
            label="Push notifications"
            description="When a work order is assigned to you"
            value={push}
            onChange={setPush}
          />
          <CardDivider />
          <Switch
            label="Offline mode"
            description="Save changes on the phone, sync later"
            value={offline}
            onChange={setOffline}
          />
        </Card>

        <Card>
          <AppText variant="label" color="textMuted">
            DEVELOPER
          </AppText>
          <AppButton
            title="Open UI Kit"
            icon="color-palette-outline"
            variant="secondary"
            onPress={() => router.push("/playground")}
          />
        </Card>
      </Stack>
    </Screen>
  );
}
