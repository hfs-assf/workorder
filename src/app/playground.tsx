import { useState } from "react";

import {
  AppInput,
  AppText,
  FormSection,
  ListItem,
  Screen,
  Stack,
  toast,
} from "@/components/ui";

export default function PlaygroundScreen() {
  const [name, setName] = useState("");
  const [workdayId, setWorkdayId] = useState("");

  return (
    <Screen scroll>
      <Stack gap="lg">
        <AppText variant="title">List & sections</AppText>

        <Stack gap="sm">
          <ListItem
            icon="home-outline"
            title="Estimation Original – House"
            description="First estimate after a resident checks out"
            onPress={() => toast.info("Original – House")}
          />
          <ListItem
            icon="restaurant-outline"
            iconColor="warning"
            title="Estimation Additional – Mess"
            description="Extra work on top of the original estimate"
            onPress={() => toast.info("Additional – Mess")}
          />
          <ListItem
            icon="construct-outline"
            iconColor="success"
            title="Maintenance Form Request"
            description="Report something broken in a house or mess"
            onPress={() => toast.info("Maintenance")}
          />
        </Stack>

        <FormSection
          icon="person-outline"
          title="Requester"
          description="Who is asking for this work?"
        >
          <AppInput
            label="Requester"
            placeholder="Full name"
            value={name}
            onChangeText={setName}
          />
          <AppInput
            label="Workday ID"
            placeholder="e.g. 10234567"
            keyboardType="number-pad"
            value={workdayId}
            onChangeText={setWorkdayId}
          />
        </FormSection>
      </Stack>
    </Screen>
  );
}
