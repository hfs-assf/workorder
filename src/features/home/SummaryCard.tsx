import { View } from "react-native";

import { AppText, Card, Icon, IconName, Row } from "@/components/ui";
import { colorName } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { alpha } from "@/utils/color";

type Props = {
  icon: IconName;
  color: colorName;
  count: number;
  title: string;
  /** One line that says what matters most, e.g. "1 urgent · 1 due today" */
  detail: string;
  onPress: () => void;
};

/** Big tappable card on Home: how many, what it is, what's most important → opens the list. */
export function SummaryCard({
  icon,
  color,
  count,
  title,
  detail,
  onPress,
}: Props) {
  const t = useTheme();
  const tint = t.colors[color] ?? t.colors.primary;

  return (
    <Card onPress={onPress} padding="lg">
      <Row gap="md">
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: t.radius.lg,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: alpha(tint, 0.12),
          }}
        >
          <Icon name={icon} size={26} tint={tint} />
        </View>

        <View style={{ flex: 1, gap: 2 }}>
          <Row gap="sm" align="baseline">
            <AppText variant="title" style={{ color: tint }}>
              {count}
            </AppText>
            <AppText variant="label" style={{ flexShrink: 1 }}>
              {title}
            </AppText>
          </Row>
          <AppText variant="caption" color="textMuted" numberOfLines={1}>
            {detail}
          </AppText>
        </View>

        <Icon name="chevron-forward" size={20} color="textMuted" />
      </Row>
    </Card>
  );
}
