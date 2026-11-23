import { router } from "expo-router";
import { Tabs } from "expo-router/js-tabs";

import { BottomTabBar } from "@/components/navigation";
import { Icon, IconName } from "@/components/ui";
import { useTheme } from "@/hooks/use-theme";

/** Helper: outline icon normally, filled icon when the tab is active */
function tabIcon(outline: IconName, filled: IconName) {
  function TabIcon({
    focused,
    color,
    size,
  }: {
    focused: boolean;
    color: unknown;
    size: number;
  }) {
    return (
      <Icon
        name={focused ? filled : outline}
        size={size}
        tint={color as string}
      />
    );
  }
  return TabIcon;
}

/**
 * Tab screens, in bar order. The FAB is inserted in the middle automatically,
 * so keep an EVEN number of tabs (2 or 4) for a centered button.
 */
export default function TabsLayout() {
  const t = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: t.colors.background },
      }}
      tabBar={(props) => (
        <BottomTabBar {...props} onFabPress={() => router.push("/create")} />
      )}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: tabIcon("home-outline", "home") }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: tabIcon("clipboard-outline", "clipboard"),
          tabBarBadge: 3,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{ title: "Scan", tabBarIcon: tabIcon("scan-outline", "scan") }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: tabIcon("settings-outline", "settings"),
        }}
      />
    </Tabs>
  );
}
