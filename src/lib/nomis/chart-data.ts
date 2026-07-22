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
  /** NOMIS percent (20301) for the same category code, when available. */
  percent?: number;
};

/** Build a code → percent lookup from a percent-measure series. */
export function percentByCode(
  observations: CensusObservation[],
): Map<string, number> {
  const map = new Map<string, number>();
  for (const row of observations) {
    if (row.value !== null && Number.isFinite(row.value)) {
      map.set(row.code, row.value);
    }
  }
  return map;
}

/** Map series rows to chart-ready points (null values omitted). */
export function toChartData(
  observations: CensusObservation[],
  percents?: Map<string, number>,
): ChartDatum[] {
  return observations
    .filter((row): row is CensusObservation & { value: number } => {
      return row.value !== null && Number.isFinite(row.value);
    })
    .map((row) => {
      const percent = percents?.get(row.code);
      return {
        code: row.code,
        name: row.label,
        value: row.value,
        ...(percent !== undefined ? { percent } : {}),
      };
    });
}
