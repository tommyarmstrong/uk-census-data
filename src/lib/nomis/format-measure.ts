import { NOMIS_MEASURES, type NomisMeasureCode } from "@/lib/nomis/constants";

export const MEASURE_OPTIONS = [
  { code: NOMIS_MEASURES.value, label: "Count" },
  { code: NOMIS_MEASURES.percent, label: "Percent" },
] as const;

export function isNomisMeasureCode(value: string): value is NomisMeasureCode {
  return value === NOMIS_MEASURES.value || value === NOMIS_MEASURES.percent;
}

export function measureDisplayName(code: string): "Count" | "Percent" {
  return code === NOMIS_MEASURES.percent ? "Percent" : "Count";
}

/** Format observation values for axes, tooltips, and accessible labels. */
export function formatMeasureValue(value: number, measures: string): string {
  if (measures === NOMIS_MEASURES.percent) {
    return `${new Intl.NumberFormat("en-GB", {
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
    }).format(value)}%`;
  }

  return new Intl.NumberFormat("en-GB").format(value);
}
