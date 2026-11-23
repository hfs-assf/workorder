import { ComponentProps } from "react";

import { useTheme } from "@/hooks/use-theme";

import { AppInput } from "./AppInput";

type Props = Omit<
  ComponentProps<typeof AppInput>,
  "multiline" | "leftIcon" | "secureTextEntry"
> & {
  /** Visible lines before it starts growing. Default 4 */
  rows?: number;
  /** Stops growing at this many lines, then scrolls inside. Default 10 */
  maxRows?: number;
};

/** Multi-line text input that grows with its content, with an optional character counter. */
export function TextArea({
  rows = 4,
  maxRows = 10,
  maxLength,
  value = "",
  hint,
  style,
  ...rest
}: Props) {
  const t = useTheme();
  const line = t.typography.body.lineHeight;

  // Counter replaces the hint when maxLength is set: "120 / 500"
  const counter = maxLength ? `${value.length} / ${maxLength}` : undefined;

  return (
    <AppInput
      {...rest}
      value={value}
      maxLength={maxLength}
      multiline
      textAlignVertical="top" // Android: start typing at the top, not the middle
      hint={counter ? (hint ? `${hint} · ${counter}` : counter) : hint}
      style={[
        {
          minHeight: line * rows,
          maxHeight: line * maxRows,
          paddingTop: t.spacing.md,
        },
        style,
      ]}
    />
  );
}
