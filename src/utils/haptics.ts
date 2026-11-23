/**
 * One place for vibration feedback. Components call haptic.tap() etc.
 * (No-op on web, where haptics don't exist.)
 */
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const enabled = Platform.OS !== "web";

export const haptic = {
  /** Button press */
  tap: () => enabled && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  /** Selecting an item, card, tab, chip */
  select: () => enabled && Haptics.selectionAsync(),
  /** Saved, scanned, uploaded */
  success: () =>
    enabled &&
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  /** Validation failed, upload failed */
  error: () =>
    enabled &&
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  warning: () =>
    enabled &&
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
};

export type HapticType = keyof typeof haptic;
