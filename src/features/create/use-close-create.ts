import { useNavigation } from "expo-router";
import { useCallback } from "react";

/**
 * Close the whole (+) flow (chooser + form) in one go and return to the tab
 * the user came from. `router.back()` would only go back one screen.
 */
export function useCloseCreateFlow() {
  const navigation = useNavigation();
  // The forms live in the "create" stack; its parent is the root stack holding the modal.
  return useCallback(() => navigation.getParent()?.goBack(), [navigation]);
}
