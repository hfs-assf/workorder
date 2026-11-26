import { router } from "expo-router";

import { AppHeader } from "@/components/navigation";
import { Screen, StateView } from "@/components/ui";

export default function MaintenanceFormScreen() {
  return (
    <Screen
      header={
        <AppHeader
          safeTop={false}
          title="Maintenance request"
          onBack={() => router.back()}
        />
      }
    >
      <StateView
        type="empty"
        icon="construct-outline"
        title="Coming in C8"
        message="Maintenance form"
      />
    </Screen>
  );
}
