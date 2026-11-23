import { AppHeader } from "@/components/navigation";
import { Screen, StateView } from "@/components/ui";

export default function ScanScreen() {
  return (
    <Screen
      tabBar
      header={<AppHeader title="Scan" subtitle="QR code or barcode" />}
    >
      <StateView
        type="empty"
        icon="scan-outline"
        title="Coming in Step 8"
        message="The camera scanner goes here."
      />
    </Screen>
  );
}
