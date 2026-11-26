import { Href, router } from "expo-router";

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
} from "@/components/ui";

// 15 fake work orders, just to have something to scroll
const ORDERS = Array.from({ length: 15 }, (_, i) => ({
  id: `WO-${1030 - i}`,
  title: [
    "Replace conveyor belt",
    "Fix hydraulic leak",
    "Inspect fire extinguisher",
    "Clean air filter",
  ][i % 4],
  location: `Workshop Bay ${(i % 5) + 1}`,
}));

export default function OrdersScreen() {
  return (
    <Screen
      scroll
      tabBar
      header={
        <AppHeader title="Work Orders" subtitle={`${ORDERS.length} jobs`} />
      }
    >
      <Stack gap="md">
        {ORDERS.map((wo) => (
          <Card key={wo.id} onPress={() => router.push("/create" as Href)}>
            <Row>
              <AppText variant="label" color="textMuted">
                {wo.id}
              </AppText>
              <Spacer />
              <Badge label="Open" tone="primary" dot />
            </Row>
            <AppText variant="heading">{wo.title}</AppText>
            <Row gap="xs">
              <Icon name="location-outline" size={14} color="textMuted" />
              <AppText variant="caption" color="textMuted">
                {wo.location}
              </AppText>
            </Row>
          </Card>
        ))}
      </Stack>
    </Screen>
  );
}
