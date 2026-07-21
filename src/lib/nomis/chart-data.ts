import type { CensusObservation } from "@/lib/nomis/types";

/** Drop aggregate Total:… rows when a chart opts in. */
export function filterChartObservations(
  observations: CensusObservation[],
  options: { excludeTotals?: boolean } = {},
): CensusObservation[] {
  if (!options.excludeTotals) {
    return observations;
  }

  return observations.filter(
    (row) => !row.label.trim().toLowerCase().startsWith("total:"),
  );
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
