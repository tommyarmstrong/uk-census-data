import { NOMIS_MEASURES, type NomisMeasureCode } from "@/lib/nomis/constants";

export function isNomisMeasureCode(value: string): value is NomisMeasureCode {
  return value === NOMIS_MEASURES.value || value === NOMIS_MEASURES.percent;
}

export function measureDisplayName(code: string): "Count" | "Percent" {
  return code === NOMIS_MEASURES.percent ? "Percent" : "Count";
}

/** Format a single measure value for axes or standalone display. */
export function formatMeasureValue(value: number, measures: string): string {
  if (measures === NOMIS_MEASURES.percent) {
    return `${new Intl.NumberFormat("en-GB", {
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
    }).format(value)}%`;
  }

  return new Intl.NumberFormat("en-GB").format(value);
}

/** Tooltip-style label: count with optional percent, e.g. "15,258,981 (61.6%)". */
export function formatCountWithPercent(
  count: number,
  percent?: number,
): string {
  const countLabel = formatMeasureValue(count, NOMIS_MEASURES.value);
  if (percent === undefined) {
    return countLabel;
  }
  return `${countLabel} (${formatMeasureValue(percent, NOMIS_MEASURES.percent)})`;
}
