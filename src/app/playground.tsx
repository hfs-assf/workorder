import { View } from "react-native";

import {
  AppButton,
  AppText,
  Avatar,
  Badge,
  Card,
  CardDivider,
  Icon,
  Row,
  Screen,
  Spacer,
  Stack,
} from "@/components/ui";

export default function PlaygroundScreen() {
  return (
    <Screen scroll>
      <Stack gap="lg">
        <AppText variant="title">Glass cards</AppText>
        <AppText color="textMuted">
          Switch light ↔ dark mode to compare.
        </AppText>

        {/* Stats */}
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

        {/* Work order card — no variant → brand default (glass) */}
        <Card onPress={() => {}}>
          <Row>
            <AppText variant="label" color="textMuted">
              WO-1024
            </AppText>
            <Spacer />
            <Badge label="In progress" tone="warning" dot />
          </Row>
          <AppText variant="heading">Replace conveyor belt</AppText>
          <Row gap="xs">
            <Icon name="location-outline" size={14} color="textMuted" />
            <AppText variant="caption" color="textMuted">
              Workshop Bay 3
            </AppText>
          </Row>
          <CardDivider />
          <Row>
            <Avatar name="Budi Santoso" size="sm" />
            <AppText variant="caption" color="textMuted">
              Budi Santoso
            </AppText>
            <Spacer />
            <AppText variant="caption" color="textMuted">
              Due 20 Nov
            </AppText>
          </Row>
        </Card>

        <Card>
          <AppText variant="heading">Quick actions</AppText>
          <Row gap="md">
            <View style={{ flex: 1 }}>
              <AppButton
                title="Upload"
                icon="cloud-upload-outline"
                variant="secondary"
                onPress={() => {}}
              />
            </View>
            <View style={{ flex: 1 }}>
              <AppButton title="Scan" icon="scan" onPress={() => {}} />
            </View>
          </Row>
        </Card>

        <AppText variant="label" color="textMuted">
          FOR COMPARISON: variant="elevated" (solid)
        </AppText>
        <Card variant="elevated">
          <AppText variant="heading">Solid card</AppText>
          <AppText color="textMuted">
            Still available when you need full contrast (e.g. long forms).
          </AppText>
        </Card>
      </Stack>
    </Screen>
  );
}
