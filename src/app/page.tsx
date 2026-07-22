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
    <div className="animate-fade-in flex flex-col gap-12">
      <section className="flex max-w-2xl flex-col gap-4">
        <h1 className="text-foreground text-4xl font-semibold tracking-tight sm:text-5xl">
          UK Census Data
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
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

      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight">Topics</h2>
          <p className="text-muted-foreground text-sm">
            Charts per topic, filtered by the region in the header.
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
                className="border-border/80 bg-card/70 hover:border-primary/35 hover:bg-card group block rounded-lg border p-5 transition-colors duration-200"
              >
                <span className="text-foreground group-hover:text-primary block text-base font-medium transition-colors">
                  {topic.name}
                </span>
                <span className="text-muted-foreground mt-1.5 block text-sm leading-relaxed">
                  {topic.description}
                </span>
                <span className="text-muted-foreground/90 mt-3 block text-xs tracking-wide">
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
