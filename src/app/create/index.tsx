import { router } from "expo-router";
import { Platform } from "react-native";

import { AppHeader } from "@/components/navigation";
import {
  IconButton,
  ListItem,
  Screen,
  SectionHeader,
  Stack,
} from "@/components/ui";
import {
  ESTIMATION_FORMS,
  EstimationKind,
  FACILITY_ICON,
} from "@/features/create";

/** Display order: Original before Additional, House before Mess */
const ESTIMATION_ORDER: EstimationKind[] = [
  "original-house",
  "original-mess",
  "additional-house",
  "additional-mess",
];

/** Step 1 of creating: pick what you want to create. */
export default function CreateChooserScreen() {
  const close = () => router.back();

  return (
    <Screen
      scroll
      header={
        <AppHeader
          safeTop={Platform.OS !== "ios"}
          title="Create"
          subtitle="What do you want to do?"
          right={
            <IconButton
              icon="close"
              variant="ghost"
              accessibilityLabel="Close"
              onPress={close}
            />
          }
        />
      }
    >
      <Stack gap="xl">
        {/* Fastest path first */}
        <Stack gap="sm">
          <SectionHeader title="Quick" />
          <ListItem
            icon="scan-outline"
            title="Scan"
            description="Scan the QR code on a house or mess unit"
            onPress={() => {
              router.back();
              router.navigate("/scan");
            }}
          />
        </Stack>

        <Stack gap="sm">
          <SectionHeader
            title="Estimation"
            subtitle="Cost estimate for a house or mess unit."
          />
          {ESTIMATION_ORDER.map((kind) => {
            const form = ESTIMATION_FORMS[kind];
            return (
              <ListItem
                key={kind}
                icon={FACILITY_ICON[form.facility]}
                iconColor={
                  kind.startsWith("additional") ? "warning" : "primary"
                }
                title={form.title}
                description={form.description}
                onPress={() =>
                  router.push({
                    pathname: "/create/estimation",
                    params: { kind },
                  })
                }
              />
            );
          })}
        </Stack>

        <Stack gap="sm">
          <SectionHeader title="Maintenance" />
          <ListItem
            icon="construct-outline"
            iconColor="success"
            title="Maintenance Form Request"
            description="Report something broken in a house or mess"
            onPress={() => router.push("/create/maintenance")}
          />
        </Stack>
      </Stack>
    </Screen>
  );
}
