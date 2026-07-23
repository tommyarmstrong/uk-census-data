import type { CategoryMode } from "@/lib/nomis/chart-data";
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
  /** When true, drop universe Total / All rows */
  excludeTotals?: boolean;
  /** Prefer leaf categories or 1000+ section rollups when both exist */
  categoryMode?: CategoryMode;
};

export type TopicWithCharts = Topic & {
  charts: TopicChart[];
};

/**
 * Topic Summary charts for the eight major topics (v1 + v3 + Stage 4 + follow-on).
 * Inventory and rationale: docs/topic-map.md
 */
export const TOPIC_CHARTS: TopicChart[] = [
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
    id: "demographics-ethnicity",
    slug: "ethnicity",
    name: "Ethnic group",
    description: "Usual residents by ethnic group.",
    datasetId: "NM_2041_1",
    tableCode: "TS021",
    categoryDimension: "c2021_eth_20",
    chartType: "horizontal-bar",
    excludeTotals: true,
    categoryMode: "detail",
  },
  {
    id: "demographics-religion",
    slug: "religion",
    name: "Religion",
    description: "Usual residents by religion.",
    datasetId: "NM_2049_1",
    tableCode: "TS030",
    categoryDimension: "c2021_religion_10",
    chartType: "horizontal-bar",
    excludeTotals: true,
  },
  {
    id: "demographics-sexual-orientation",
    slug: "sexual-orientation",
    name: "Sexual orientation",
    description: "Usual residents aged 16+ by sexual orientation.",
    datasetId: "NM_2060_1",
    tableCode: "TS077",
    categoryDimension: "c2021_sexor_6",
    chartType: "horizontal-bar",
    excludeTotals: true,
  },
  {
    id: "demographics-gender-identity",
    slug: "gender-identity",
    name: "Gender identity",
    description: "Usual residents aged 16+ by gender identity.",
    datasetId: "NM_2061_1",
    tableCode: "TS078",
    categoryDimension: "c2021_genderid_7",
    chartType: "horizontal-bar",
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
    id: "housing-cars",
    slug: "cars-or-vans",
    name: "Car or van availability",
    description: "Households by number of cars or vans available.",
    datasetId: "NM_2063_1",
    tableCode: "TS045",
    categoryDimension: "c2021_cars_5",
    chartType: "bar",
    excludeTotals: true,
  },
  {
    id: "housing-central-heating",
    slug: "central-heating",
    name: "Central heating",
    description: "Households by type of central heating.",
    datasetId: "NM_2064_1",
    tableCode: "TS046",
    categoryDimension: "c2021_heating_13",
    chartType: "horizontal-bar",
    excludeTotals: true,
  },
  {
    id: "housing-bedrooms",
    slug: "bedrooms",
    name: "Number of bedrooms",
    description: "Households by number of bedrooms.",
    datasetId: "NM_2068_1",
    tableCode: "TS050",
    categoryDimension: "c2021_bedrooms_5",
    chartType: "bar",
    excludeTotals: true,
  },
  {
    id: "housing-occupancy-bedrooms",
    slug: "occupancy-rating-bedrooms",
    name: "Occupancy rating for bedrooms",
    description:
      "Households by bedroom occupancy rating (overcrowding / under-occupancy).",
    datasetId: "NM_2070_1",
    tableCode: "TS052",
    categoryDimension: "c2021_occrat_bedrooms_6",
    chartType: "bar",
    excludeTotals: true,
  },
  {
    id: "housing-deprivation",
    slug: "household-deprivation",
    name: "Households by deprivation dimensions",
    description:
      "Households by number of Census deprivation dimensions they are deprived in.",
    datasetId: "NM_2031_1",
    tableCode: "TS011",
    categoryDimension: "c2021_dep_6",
    chartType: "bar",
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
    categoryMode: "detail",
  },
  {
    id: "employment-industry",
    slug: "industry",
    name: "Industry",
    description:
      "Usual residents in employment by industry section (SIC sections).",
    datasetId: "NM_2077_1",
    tableCode: "TS060",
    categoryDimension: "c2021_ind_88",
    chartType: "horizontal-bar",
    excludeTotals: true,
    categoryMode: "summary",
  },
  {
    id: "employment-occupation",
    slug: "occupation",
    name: "Occupation",
    description: "Usual residents in employment by occupation.",
    datasetId: "NM_2080_1",
    tableCode: "TS063",
    categoryDimension: "c2021_occ_10",
    chartType: "horizontal-bar",
    excludeTotals: true,
  },
  {
    id: "employment-hours-worked",
    slug: "hours-worked",
    name: "Hours worked",
    description: "Usual residents in employment by hours worked.",
    datasetId: "NM_2076_1",
    tableCode: "TS059",
    categoryDimension: "c2021_hours_5",
    chartType: "bar",
    excludeTotals: true,
    categoryMode: "detail",
  },
  {
    id: "employment-ns-sec",
    slug: "ns-sec",
    name: "NS-SeC",
    description:
      "Usual residents aged 16+ by National Statistics Socio-economic Classification.",
    datasetId: "NM_2079_1",
    tableCode: "TS062",
    categoryDimension: "c2021_nssec_10",
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
    id: "education-students",
    slug: "students",
    name: "Schoolchildren and full-time students",
    description:
      "Usual residents aged 5+ who are schoolchildren or full-time students.",
    datasetId: "NM_2085_1",
    tableCode: "TS068",
    categoryDimension: "c2021_student_3",
    chartType: "pie",
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
    id: "health-disability",
    slug: "disability",
    name: "Disability",
    description: "Usual residents by disability status under the Equality Act.",
    datasetId: "NM_2056_1",
    tableCode: "TS038",
    categoryDimension: "c2021_disability_5",
    chartType: "horizontal-bar",
    excludeTotals: true,
    categoryMode: "detail",
  },
  {
    id: "health-unpaid-care",
    slug: "unpaid-care",
    name: "Provision of unpaid care",
    description: "Usual residents aged 5+ by provision of unpaid care.",
    datasetId: "NM_2057_1",
    tableCode: "TS039",
    categoryDimension: "c2021_carer_7",
    chartType: "horizontal-bar",
    excludeTotals: true,
    categoryMode: "detail",
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
    id: "transport-distance",
    slug: "distance-to-work",
    name: "Distance travelled to work",
    description: "Usual residents in employment by distance travelled to work.",
    datasetId: "NM_2075_1",
    tableCode: "TS058",
    categoryDimension: "c2021_ttwdist_11",
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
    categoryMode: "detail",
  },
  {
    id: "family-legal-partnership",
    slug: "legal-partnership",
    name: "Legal partnership status",
    description: "Usual residents aged 16+ by legal partnership status.",
    datasetId: "NM_2022_1",
    tableCode: "TS002",
    categoryDimension: "c2021_lpstat_12",
    chartType: "horizontal-bar",
    excludeTotals: true,
    categoryMode: "detail",
  },
  {
    id: "family-living-arrangements",
    slug: "living-arrangements",
    name: "Living arrangements",
    description: "Usual residents by living arrangements.",
    datasetId: "NM_2030_1",
    tableCode: "TS010",
    categoryDimension: "c2021_living_11",
    chartType: "horizontal-bar",
    excludeTotals: true,
    categoryMode: "detail",
  },
  {
    id: "family-household-size",
    slug: "household-size",
    name: "Household size",
    description: "Households by number of people in the household.",
    datasetId: "NM_2037_1",
    tableCode: "TS017",
    categoryDimension: "c2021_hhsize_10",
    chartType: "bar",
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
  {
    id: "migration-year-of-arrival",
    slug: "year-of-arrival",
    name: "Year of arrival in the UK",
    description: "Usual residents by year of arrival in the UK.",
    datasetId: "NM_2035_1",
    tableCode: "TS015",
    categoryDimension: "c2021_arruk_13",
    chartType: "bar",
    excludeTotals: true,
  },
  {
    id: "migration-length-of-residence",
    slug: "length-of-residence",
    name: "Length of residence in the UK",
    description: "Usual residents by length of residence in the UK.",
    datasetId: "NM_2036_1",
    tableCode: "TS016",
    categoryDimension: "c2021_resuk_6",
    chartType: "bar",
    excludeTotals: true,
  },
  {
    id: "migration-english-proficiency",
    slug: "english-proficiency",
    name: "Proficiency in English",
    description:
      "Usual residents aged 3+ by proficiency in English (English or Welsh in Wales).",
    datasetId: "NM_2048_1",
    tableCode: "TS029",
    categoryDimension: "c2021_engprf_6",
    chartType: "horizontal-bar",
    excludeTotals: true,
    categoryMode: "detail",
  },
];

/**
 * Chart ids use `{prefix}-…` where prefix is the topic slug, or the segment
 * before `-and-` for compound slugs (e.g. health-and-disability → health).
 */
function chartIdPrefixForTopic(topicSlug: string): string {
  const andIndex = topicSlug.indexOf("-and-");
  return andIndex === -1 ? topicSlug : topicSlug.slice(0, andIndex);
}

export function getChartsForTopic(topicSlug: string): TopicChart[] {
  if (!TOPICS.some((topic) => topic.slug === topicSlug)) {
    return [];
  }
  const prefix = `${chartIdPrefixForTopic(topicSlug)}-`;
  return TOPIC_CHARTS.filter((chart) => chart.id.startsWith(prefix));
}

export function getTopicsWithCharts(): TopicWithCharts[] {
  return TOPICS.map((topic) => ({
    ...topic,
    charts: getChartsForTopic(topic.slug),
  }));
}

export function getChartById(id: string): TopicChart | undefined {
  return TOPIC_CHARTS.find((chart) => chart.id === id);
}
