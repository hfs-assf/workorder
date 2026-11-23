import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { alpha } from "@/utils/color";
import {
  addDays,
  addMonths,
  formatRelative,
  getMonthGrid,
  isSameDay,
  MONTHS_LONG,
  startOfDay,
  WEEKDAYS,
} from "@/utils/date";
import { haptic } from "@/utils/haptics";

import { AppButton } from "./AppButtton";
import { AppText } from "./AppText";
import { BottomSheet } from "./BottomSheet";
import { Chip } from "./Chip";
import { FieldLabel, FieldMessage, FieldTrigger } from "./Field";
import { Icon, IconName } from "./Icon";
import { Row } from "./Stack";

type Props = {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  leftIcon?: IconName;
  disabled?: boolean;
  /** Earliest selectable day (e.g. today for a due date) */
  minDate?: Date;
  maxDate?: Date;
  /** Show a "Clear" button in the sheet */
  clearable?: boolean;
  /** 1 = weeks start on Monday (default), 0 = Sunday */
  weekStartsOn?: 0 | 1;
};

/** Date field → opens a calendar in a bottom sheet. Same look on iOS and Android. */
export function DatePicker({
  value,
  onChange,
  label,
  placeholder = "Select date",
  error,
  hint,
  leftIcon = "calendar-outline",
  disabled,
  minDate,
  maxDate,
  clearable,
  weekStartsOn = 1,
}: Props) {
  const t = useTheme();
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => value ?? new Date()); // month shown in the calendar
  const today = startOfDay(new Date());

  // Each time the sheet opens, jump to the selected month (or today's)
  useEffect(() => {
    if (open) setMonth(value ?? new Date());
  }, [open, value]);

  const min = minDate ? startOfDay(minDate) : null;
  const max = maxDate ? startOfDay(maxDate) : null;
  const isDisabledDay = (d: Date) => (!!min && d < min) || (!!max && d > max);

  const pick = (d: Date | null) => {
    haptic.select();
    onChange(d);
    setOpen(false);
  };

  const days = getMonthGrid(month, weekStartsOn);
  const weekdayLabels = Array.from(
    { length: 7 },
    (_, i) => WEEKDAYS[(i + weekStartsOn) % 7],
  );
  const quickPicks = [
    { label: "Today", date: today },
    { label: "Tomorrow", date: addDays(today, 1) },
    { label: "In 3 days", date: addDays(today, 3) },
    { label: "Next week", date: addDays(today, 7) },
  ].filter((q) => !isDisabledDay(q.date));

  return (
    <View style={styles.wrapper}>
      <FieldLabel label={label} error={error} active={open} />
      <FieldTrigger
        valueText={value ? formatRelative(value) : undefined}
        placeholder={placeholder}
        icon={leftIcon}
        rightIcon="chevron-down"
        onPress={() => setOpen(true)}
        active={open}
        error={error}
        disabled={disabled}
        accessibilityLabel={label}
      />
      <FieldMessage error={error} hint={hint} />

      <BottomSheet
        visible={open}
        onClose={() => setOpen(false)}
        title={label ?? "Select date"}
        footer={
          clearable && value ? (
            <AppButton
              title="Clear date"
              variant="ghost"
              icon="close-circle-outline"
              onPress={() => pick(null)}
            />
          ) : undefined
        }
      >
        {/* Quick picks */}
        <Row gap="sm" wrap style={styles.quick}>
          {quickPicks.map((q) => (
            <Chip
              key={q.label}
              label={q.label}
              selected={isSameDay(value, q.date)}
              onPress={() => pick(q.date)}
            />
          ))}
        </Row>

        {/* Month header */}
        <Row justify="space-between" style={styles.monthRow}>
          <Pressable
            onPress={() => setMonth((m) => addMonths(m, -1))}
            hitSlop={10}
            style={styles.navBtn}
            accessibilityLabel="Previous month"
          >
            <Icon name="chevron-back" size={20} />
          </Pressable>
          <AppText variant="label" style={styles.monthTitle}>
            {MONTHS_LONG[month.getMonth()]} {month.getFullYear()}
          </AppText>
          <Pressable
            onPress={() => setMonth((m) => addMonths(m, 1))}
            hitSlop={10}
            style={styles.navBtn}
            accessibilityLabel="Next month"
          >
            <Icon name="chevron-forward" size={20} />
          </Pressable>
        </Row>

        {/* Weekday labels */}
        <View style={styles.grid}>
          {weekdayLabels.map((w) => (
            <View key={w} style={styles.cell}>
              <AppText variant="caption" color="textMuted">
                {w}
              </AppText>
            </View>
          ))}

          {/* Days */}
          {days.map((d) => {
            const inMonth = d.getMonth() === month.getMonth();
            const selected = isSameDay(d, value);
            const isToday = isSameDay(d, today);
            const off = isDisabledDay(d);
            return (
              <Pressable
                key={d.toISOString()}
                disabled={off}
                onPress={() => pick(d)}
                style={styles.cell}
                accessibilityRole="button"
                accessibilityState={{ selected, disabled: off }}
                accessibilityLabel={d.toDateString()}
              >
                <View
                  style={[
                    styles.day,
                    isToday && styles.today,
                    selected && styles.selected,
                  ]}
                >
                  <AppText
                    style={[
                      selected && { color: t.colors.onPrimary },
                      (selected || isToday) && t.font("bold"),
                    ]}
                    color={
                      off || !inMonth
                        ? "textMuted"
                        : isToday
                          ? "primary"
                          : "text"
                    }
                  >
                    {d.getDate()}
                  </AppText>
                </View>
              </Pressable>
            );
          })}
        </View>
      </BottomSheet>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  wrapper: { gap: t.spacing.xs + 2 },
  quick: { paddingBottom: t.spacing.md },
  monthRow: { paddingVertical: t.spacing.xs },
  monthTitle: { fontSize: t.typography.body.fontSize },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: t.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: t.colors.surfaceMuted,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", paddingBottom: t.spacing.md },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  day: {
    width: "84%",
    height: "84%",
    borderRadius: t.radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  today: { backgroundColor: alpha(t.colors.primary, 0.1) },
  selected: {
    backgroundColor: t.colors.primary,
    boxShadow: t.shadow.glow(t.colors.primary),
  },
}));
