import type { ChartDatum } from "@/lib/nomis/chart-data";
import type { CensusSeries } from "@/lib/nomis/types";
import type { TopicChart } from "@/lib/topic-map";

function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

export function buildExportBasename(
  chart: TopicChart,
  series: CensusSeries,
): string {
  const geo = slugify(series.geographyLabel || series.geographyCode);
  return `${slugify(chart.tableCode)}-${slugify(chart.slug)}-${geo}`;
}

/** CSV with readable category labels (no invented values). */
export function seriesToCsv(
  chart: TopicChart,
  series: CensusSeries,
  data: ChartDatum[],
): string {
  const header = [
    "category",
    "code",
    "value",
    "percent",
    "geography",
    "dataset",
    "table",
  ];
  const rows = data.map((row) =>
    [
      escapeCsvField(row.name),
      escapeCsvField(row.code),
      String(row.value),
      row.percent !== undefined ? String(row.percent) : "",
      escapeCsvField(series.geographyLabel),
      escapeCsvField(chart.datasetId),
      escapeCsvField(chart.tableCode),
    ].join(","),
  );
  return [header.join(","), ...rows].join("\n") + "\n";
}

export function seriesToJson(
  chart: TopicChart,
  series: CensusSeries,
  data: ChartDatum[],
): string {
  return `${JSON.stringify(
    {
      chart: {
        id: chart.id,
        name: chart.name,
        tableCode: chart.tableCode,
        datasetId: chart.datasetId,
        chartType: chart.chartType,
      },
      geography: {
        code: series.geographyCode,
        label: series.geographyLabel,
      },
      measures: {
        value: "20100",
        percent: "20301",
      },
      source: series.source,
      fetchedAt: series.fetchedAt,
      observations: data.map((row) => ({
        category: row.name,
        code: row.code,
        value: row.value,
        ...(row.percent !== undefined ? { percent: row.percent } : {}),
      })),
    },
    null,
    2,
  )}\n`;
}

export function downloadTextFile(
  filename: string,
  content: string,
  mime: string,
): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
