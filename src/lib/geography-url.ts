import {
  DEFAULT_GEOGRAPHY,
  ENGLAND_AND_WALES,
  getGeographyByCode,
  REGIONS,
  type Geography,
} from "@/lib/nomis/constants";

/** URL search param for the global region filter. */
export const GEOGRAPHY_SEARCH_PARAM = "geography";

export function getSelectableGeographies(): Geography[] {
  return [ENGLAND_AND_WALES, ...REGIONS];
}

/** Resolve a geography code from the URL; invalid/missing → North West default. */
export function resolveGeographyFromParam(
  value: string | string[] | undefined | null,
): Geography {
  const code = Array.isArray(value) ? value[0] : value;
  if (!code) {
    return DEFAULT_GEOGRAPHY;
  }
  return getGeographyByCode(code) ?? DEFAULT_GEOGRAPHY;
}

/** Build a path that preserves the selected geography. */
export function withGeographyParam(
  pathname: string,
  geographyCode: string,
): string {
  const params = new URLSearchParams();
  params.set(GEOGRAPHY_SEARCH_PARAM, geographyCode);
  return `${pathname}?${params.toString()}`;
}
