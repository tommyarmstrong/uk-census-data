import {
  DEFAULT_GEOGRAPHY,
  getGeographyByCode,
  getSelectableGeographies,
  type Geography,
} from "@/lib/nomis/constants";

export { getSelectableGeographies };

/** URL search param for the global region filter. */
export const GEOGRAPHY_SEARCH_PARAM = "geography";

/** Resolve a geography code from the URL; invalid/missing → England and Wales. */
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
