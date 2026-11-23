import { AppHeader } from "@/components/navigation";
import { Screen, StateView } from "@/components/ui";

export default function OrdersScreen() {
  return (
    <Screen
      tabBar
      header={<AppHeader title="Work Orders" subtitle="All jobs" />}
    >
      <StateView
        type="empty"
        icon="clipboard-outline"
        title="Coming in Step 5"
        message="The work order list goes here."
      />
    </Screen>
  );
}
