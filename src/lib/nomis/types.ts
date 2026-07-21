/** Raw JSON-stat 2.0 dataset shape returned by NOMIS. */
export type JsonStatCategory = {
  index: Record<string, number>;
  label: Record<string, string>;
};

export type JsonStatDimension = {
  label?: string;
  category: JsonStatCategory;
};

export type JsonStatDataset = {
  version: string;
  class: string;
  label: string;
  source?: string;
  updated?: string;
  id: string[];
  size: number[];
  value: Array<number | null>;
  dimension: Record<string, JsonStatDimension>;
  extension?: {
    warnings?: Array<{ message?: string; title?: string }>;
    metadata?: Array<{ message?: string; title?: string }>;
  };
};

export type CensusObservation = {
  code: string;
  label: string;
  value: number | null;
};

export type CensusSeries = {
  datasetId: string;
  label: string;
  source: string;
  updated?: string;
  geographyCode: string;
  geographyLabel: string;
  categoryDimension: string;
  measuresCode: string;
  observations: CensusObservation[];
  fetchedAt: string;
};

export type CensusSeriesCacheEntry = {
  series: CensusSeries;
  cachedAt: string;
};

export type NomisFetchParams = {
  datasetId: string;
  geography: string;
  measures?: string;
};

export type NomisFetchSource = "network" | "cache";

export type NomisFetchResult = {
  series: CensusSeries;
  source: NomisFetchSource;
  stale?: boolean;
};
