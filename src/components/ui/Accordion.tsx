import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useId,
  useState,
} from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { makeStyles } from "@/hooks/use-theme";

import { AppText } from "./AppText";
import { Icon, IconName } from "./Icon";
import { PressableScale } from "./PressableScale";

// ---------- Group (optional): controls which items are open ----------

type GroupContext = {
  isOpen: (id: string) => boolean;
  toggle: (id: string) => void;
};
const AccordionContext = createContext<GroupContext | null>(null);

type GroupProps = {
  children: ReactNode;
  /** 'single' = opening one closes the others · 'multiple' = any number open */
  type?: "single" | "multiple";
  /** ids of items open at first */
  defaultOpen?: string[];
  style?: StyleProp<ViewStyle>;
};

/** Wrap several <Accordion> items to coordinate them. */
export function AccordionGroup({
  children,
  type = "multiple",
  defaultOpen = [],
  style,
}: GroupProps) {
  const styles = useStyles();
  const [open, setOpen] = useState<string[]>(defaultOpen);

  const ctx: GroupContext = {
    isOpen: (id) => open.includes(id),
    toggle: (id) =>
      setOpen((cur) =>
        cur.includes(id)
          ? cur.filter((x) => x !== id)
          : type === "single"
            ? [id]
            : [...cur, id],
      ),
  };

  return (
    <AccordionContext.Provider value={ctx}>
      <View style={[styles.group, style]}>
        {/* -1 hides the first item's top line under the group's border → no double lines */}
        <View style={styles.groupInner}>{children}</View>
      </View>
    </AccordionContext.Provider>
  );
}

// ---------- Item ----------

type Props = {
  title: string;
  subtitle?: string;
  icon?: IconName;
  /** Anything on the right of the header, before the chevron (e.g. a Badge or a count) */
  right?: ReactNode;
  children: ReactNode;
  /** Needed only inside an AccordionGroup with defaultOpen */
  id?: string;
  /** Open at first (when NOT inside a group) */
  defaultOpen?: boolean;
  disabled?: boolean;
};

const DURATION = 220;

/** Collapsible section: header row + content that expands with a smooth height animation. */
export function Accordion({
  title,
  subtitle,
  icon,
  right,
  children,
  id,
  defaultOpen = false,
  disabled,
}: Props) {
  const styles = useStyles();
  const group = useContext(AccordionContext);
  const autoId = useId();
  const itemId = id ?? autoId;

  // Inside a group → the group decides. Alone → own state.
  const [ownOpen, setOwnOpen] = useState(defaultOpen);
  const open = group ? group.isOpen(itemId) : ownOpen;
  const toggle = () => (group ? group.toggle(itemId) : setOwnOpen((o) => !o));

  const progress = useSharedValue(open ? 1 : 0); // 0 = closed, 1 = open
  const contentHeight = useSharedValue(0); // measured natural height of the content

  useEffect(() => {
    progress.value = withTiming(open ? 1 : 0, {
      duration: DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [open, progress]);

  const bodyAnim = useAnimatedStyle(() => ({
    height: progress.value * contentHeight.value,
    opacity: progress.value,
  }));
  const chevronAnim = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
  }));

  return (
    <View style={styles.item}>
      <PressableScale
        onPress={toggle}
        disabled={disabled}
        haptic="select"
        scaleTo={0.99}
        accessibilityState={{ expanded: open, disabled }}
        accessibilityLabel={title}
        style={[styles.header, disabled && styles.disabled]}
      >
        {icon ? (
          <View style={styles.iconWrap}>
            <Icon name={icon} size={18} color="primary" />
          </View>
        ) : null}
        <View style={styles.texts}>
          <AppText variant="label" style={styles.title}>
            {title}
          </AppText>
          {subtitle ? (
            <AppText variant="caption" color="textMuted">
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {right}
        <Animated.View style={chevronAnim}>
          <Icon name="chevron-down" size={18} color="textMuted" />
        </Animated.View>
      </PressableScale>

      {/* Outer view animates its height; inner view is measured at its natural size */}
      <Animated.View style={[styles.bodyClip, bodyAnim]}>
        <View
          style={styles.bodyMeasure}
          onLayout={(e) => {
            contentHeight.value = e.nativeEvent.layout.height;
          }}
        >
          <View style={styles.body}>{children}</View>
        </View>
      </Animated.View>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  group: {
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.lg + 4,
    borderWidth: 1,
    borderColor: t.colors.border,
    overflow: "hidden",
  },
  groupInner: { marginTop: -1 },
  item: { borderTopWidth: 1, borderTopColor: t.colors.border },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: t.spacing.md,
    minHeight: t.controlHeight.lg,
    paddingHorizontal: t.spacing.lg,
    paddingVertical: t.spacing.md,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: t.radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: t.colors.surfaceMuted,
  },
  texts: { flex: 1, gap: 2 },
  title: { fontSize: t.typography.body.fontSize },
  disabled: { opacity: 0.45 },
  bodyClip: { overflow: "hidden" },
  bodyMeasure: { position: "absolute", left: 0, right: 0, top: 0 },
  body: {
    paddingHorizontal: t.spacing.lg,
    paddingBottom: t.spacing.lg,
    gap: t.spacing.sm,
  },
}));
