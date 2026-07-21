import type { Topic } from "@/lib/topics";
import { TOPICS } from "@/lib/topics";

export type ChartType = "bar" | "pie" | "horizontal-bar";

export type TopicChart = {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** NOMIS dataset id, e.g. NM_2028_1 */
  datasetId: string;
  /** ONS table mnemonic, e.g. TS008 */
  tableCode: string;
  /** JSON-stat category dimension (lowercase), e.g. c_sex */
  categoryDimension: string;
  chartType: ChartType;
  /** When true, drop rows whose label starts with "Total:" */
  excludeTotals?: boolean;
};

export type TopicWithCharts = Topic & {
  charts: TopicChart[];
};

/**
 * v1 chart set: 1–2 NOMIS Topic Summary tables per major topic.
 * Full candidate list and rationale: docs/topic-map.md
 */
export const V1_CHARTS: TopicChart[] = [
  {
    id: "demographics-sex",
    slug: "sex",
    name: "Sex",
    description: "Usual residents by sex.",
    datasetId: "NM_2028_1",
    tableCode: "TS008",
    categoryDimension: "c_sex",
    chartType: "pie",
    excludeTotals: true,
  },
  {
    id: "demographics-age",
    slug: "age",
    name: "Age (five-year bands)",
    description: "Usual residents by five-year age band.",
    datasetId: "NM_2020_1",
    tableCode: "TS007A",
    categoryDimension: "c2021_age_19",
    chartType: "bar",
    excludeTotals: true,
  },
  {
    id: "housing-tenure",
    slug: "tenure",
    name: "Tenure",
    description: "Households by tenure.",
    datasetId: "NM_2072_1",
    tableCode: "TS054",
    categoryDimension: "c2021_tenure_9",
    chartType: "bar",
    excludeTotals: true,
  },
  {
    id: "housing-accommodation",
    slug: "accommodation",
    name: "Accommodation type",
    description: "Households by accommodation type.",
    datasetId: "NM_2062_1",
    tableCode: "TS044",
    categoryDimension: "c2021_acctype_9",
    chartType: "horizontal-bar",
    excludeTotals: true,
  },
  {
    id: "employment-economic-activity",
    slug: "economic-activity",
    name: "Economic activity",
    description: "Usual residents by economic activity status.",
    datasetId: "NM_2083_1",
    tableCode: "TS066",
    categoryDimension: "c2021_eastat_20",
    chartType: "horizontal-bar",
    excludeTotals: true,
  },
  {
    id: "education-qualification",
    slug: "highest-qualification",
    name: "Highest qualification",
    description: "Usual residents aged 16+ by highest level of qualification.",
    datasetId: "NM_2084_1",
    tableCode: "TS067",
    categoryDimension: "c2021_hiqual_8",
    chartType: "bar",
    excludeTotals: true,
  },
  {
    id: "health-general",
    slug: "general-health",
    name: "General health",
    description: "Usual residents by self-reported general health.",
    datasetId: "NM_2055_1",
    tableCode: "TS037",
    categoryDimension: "c2021_health_6",
    chartType: "bar",
    excludeTotals: true,
  },
  {
    id: "transport-method",
    slug: "travel-to-work",
    name: "Method of travel to work",
    description: "Usual residents in employment by method of travel to work.",
    datasetId: "NM_2078_1",
    tableCode: "TS061",
    categoryDimension: "c2021_ttwmeth_12",
    chartType: "horizontal-bar",
    excludeTotals: true,
  },
  {
    id: "family-household-composition",
    slug: "household-composition",
    name: "Household composition",
    description: "Households by composition.",
    datasetId: "NM_2023_1",
    tableCode: "TS003",
    categoryDimension: "c2021_hhcomp_15",
    chartType: "horizontal-bar",
    excludeTotals: true,
  },
  {
    id: "migration-country-of-birth",
    slug: "country-of-birth",
    name: "Country of birth",
    description: "Usual residents by country of birth.",
    datasetId: "NM_2024_1",
    tableCode: "TS004",
    categoryDimension: "c2021_cob_12",
    chartType: "bar",
    excludeTotals: true,
  },
  {
    id: "migration-indicator",
    slug: "migrant-indicator",
    name: "Migrant indicator",
    description: "Usual residents by migrant indicator.",
    datasetId: "NM_2039_1",
    tableCode: "TS019",
    categoryDimension: "c2021_migind_4",
    chartType: "pie",
    excludeTotals: true,
  },
];

const CHARTS_BY_TOPIC: Record<string, string[]> = {
  demographics: ["demographics-sex", "demographics-age"],
  housing: ["housing-tenure", "housing-accommodation"],
  employment: ["employment-economic-activity"],
  education: ["education-qualification"],
  "health-and-disability": ["health-general"],
  transport: ["transport-method"],
  "family-and-relationships": ["family-household-composition"],
  migration: ["migration-country-of-birth", "migration-indicator"],
};

export function getChartsForTopic(topicSlug: string): TopicChart[] {
  const ids = CHARTS_BY_TOPIC[topicSlug] ?? [];
  return ids
    .map((id) => V1_CHARTS.find((chart) => chart.id === id))
    .filter((chart): chart is TopicChart => Boolean(chart));
}

export function getTopicsWithCharts(): TopicWithCharts[] {
  return TOPICS.map((topic) => ({
    ...topic,
    charts: getChartsForTopic(topic.slug),
  }));
}

export function getChartById(id: string): TopicChart | undefined {
  return V1_CHARTS.find((chart) => chart.id === id);
}

/** Spike default: Demographics → Sex for North West. */
export const SPIKE_CHART = V1_CHARTS[0];
