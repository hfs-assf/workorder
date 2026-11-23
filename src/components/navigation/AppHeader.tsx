import { ReactNode } from "react";
import { useWindowDimensions, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText, Avatar, IconButton, PressableScale } from "@/components/ui";
import { makeStyles } from "@/hooks/use-theme";
import { getGreeting } from "@/utils/date";

import { NotificationButton } from "@/components/navigation/NotificationButton";

type GreetingProps = {
  /** User's name → "Good morning, Token" layout */
  name: string;
  avatarUri?: string | null;
  notificationCount?: number;
  onPressNotifications?: () => void;
  onPressAvatar?: () => void;
  /** Replace the automatic "Good morning" text */
  greeting?: string;
  title?: never;
};

type TitleProps = {
  /** Plain page title (other tabs / detail pages) */
  title: string;
  subtitle?: string;
  /** Shows a back button on the left */
  onBack?: () => void;
  /** Buttons on the right (e.g. <IconButton icon="filter" …/>) */
  right?: ReactNode;
  name?: never;
};

type Props = (GreetingProps | TitleProps) & {
  /** Add space for the status bar / notch. Turn off when the header is inside a card or sheet. Default true */
  safeTop?: boolean;
};

/**
 * Top header. Two modes, same spacing/typography/tokens:
 *  - greeting: "Good morning / Token" + bell + avatar   (home)
 *  - title:    back button + title + actions             (other screens)
 */
export function AppHeader(props: Props) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const compact = width < 360; // small phones → slightly smaller title

  return (
    <View
      style={[
        styles.wrap,
        { paddingTop: props.safeTop === false ? 0 : insets.top },
      ]}
    >
      <Animated.View entering={FadeInDown.duration(350)} style={styles.row}>
        {"name" in props && props.name !== undefined ? (
          <>
            {/* Left: greeting + name */}
            <View style={styles.left}>
              <AppText
                variant="caption"
                color="textMuted"
                numberOfLines={1}
                style={styles.greeting}
              >
                {props.greeting ?? getGreeting()} 👋
              </AppText>
              <AppText
                variant={compact ? "heading" : "title"}
                numberOfLines={1}
                style={styles.name}
              >
                {props.name}
              </AppText>
            </View>

            {/* Right: bell + avatar */}
            <View style={styles.actions}>
              <NotificationButton
                count={props.notificationCount}
                onPress={props.onPressNotifications ?? (() => {})}
              />
              <PressableScale
                onPress={props.onPressAvatar ?? (() => {})}
                haptic="tap"
                scaleTo={0.92}
                accessibilityLabel="Open profile"
                style={styles.avatarRing}
              >
                <Avatar
                  name={props.name}
                  uri={props.avatarUri}
                  size="md"
                  status="online"
                />
              </PressableScale>
            </View>
          </>
        ) : (
          <>
            {props.onBack ? (
              <IconButton
                icon="chevron-back"
                onPress={props.onBack}
                accessibilityLabel="Go back"
              />
            ) : null}
            <View style={styles.left}>
              <AppText
                variant={compact ? "heading" : "title"}
                numberOfLines={1}
                style={styles.name}
              >
                {props.title}
              </AppText>
              {props.subtitle ? (
                <AppText variant="caption" color="textMuted" numberOfLines={1}>
                  {props.subtitle}
                </AppText>
              ) : null}
            </View>
            {props.right ? (
              <View style={styles.actions}>{props.right}</View>
            ) : null}
          </>
        )}
      </Animated.View>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  wrap: { paddingHorizontal: t.layout.screenPadding },
  row: {
    minHeight: t.layout.headerHeight,
    flexDirection: "row",
    alignItems: "center",
    gap: t.spacing.md,
  },
  left: { flex: 1, gap: 2 },
  greeting: { letterSpacing: 0.2 },
  name: { letterSpacing: -0.5 },
  actions: { flexDirection: "row", alignItems: "center", gap: t.spacing.sm },
  avatarRing: {
    padding: 2,
    borderRadius: t.radius.pill,
    borderWidth: 1.5,
    borderColor: t.colors.border,
  },
}));
