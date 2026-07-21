import Link from "next/link";

import { getTopicsWithCharts } from "@/lib/topic-map";
import {
  resolveGeographyFromParam,
  withGeographyParam,
} from "@/lib/geography-url";

type HomePageProps = {
  searchParams: Promise<{ geography?: string | string[] }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const geography = resolveGeographyFromParam(params.geography);
  const topics = getTopicsWithCharts();

  return (
    <div className="flex flex-col gap-10">
      <section className="flex max-w-2xl flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          UK Census Data
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          Explore UK Census 2021 statistics by topic and region. Charts load
          live from NOMIS for the selected geography.
        </p>
        <p className="text-sm">
          Showing:{" "}
          <span className="text-foreground font-medium">{geography.name}</span>
          <span className="text-muted-foreground">
            {" "}
            — change region in the header.
          </span>
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-medium tracking-tight">Topics</h2>
          <p className="text-muted-foreground text-sm">
            v1 charts per topic, filtered by the region in the header.
          </p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {topics.map((topic) => (
            <li key={topic.slug}>
              <Link
                href={withGeographyParam(
                  `/topics/${topic.slug}`,
                  geography.code,
                )}
                className="hover:bg-muted/50 block rounded-lg border p-4 transition-colors"
              >
                <span className="block text-sm font-medium">{topic.name}</span>
                <span className="text-muted-foreground mt-1 block text-sm">
                  {topic.description}
                </span>
                <span className="text-muted-foreground mt-2 block text-xs">
                  {topic.charts.map((chart) => chart.name).join(" · ")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
