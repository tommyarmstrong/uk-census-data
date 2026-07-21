import Link from "next/link";
import { notFound } from "next/navigation";

import { ChartSlot } from "@/components/data/chart-slot";
import {
  resolveGeographyFromParam,
  withGeographyParam,
} from "@/lib/geography-url";
import { getChartsForTopic } from "@/lib/topic-map";
import { TOPICS } from "@/lib/topics";

type TopicPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ geography?: string | string[] }>;
};

export function generateStaticParams() {
  return TOPICS.map((topic) => ({ slug: topic.slug }));
}

export default async function TopicPage({
  params,
  searchParams,
}: TopicPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const topic = TOPICS.find((item) => item.slug === slug);

  if (!topic) {
    notFound();
  }

  const geography = resolveGeographyFromParam(query.geography);
  const charts = getChartsForTopic(topic.slug);

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-sm">
          <Link
            href={withGeographyParam("/", geography.code)}
            className="hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>{topic.name}</span>
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{topic.name}</h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          {topic.description}
        </p>
        <p className="text-sm">
          Showing:{" "}
          <span className="text-foreground font-medium">{geography.name}</span>
        </p>
      </div>

      {charts.length > 1 ? (
        <nav aria-label="Charts on this page" className="flex flex-wrap gap-2">
          {charts.map((chart) => (
            <a
              key={chart.id}
              href={`#${chart.slug}`}
              className="bg-muted text-muted-foreground hover:text-foreground rounded-md px-2.5 py-1 text-xs transition-colors"
            >
              {chart.name}
            </a>
          ))}
        </nav>
      ) : null}

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium tracking-tight">Charts</h2>
        <ul className="flex flex-col gap-4">
          {charts.map((chart) => (
            <ChartSlot
              key={chart.id}
              chart={chart}
              geographyCode={geography.code}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}
