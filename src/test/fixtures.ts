import type { CensusSeries } from "@/lib/nomis/types";
import type { TopicChart } from "@/lib/topic-map";

export const SAMPLE_CHART: TopicChart = {
  id: "demographics-sex",
  slug: "sex",
  name: "Sex",
  description: "Usual residents by sex.",
  datasetId: "NM_2028_1",
  tableCode: "TS008",
  categoryDimension: "c_sex",
  chartType: "pie",
  excludeTotals: true,
};

export const SAMPLE_SERIES: CensusSeries = {
  datasetId: "NM_2028_1",
  label: "Sex",
  source: "Office for National Statistics",
  geographyCode: "2013265922",
  geographyLabel: "North West",
  categoryDimension: "c_sex",
  measuresCode: "20100",
  observations: [
    { code: "0", label: "Total: All usual residents", value: 210 },
    { code: "1", label: "Female", value: 100 },
    { code: "2", label: "Male", value: 110 },
  ],
  fetchedAt: "2026-01-01T00:00:00.000Z",
};

export const SAMPLE_JSONSTAT = {
  version: "2.0",
  class: "dataset",
  label: "Sex",
  source: "Office for National Statistics",
  updated: "2023-01-01",
  id: ["geography", "c_sex", "measures"],
  size: [1, 2, 1],
  value: [100, 110],
  dimension: {
    geography: {
      label: "geography",
      category: {
        index: { "2013265922": 0 },
        label: { "2013265922": "North West" },
      },
    },
    c_sex: {
      label: "Sex",
      category: {
        index: { "1": 0, "2": 1 },
        label: { "1": "Female", "2": "Male" },
      },
    },
    measures: {
      label: "measures",
      category: {
        index: { "20100": 0 },
        label: { "20100": "value" },
      },
    },
  },
};
