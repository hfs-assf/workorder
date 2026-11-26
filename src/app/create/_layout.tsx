import { Stack } from "expo-router";

/** The (+) flow: chooser → form. Opens as one modal over the tabs. */
export default function CreateLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
