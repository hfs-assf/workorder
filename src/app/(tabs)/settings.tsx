import { router } from "expo-router";
import { useState } from "react";

import { AppHeader } from "@/components/navigation";
import {
  AppButton,
  AppText,
  Avatar,
  Card,
  CardDivider,
  Option,
  Row,
  Screen,
  SegmentedControl,
  Stack,
  Switch,
} from "@/components/ui";
import { setThemeMode, ThemeMode, useThemeMode } from "@/store/theme-mode";
import { ROLE_LABEL, useCurrentUser } from "@/store/user"; // ← NEW (1): import

const THEME_OPTIONS: Option<ThemeMode>[] = [
  { value: "light", label: "Light", icon: "sunny-outline" },
  { value: "dark", label: "Dark", icon: "moon-outline" },
  { value: "system", label: "System", icon: "phone-portrait-outline" },
];

export default function SettingsScreen() {
  const [push, setPush] = useState(true);
  const [offline, setOffline] = useState(false);
  const themeMode = useThemeMode();
  const user = useCurrentUser(); // ← NEW (2): read the profile

  return (
    <Screen
      scroll
      tabBar
      header={<AppHeader title="Settings" subtitle="Account & preferences" />}
    >
      <Stack gap="lg">
        <Card>
          <Row gap="md">
            {/* ← NEW (3): name, photo, role and area come from the profile */}
            <Avatar
              name={user?.name ?? "?"}
              uri={user?.avatarUri}
              size="lg"
              status="online"
            />
            <Stack gap="xs" flex>
              <AppText variant="heading">{user?.name}</AppText>
              <AppText variant="caption" color="textMuted">
                {user ? `${ROLE_LABEL[user.role]} · ${user.area.name}` : ""}
              </AppText>
            </Stack>
          </Row>
        </Card>

        <Card>
          <AppText variant="label" color="textMuted">
            APPEARANCE
          </AppText>
          <SegmentedControl<ThemeMode>
            options={THEME_OPTIONS}
            value={themeMode}
            onChange={setThemeMode}
          />
          <AppText variant="caption" color="textMuted">
            System follows your phone's light/dark setting.
          </AppText>
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
