/**
 * The user's appearance choice: Light, Dark, or follow the phone (System).
 *
 * It works by overriding React Native's color scheme for the whole app
 * (Appearance.setColorScheme). Our useTheme() already reads that, so every
 * component, the status bar and native pop-ups switch automatically.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSyncExternalStore } from "react";
import { Appearance } from "react-native";

export type ThemeMode = "system" | "light" | "dark";

const STORAGE_KEY = "theme-mode";

let mode: ThemeMode = "system";
const listeners = new Set<() => void>();

function apply(next: ThemeMode) {
  mode = next;
  // 'unspecified' = stop overriding → follow the phone again
  Appearance.setColorScheme(next === "system" ? "unspecified" : next);
  listeners.forEach((l) => l());
}

/** Change the mode and remember it for next app start. */
export function setThemeMode(next: ThemeMode) {
  apply(next);
  AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {}); // saving is best-effort
}

/** Read the saved mode. Call once at app start (before hiding the splash screen). */
export async function loadThemeMode() {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark" || saved === "system")
      apply(saved);
  } catch {
    // nothing saved / storage unavailable → keep 'system'
  }
}

/** Current mode in a component (re-renders when it changes). */
export function useThemeMode(): ThemeMode {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => mode,
    () => mode,
  );
}
