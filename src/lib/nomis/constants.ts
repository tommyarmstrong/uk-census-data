/** NOMIS API and Census 2021 lookup constants. See docs/nomis-research.md. */

export const NOMIS_BASE_URL = "https://www.nomisweb.co.uk/api/v01";

/** Guest cell limit for JSON-stat downloads. */
export const NOMIS_GUEST_CELL_LIMIT = 25_000;

/**
 * Client hygiene: max concurrent NOMIS proxy calls and min gap between starts.
 * Keeps topic pages with multiple charts from stampeding the upstream API.
 */
export const NOMIS_CLIENT_MAX_CONCURRENT = 2;
export const NOMIS_CLIENT_MIN_INTERVAL_MS = 300;

/** Server proxy: max requests per client IP within the window. */
export const NOMIS_PROXY_RATE_LIMIT = 30;
export const NOMIS_PROXY_RATE_WINDOW_MS = 60_000;

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

export const ENGLAND: Geography = {
  code: "2092957699",
  name: "England",
  gss: "E92000001",
};

export const WALES: Geography = {
  code: "2092957700",
  name: "Wales",
  gss: "W92000004",
};

/** English regions (TYPE480 under England and Wales). */
export const ENGLISH_REGIONS: Geography[] = [
  { code: "2013265921", name: "North East", gss: "E12000001" },
  { code: "2013265922", name: "North West", gss: "E12000002" },
  { code: "2013265923", name: "Yorkshire and The Humber", gss: "E12000003" },
  { code: "2013265924", name: "East Midlands", gss: "E12000004" },
  { code: "2013265925", name: "West Midlands", gss: "E12000005" },
  { code: "2013265926", name: "East", gss: "E12000006" },
  { code: "2013265927", name: "London", gss: "E12000007" },
  { code: "2013265928", name: "South East", gss: "E12000008" },
  { code: "2013265929", name: "South West", gss: "E12000009" },
];

/** TYPE480 Wales region code (same GSS as country Wales; kept for old links). */
const WALES_REGION: Geography = {
  code: "2013265930",
  name: "Wales",
  gss: "W92000004",
};

export const DEFAULT_GEOGRAPHY = ENGLAND_AND_WALES;

/** Geography TYPE code for regions. */
export const GEOGRAPHY_TYPE_REGIONS = "TYPE480";

const GEOGRAPHY_BY_CODE: Record<string, Geography> = Object.fromEntries(
  [ENGLAND_AND_WALES, ENGLAND, WALES, WALES_REGION, ...ENGLISH_REGIONS].map(
    (geo) => [geo.code, geo],
  ),
);

export function getGeographyByCode(code: string): Geography | undefined {
  return GEOGRAPHY_BY_CODE[code];
}

/** Filter options: E&W, England, Wales, then English regions A–Z. */
export function getSelectableGeographies(): Geography[] {
  const regions = [...ENGLISH_REGIONS].sort((a, b) =>
    a.name.localeCompare(b.name, "en-GB"),
  );
  return [ENGLAND_AND_WALES, ENGLAND, WALES, ...regions];
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
