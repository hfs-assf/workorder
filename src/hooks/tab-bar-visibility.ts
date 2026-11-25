/**
 * Shared "is the floating tab bar hidden?" value.
 * 0 = visible, 1 = hidden. Lives on the UI thread (Reanimated), so
 * scrolling can hide/show the bar at 60fps without re-rendering React.
 */
import {
  makeMutable,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const tabBarHidden = makeMutable(0);

const DURATION = 220;
const THRESHOLD = 8; // ignore tiny finger jitters (px)
const TOP_ZONE = 40; // always show the bar near the top of the page

/** Show the bar (e.g. when switching tabs). */
export function showTabBar() {
  tabBarHidden.value = withTiming(0, { duration: DURATION });
}

/**
 * Scroll handler: scrolling DOWN hides the bar, scrolling UP shows it.
 * Used by <Screen tabBar scroll>; you rarely need it directly.
 */
export function useHideTabBarOnScroll() {
  const lastY = useSharedValue(0);
  const target = useSharedValue(0); // where we're animating to, so we don't restart it every frame

  return useAnimatedScrollHandler({
    onScroll: (e) => {
      const y = e.contentOffset.y;
      const dy = y - lastY.value;

      let next = target.value;
      if (y < TOP_ZONE)
        next = 0; // near the top → visible
      else if (dy > THRESHOLD)
        next = 1; // moving down → hide
      else if (dy < -THRESHOLD) next = 0; // moving up → show

      if (next !== target.value) {
        target.value = next;
        tabBarHidden.value = withTiming(next, { duration: DURATION });
      }
      // Only remember the position after a real move, so slow scrolling still counts
      if (Math.abs(dy) > THRESHOLD) lastY.value = y;
    },
  });
}
