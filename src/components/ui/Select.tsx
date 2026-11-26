import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { alpha } from "@/utils/color";
import { haptic } from "@/utils/haptics";

import { AppInput } from "./AppInput";
import { AppText } from "./AppText";
import { BottomSheet } from "./BottomSheet";
import { FieldLabel, FieldMessage, FieldTrigger } from "./Field";
import { Icon, IconName } from "./Icon";
import { PressableScale } from "./PressableScale";
import { Option } from "./RadioGroup";

type Props<T extends string> = {
  options: Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  leftIcon?: IconName;
  disabled?: boolean;
  /** Title of the sheet. Defaults to the label. */
  sheetTitle?: string;
  /** Show a search box. Default: automatically when there are more than 7 options */
  searchable?: boolean;
};

/** Looks like an input; tapping opens a bottom sheet with the options. */
export function Select<T extends string>({
  options,
  value,
  onChange,
  label,
  placeholder = "Select…",
  error,
  hint,
  leftIcon,
  disabled,
  sheetTitle,
  searchable = options.length > 7,
}: Props<T>) {
  const t = useTheme();
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = options.find((o) => o.value === value);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? options.filter((o) => o.label.toLowerCase().includes(q))
      : options;
  }, [options, query]);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const pick = (v: T) => {
    haptic.select();
    onChange(v);
    close();
  };

  return (
    <View style={styles.wrapper}>
      <FieldLabel label={label} error={error} active={open} />

      {/* ① THE FIELD you tap (shows the selected value) */}
      <FieldTrigger
        valueText={selected?.label}
        placeholder={placeholder}
        icon={selected?.icon ?? leftIcon}
        onPress={() => setOpen(true)}
        active={open}
        error={error}
        disabled={disabled}
        accessibilityLabel={label}
      />

      <FieldMessage error={error} hint={hint} />

      <BottomSheet
        visible={open}
        onClose={close}
        title={sheetTitle ?? label ?? "Select"}
      >
        {searchable ? (
          <View style={styles.search}>
            <AppInput
              placeholder="Search…"
              leftIcon="search"
              clearable
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
            />
          </View>
        ) : null}

        <FlatList
          data={filtered}
          keyExtractor={(o) => o.value}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <AppText color="textMuted" align="center" style={styles.empty}>
              No results for “{query}”
            </AppText>
          }
          renderItem={({ item }) => {
            const isSelected = item.value === value;
            return (
              // ② EACH OPTION ROW in the sheet (NOT a FieldTrigger)
              <PressableScale
                onPress={() => pick(item.value)}
                disabled={item.disabled}
                haptic={false}
                scaleTo={0.98}
                accessibilityRole="radio"
                accessibilityState={{
                  selected: isSelected,
                  disabled: item.disabled,
                }}
                style={[
                  styles.option,
                  isSelected && styles.optionSelected,
                  item.disabled && styles.disabled,
                ]}
              >
                {item.icon ? (
                  <Icon
                    name={item.icon}
                    color={isSelected ? "primary" : "textMuted"}
                  />
                ) : null}
                <View style={styles.optionTexts}>
                  <AppText
                    style={isSelected ? t.font("semibold") : undefined}
                    color={isSelected ? "primary" : "text"}
                  >
                    {item.label}
                  </AppText>
                  {item.description ? (
                    <AppText variant="caption" color="textMuted">
                      {item.description}
                    </AppText>
                  ) : null}
                </View>
                {isSelected ? (
                  <Icon name="checkmark-circle" color="primary" />
                ) : null}
              </PressableScale>
            );
          }}
        />
      </BottomSheet>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  wrapper: { gap: t.spacing.xs + 2 },
  disabled: { opacity: 0.5 },
  search: { paddingBottom: t.spacing.sm },
  list: { paddingBottom: t.spacing.md, gap: t.spacing.xs },
  empty: { paddingVertical: t.spacing.xl },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: t.spacing.md,
    minHeight: t.controlHeight.md,
    paddingHorizontal: t.spacing.md,
    paddingVertical: t.spacing.sm,
    borderRadius: t.radius.md,
  },
  optionSelected: { backgroundColor: alpha(t.colors.primary, 0.08) },
  optionTexts: { flex: 1, gap: 2 },
}));
