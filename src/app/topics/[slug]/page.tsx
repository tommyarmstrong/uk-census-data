import Link from "next/link";
import { notFound } from "next/navigation";

import { getChartsForTopic } from "@/lib/topic-map";
import { TOPICS } from "@/lib/topics";

type TopicPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return TOPICS.map((topic) => ({ slug: topic.slug }));
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = TOPICS.find((item) => item.slug === slug);

  if (!topic) {
    notFound();
  }

  const charts = getChartsForTopic(topic.slug);

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-sm">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>{topic.name}</span>
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{topic.name}</h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          {topic.description}
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium tracking-tight">Planned charts</h2>
        <ul className="flex flex-col gap-3">
          {charts.map((chart) => (
            <li key={chart.id} className="rounded-lg border border-dashed p-4">
              <p className="text-sm font-medium">
                {chart.name}{" "}
                <span className="text-muted-foreground font-normal">
                  ({chart.tableCode} · {chart.chartType})
                </span>
              </p>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                {chart.description}
              </p>
              <p className="text-muted-foreground mt-3 text-sm">
                Data unavailable — chart not wired yet. See the{" "}
                <Link
                  href="/spike"
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  data-layer spike
                </Link>{" "}
                for a live NOMIS example.
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
