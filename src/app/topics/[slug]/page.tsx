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
    <div className="animate-fade-in flex max-w-3xl flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="text-muted-foreground text-sm">
          <Link
            href={withGeographyParam("/", geography.code)}
            className="hover:text-primary transition-colors"
          >
            Home
          </Link>
          <span className="text-border mx-2">/</span>
          <span className="text-foreground">{topic.name}</span>
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {topic.name}
        </h1>
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
              className="bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-1.5 text-xs transition-colors duration-200"
            >
              {chart.name}
            </a>
          ))}
        </nav>
      ) : null}

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Charts</h2>
        <ul className="flex flex-col gap-5">
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
