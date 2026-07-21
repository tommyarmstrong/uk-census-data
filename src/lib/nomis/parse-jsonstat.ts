import type {
  CensusObservation,
  CensusSeries,
  JsonStatDataset,
} from "@/lib/nomis/types";

const SKIP_DIMENSIONS = new Set(["time", "geography", "measures", "freq"]);

function isJsonStatDataset(value: unknown): value is JsonStatDataset {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<JsonStatDataset>;
  return (
    candidate.class === "dataset" &&
    Array.isArray(candidate.id) &&
    Array.isArray(candidate.size) &&
    Array.isArray(candidate.value) &&
    typeof candidate.dimension === "object" &&
    candidate.dimension !== null
  );
}

function labelsInIndexOrder(
  category: JsonStatDataset["dimension"][string]["category"],
): Array<{ code: string; label: string }> {
  return Object.entries(category.index)
    .sort(([, a], [, b]) => a - b)
    .map(([code]) => ({
      code,
      label: category.label[code] ?? code,
    }));
}

function findCategoryDimension(ids: string[]): string {
  const category = ids.find((id) => !SKIP_DIMENSIONS.has(id));
  if (!category) {
    throw new Error("JSON-stat response has no category dimension");
  }
  return category;
}

/**
 * Parse a NOMIS JSON-stat response into a flat category series for one geography.
 * Expects a single geography and single measure in the response.
 */
export function parseJsonStatSeries(
  raw: unknown,
  options: {
    datasetId: string;
    geographyCode: string;
    measuresCode: string;
    fetchedAt?: string;
  },
): CensusSeries {
  if (!isJsonStatDataset(raw)) {
    throw new Error("Invalid JSON-stat dataset response");
  }

  const geographyDim = raw.dimension.geography;
  if (!geographyDim) {
    throw new Error("JSON-stat response missing geography dimension");
  }

  const geographyEntries = labelsInIndexOrder(geographyDim.category);
  if (geographyEntries.length !== 1) {
    throw new Error(
      `Expected one geography in response, got ${geographyEntries.length}`,
    );
  }

  const categoryDimension = findCategoryDimension(raw.id);
  const categoryDim = raw.dimension[categoryDimension];
  if (!categoryDim) {
    throw new Error(`Missing category dimension: ${categoryDimension}`);
  }

  const categoryEntries = labelsInIndexOrder(categoryDim.category);
  const dimIndex = Object.fromEntries(raw.id.map((id, index) => [id, index]));
  const categoryAxis = dimIndex[categoryDimension];
  const geographyAxis = dimIndex.geography;

  if (categoryAxis === undefined || geographyAxis === undefined) {
    throw new Error("Could not locate category or geography axis");
  }

  const observations: CensusObservation[] = categoryEntries.map(
    (entry, categoryPos) => {
      const coords = raw.id.map(() => 0);
      coords[categoryAxis] = categoryPos;
      coords[geographyAxis] = 0;

      let flatIndex = 0;
      for (let axis = 0; axis < coords.length; axis += 1) {
        let stride = 1;
        for (let later = axis + 1; later < coords.length; later += 1) {
          stride *= raw.size[later] ?? 1;
        }
        flatIndex += coords[axis]! * stride;
      }

      return {
        code: entry.code,
        label: entry.label,
        value: raw.value[flatIndex] ?? null,
      };
    },
  );

  return {
    datasetId: options.datasetId,
    label: raw.label,
    source: raw.source ?? "ONS / NOMIS",
    updated: raw.updated,
    geographyCode: options.geographyCode,
    geographyLabel: geographyEntries[0]!.label,
    categoryDimension,
    measuresCode: options.measuresCode,
    observations,
    fetchedAt: options.fetchedAt ?? new Date().toISOString(),
  };
}
