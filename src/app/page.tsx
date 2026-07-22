import Link from "next/link";

import { TOPICS } from "@/lib/topics";
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

  return (
    <div className="animate-fade-in flex flex-col gap-8 lg:h-[calc(100dvh-7rem)] lg:gap-4 lg:overflow-hidden">
      <section className="flex max-w-2xl shrink-0 flex-col gap-2 lg:gap-1.5">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2rem] lg:leading-tight">
          UK Census Data
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          Explore UK Census 2021 statistics by topic and region.
        </p>
      </section>

      <ul className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-4 lg:grid-rows-2 lg:gap-3">
        {TOPICS.map((topic) => (
          <li key={topic.slug} className="min-h-0 min-w-0">
            <Link
              href={withGeographyParam(`/topics/${topic.slug}`, geography.code)}
              className="border-border/80 bg-card/70 hover:border-primary/45 hover:bg-accent/55 group flex min-h-36 flex-col items-center justify-center gap-3 rounded-lg border px-4 py-6 text-center transition-[background-color,border-color,transform,box-shadow] duration-200 hover:scale-[1.02] hover:shadow-sm lg:h-full lg:min-h-0 lg:gap-3 lg:p-4 lg:hover:scale-[1.015]"
            >
              <span
                className="text-6xl leading-none transition-transform duration-200 group-hover:scale-105 lg:text-5xl xl:text-6xl"
                aria-hidden="true"
              >
                {topic.emoji}
              </span>
              <span className="text-foreground group-hover:text-primary text-base font-medium transition-colors lg:text-sm xl:text-base">
                {topic.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
