import { useFonts } from "expo-font";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { Toaster } from "@/components/ui";
import { FONT_FILES } from "@/constants/fonts";
import { useTheme } from "@/hooks/use-theme";

// Keep the splash screen up until fonts are ready (must be called at module scope)
SplashScreen.preventAutoHideAsync();

/**
 * Root navigator: a Stack.
 * - (tabs)      → the tab bar screens (see (tabs)/_layout.tsx)
 * - create      → opened by the center (+) button, slides up as a modal
 * - other files → pushed on top of the tabs
 */
export default function RootLayout() {
  const t = useTheme();
  const [loaded, error] = useFonts(FONT_FILES);

  useEffect(() => {
    if (loaded || error) SplashScreen.hide();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  const navTheme = t.dark ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider
      value={{
        ...navTheme,
        colors: { ...navTheme.colors, background: t.colors.background },
      }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: t.colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="create" options={{ presentation: "modal" }} />
      </Stack>
      <Toaster />
      <StatusBar style={t.dark ? "light" : "dark"} />
    </ThemeProvider>
  );
}
