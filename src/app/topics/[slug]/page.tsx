import { notFound } from "next/navigation";

import { TopicCharts } from "@/components/data/topic-charts";
import { TopicRegionFilter } from "@/components/layout/topic-region-filter";
import { resolveGeographyFromParam } from "@/lib/geography-url";
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
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {topic.name}
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          {topic.description}
        </p>
        <TopicRegionFilter />
      </div>

      <TopicCharts charts={charts} geographyCode={geography.code} />
    </div>
  );
}
