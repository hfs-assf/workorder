/**
 * Same color, different opacity.
 *   alpha('#1E6FD9', 0.2) → 'rgba(30, 111, 217, 0.2)'
 * Use this instead of writing rgba() by hand, so colors always come from the theme.
 */
export function alpha(hex: string, opacity: number): string {
  let h = hex.replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join(""); // #abc → #aabbcc
  const n = parseInt(h.slice(0, 6), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
