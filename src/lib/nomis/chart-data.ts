import type { CensusObservation } from "@/lib/nomis/types";

/** Hierarchical NOMIS categories: leaf codes vs 1000+ rollups. */
export type CategoryMode = "all" | "detail" | "summary";

function isTotalLabel(label: string): boolean {
  const normalized = label.trim().toLowerCase();
  return normalized === "total" || normalized.startsWith("total:");
}

function numericCode(code: string): number | null {
  const value = Number(code);
  return Number.isFinite(value) ? value : null;
}

/** Drop aggregate Total / All rows and optional hierarchy levels. */
export function filterChartObservations(
  observations: CensusObservation[],
  options: {
    excludeTotals?: boolean;
    categoryMode?: CategoryMode;
  } = {},
): CensusObservation[] {
  let rows = observations;

  if (options.excludeTotals) {
    rows = rows.filter((row) => {
      if (isTotalLabel(row.label)) {
        return false;
      }
      // Census Topic Summary tables use code "0" for the universe total.
      return row.code !== "0";
    });
  }

  const mode = options.categoryMode ?? "all";
  if (mode === "detail") {
    rows = rows.filter((row) => {
      const code = numericCode(row.code);
      return code === null || code < 1000;
    });
  } else if (mode === "summary") {
    rows = rows.filter((row) => {
      const code = numericCode(row.code);
      return code !== null && code >= 1000;
    });
  }

  return rows;
}

export type ChartDatum = {
  code: string;
  name: string;
  value: number;
};

/** Map series rows to chart-ready points (null values omitted). */
export function toChartData(observations: CensusObservation[]): ChartDatum[] {
  return observations
    .filter((row): row is CensusObservation & { value: number } => {
      return row.value !== null && Number.isFinite(row.value);
    })
    .map((row) => ({
      code: row.code,
      name: row.label,
      value: row.value,
    }));
}
