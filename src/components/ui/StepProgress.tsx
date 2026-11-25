import { View } from "react-native";

import { makeStyles } from "@/hooks/use-theme";

import { AppText } from "./AppText";
import { Icon } from "./Icon";

type Props = {
  /** Step names in order, e.g. ['Submitted', 'In review', 'Approved'] */
  steps: string[];
  /** Index of the step we're at now (0 = first) */
  current: number;
};

/**
 * Small horizontal tracker: ✓ done → ● now → ○ next.
 * Shows where something is in a process (applications, work order status).
 */
export function StepProgress({ steps, current }: Props) {
  const styles = useStyles();

  return (
    <View
      style={styles.row}
      accessibilityLabel={`Step ${current + 1} of ${steps.length}: ${steps[current]}`}
    >
      {steps.map((label, i) => {
        const done = i < current;
        const now = i === current;
        return (
          <View key={label} style={styles.step}>
            <View style={styles.track}>
              {/* line to the left (not on the first step) */}
              <View
                style={[
                  styles.line,
                  i === 0 && styles.hidden,
                  (done || now) && styles.lineDone,
                ]}
              />
              <View
                style={[
                  styles.dot,
                  done && styles.dotDone,
                  now && styles.dotNow,
                ]}
              >
                {done ? (
                  <Icon name="checkmark" size={10} color="onPrimary" />
                ) : null}
              </View>
              {/* line to the right (not on the last step) */}
              <View
                style={[
                  styles.line,
                  i === steps.length - 1 && styles.hidden,
                  done && styles.lineDone,
                ]}
              />
            </View>
            <AppText
              variant="caption"
              color={now ? "primary" : done ? "text" : "textMuted"}
              align="center"
              numberOfLines={1}
            >
              {label}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  row: { flexDirection: "row" },
  step: { flex: 1, gap: t.spacing.xs },
  track: { flexDirection: "row", alignItems: "center" },
  line: { flex: 1, height: 2, backgroundColor: t.colors.border },
  lineDone: { backgroundColor: t.colors.primary },
  hidden: { opacity: 0 },
  dot: {
    width: 16,
    height: 16,
    borderRadius: t.radius.pill,
    borderWidth: 2,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  dotDone: { backgroundColor: t.colors.primary, borderColor: t.colors.primary },
  dotNow: { borderColor: t.colors.primary, borderWidth: 5 },
}));
