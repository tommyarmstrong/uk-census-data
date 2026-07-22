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
      <p className="text-muted-foreground max-w-2xl shrink-0 text-base leading-relaxed">
        Explore UK Census 2021 statistics by topic and region.
      </p>

      <ul className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-4 lg:grid-rows-2 lg:gap-3">
        {TOPICS.map((topic) => (
          <li key={topic.slug} className="min-h-0 min-w-0">
            <Link
              href={withGeographyParam(`/topics/${topic.slug}`, geography.code)}
              className="border-border/80 bg-card/70 hover:border-primary/45 hover:bg-accent/55 group flex min-h-36 flex-col items-center justify-center gap-3 rounded-lg border px-4 py-6 text-center transition-[background-color,border-color,transform,box-shadow] duration-200 hover:scale-[1.02] hover:shadow-sm lg:h-full lg:min-h-0 lg:justify-evenly lg:gap-2 lg:p-3 lg:hover:scale-[1.015]"
            >
              <span
                className="flex items-center justify-center text-6xl leading-none transition-transform duration-200 group-hover:scale-105 lg:min-h-0 lg:flex-1 lg:text-[clamp(3rem,11vh,5.75rem)]"
                aria-hidden="true"
              >
                {topic.emoji}
              </span>
              <span className="font-heading text-foreground group-hover:text-primary text-base font-semibold tracking-tight transition-colors lg:shrink-0 lg:text-xl xl:text-2xl">
                {topic.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
