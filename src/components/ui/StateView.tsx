import { ActivityIndicator, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { makeStyles, useTheme } from "@/hooks/use-theme";

import { AppButton } from "./AppButtton";
import { AppText } from "./AppText";
import { GlassView } from "./GlassView";
import { Icon, IconName } from "./Icon";

type Props =
  | { type: "loading"; message?: string }
  | {
      type: "empty";
      title: string;
      message?: string;
      icon?: IconName;
      actionLabel?: string;
      onAction?: () => void;
    }
  | {
      type: "error";
      title?: string;
      message: string;
      onRetry?: () => void;
    };

/** Full-area feedback for loading / empty / error. Use it in every list and detail screen. */
export function StateView(props: Props) {
  const t = useTheme();
  const styles = useStyles();

  if (props.type === "loading") {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={t.colors.primary} />
        {props.message ? (
          <AppText color="textMuted">{props.message}</AppText>
        ) : null}
      </View>
    );
  }

  const isError = props.type === "error";
  const icon: IconName = isError
    ? "cloud-offline-outline"
    : (props.icon ?? "file-tray-outline");
  const tint = isError ? t.colors.danger : t.colors.primary;
  const title = isError ? (props.title ?? "Something went wrong") : props.title;

  return (
    // Fades + slides up slightly when it appears
    <Animated.View entering={FadeInDown.duration(300)} style={styles.center}>
      {/* Icon in a glass circle with a colored glow */}
      <GlassView
        radius={t.radius.pill}
        style={[styles.iconWrap, { boxShadow: t.shadow.glow(tint) }]}
      >
        <Icon name={icon} size={40} tint={tint} />
      </GlassView>

      <View style={styles.texts}>
        <AppText variant="heading" align="center">
          {title}
        </AppText>
        {props.message ? (
          <AppText color="textMuted" align="center">
            {props.message}
          </AppText>
        ) : null}
      </View>

      {isError && props.onRetry ? (
        <AppButton
          title="Try again"
          icon="refresh"
          variant="secondary"
          fullWidth={false}
          onPress={props.onRetry}
        />
      ) : null}
      {!isError && props.actionLabel && props.onAction ? (
        <AppButton
          title={props.actionLabel}
          icon="add"
          fullWidth={false}
          onPress={props.onAction}
        />
      ) : null}
    </Animated.View>
  );
}

const useStyles = makeStyles((t) => ({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: t.spacing.lg,
    padding: t.spacing.xl,
    minHeight: 320,
  },
  iconWrap: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
  },
  texts: { gap: t.spacing.xs, maxWidth: 280 },
}));
