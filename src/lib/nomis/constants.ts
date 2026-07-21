/** NOMIS API and Census 2021 lookup constants. See docs/nomis-research.md. */

export const NOMIS_BASE_URL = "https://www.nomisweb.co.uk/api/v01";

/** Guest cell limit for JSON-stat downloads. */
export const NOMIS_GUEST_CELL_LIMIT = 25_000;

export const NOMIS_MEASURES = {
  value: "20100",
  percent: "20301",
} as const;

export type NomisMeasureCode =
  (typeof NOMIS_MEASURES)[keyof typeof NOMIS_MEASURES];

export type Geography = {
  code: string;
  name: string;
  gss: string;
};

/** England and Wales aggregate (default national view). */
export const ENGLAND_AND_WALES: Geography = {
  code: "2092957703",
  name: "England and Wales",
  gss: "K04000001",
};

/** English regions + Wales (TYPE480 under England and Wales). */
export const REGIONS: Geography[] = [
  { code: "2013265921", name: "North East", gss: "E12000001" },
  { code: "2013265922", name: "North West", gss: "E12000002" },
  { code: "2013265923", name: "Yorkshire and The Humber", gss: "E12000003" },
  { code: "2013265924", name: "East Midlands", gss: "E12000004" },
  { code: "2013265925", name: "West Midlands", gss: "E12000005" },
  { code: "2013265926", name: "East", gss: "E12000006" },
  { code: "2013265927", name: "London", gss: "E12000007" },
  { code: "2013265928", name: "South East", gss: "E12000008" },
  { code: "2013265929", name: "South West", gss: "E12000009" },
  { code: "2013265930", name: "Wales", gss: "W92000004" },
];

export const DEFAULT_GEOGRAPHY = REGIONS.find(
  (region) => region.code === "2013265922",
)!;

/** Geography TYPE code for regions. */
export const GEOGRAPHY_TYPE_REGIONS = "TYPE480";

export function getGeographyByCode(code: string): Geography | undefined {
  if (code === ENGLAND_AND_WALES.code) {
    return ENGLAND_AND_WALES;
  }
  return REGIONS.find((region) => region.code === code);
}

export function buildNomisJsonStatUrl(options: {
  datasetId: string;
  geography: string;
  measures?: string;
  date?: string;
}): string {
  const params = new URLSearchParams({
    geography: options.geography,
    measures: options.measures ?? NOMIS_MEASURES.value,
    date: options.date ?? "latest",
  });

  return `${NOMIS_BASE_URL}/dataset/${options.datasetId}.jsonstat.json?${params.toString()}`;
}
