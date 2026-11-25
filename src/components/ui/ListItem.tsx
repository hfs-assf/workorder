import { StyleProp, View, ViewStyle } from "react-native";

import { colorName } from "@/constants/theme";
import { makeStyles, useTheme } from "@/hooks/use-theme";
import { alpha } from "@/utils/color";

import { AppText } from "./AppText";
import { Icon, IconName } from "./Icon";
import { PressableScale } from "./PressableScale";

type Props = {
  title: string;
  description?: string;
  icon?: IconName;
  /** Color of the icon tile */
  iconColor?: colorName;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Tappable row: colored icon tile · title + description · chevron. For menus and choosers. */
export function ListItem({
  title,
  description,
  icon,
  iconColor = "primary",
  onPress,
  style,
}: Props) {
  const t = useTheme();
  const styles = useStyles();
  const color = t.colors[iconColor] ?? t.colors.primary;

  return (
    <PressableScale
      onPress={onPress}
      haptic="select"
      scaleTo={0.98}
      accessibilityLabel={title}
      style={[styles.row, style]}
    >
      {icon ? (
        <View
          style={[styles.iconTile, { backgroundColor: alpha(color, 0.12) }]}
        >
          <Icon name={icon} size={22} tint={color} />
        </View>
      ) : null}
      <View style={styles.texts}>
        <AppText variant="label" style={styles.title}>
          {title}
        </AppText>
        {description ? (
          <AppText variant="caption" color="textMuted">
            {description}
          </AppText>
        ) : null}
      </View>
      <Icon name="chevron-forward" size={18} color="textMuted" />
    </PressableScale>
  );
}

const useStyles = makeStyles((t) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: t.spacing.md,
    padding: t.spacing.md,
    borderRadius: t.radius.lg,
    borderWidth: 1,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: t.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  texts: { flex: 1, gap: 2 },
  title: { fontSize: t.typography.body.fontSize },
}));
