import { NextResponse } from "next/server";

import { buildNomisJsonStatUrl, NOMIS_MEASURES } from "@/lib/nomis/constants";
import { parseJsonStatSeries } from "@/lib/nomis/parse-jsonstat";

export const dynamic = "force-dynamic";

const DATASET_PATTERN = /^NM_\d+_\d+$/;
const GEOGRAPHY_PATTERN = /^(\d+|TYPE\d+)$/;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const datasetId = searchParams.get("dataset");
  const geography = searchParams.get("geography");
  const measures = searchParams.get("measures") ?? NOMIS_MEASURES.value;

  if (!datasetId || !DATASET_PATTERN.test(datasetId)) {
    return NextResponse.json(
      { error: "Invalid or missing dataset parameter" },
      { status: 400 },
    );
  }

  if (!geography || !GEOGRAPHY_PATTERN.test(geography)) {
    return NextResponse.json(
      { error: "Invalid or missing geography parameter" },
      { status: 400 },
    );
  }

  if (!/^\d+$/.test(measures)) {
    return NextResponse.json(
      { error: "Invalid measures parameter" },
      { status: 400 },
    );
  }

  const upstream = buildNomisJsonStatUrl({
    datasetId,
    geography,
    measures,
  });

  try {
    const response = await fetch(upstream, {
      headers: { Accept: "application/json" },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `NOMIS returned ${response.status}`,
          upstream,
        },
        { status: 502 },
      );
    }

    const raw: unknown = await response.json();
    const series = parseJsonStatSeries(raw, {
      datasetId,
      geographyCode: geography,
      measuresCode: measures,
    });

    return NextResponse.json(series);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch or parse NOMIS data",
        upstream,
      },
      { status: 502 },
    );
  }
}
