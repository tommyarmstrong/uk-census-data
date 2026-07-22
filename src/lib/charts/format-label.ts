/**
 * Presentation helpers for chart axis/legend labels.
 * Full NOMIS labels stay on the datum for tooltips and exports.
 */

/** Truncate a label with an ellipsis, preserving readability. */
export function truncateChartLabel(label: string, maxLength: number): string {
  const trimmed = label.trim();
  if (maxLength <= 0) {
    return "";
  }
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  if (maxLength === 1) {
    return "…";
  }
  return `${trimmed.slice(0, maxLength - 1).trimEnd()}…`;
}

/**
 * Prefer the leaf after the last ": " for hierarchical NOMIS labels
 * (e.g. "Asian…: Indian" → "Indian"), then truncate to maxLength.
 */
export function formatChartAxisLabel(label: string, maxLength: number): string {
  const trimmed = label.trim();
  const separator = trimmed.lastIndexOf(": ");
  const leaf = separator >= 0 ? trimmed.slice(separator + 2).trim() : trimmed;
  const candidate = leaf.length > 0 ? leaf : trimmed;
  return truncateChartLabel(candidate, maxLength);
}

export type ChartLabelLayout = "axis-y" | "axis-x" | "legend";

/** Character budget for truncated display labels by layout and viewport. */
export function chartLabelMaxLength(
  layout: ChartLabelLayout,
  narrow: boolean,
): number {
  if (layout === "legend") {
    return narrow ? 28 : 40;
  }
  if (layout === "axis-x") {
    return narrow ? 10 : 16;
  }
  return narrow ? 14 : 22;
}

/** Estimate Y-axis width (px) from the longest display label. */
export function yAxisWidthForLabels(
  displayLabels: string[],
  narrow: boolean,
): number {
  const longest = displayLabels.reduce(
    (max, label) => Math.max(max, label.length),
    0,
  );
  const estimated = Math.ceil(longest * (narrow ? 6.5 : 7) + 16);
  const min = narrow ? 72 : 96;
  const max = narrow ? 120 : 168;
  return Math.min(max, Math.max(min, estimated));
}

/** Vertical bars become hard to read past this many categories. */
export const DENSE_VERTICAL_BAR_THRESHOLD = 9;
