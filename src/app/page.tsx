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
    <div className="animate-fade-in">
      <ul className="grid grid-cols-1 gap-3 lg:grid-cols-4 lg:gap-3">
        {TOPICS.map((topic) => (
          <li key={topic.slug} className="min-w-0">
            <Link
              href={withGeographyParam(`/topics/${topic.slug}`, geography.code)}
              className="border-border/80 bg-card/70 hover:border-primary/45 hover:bg-accent/55 group flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border px-4 py-5 text-center transition-[background-color,border-color,transform,box-shadow] duration-200 hover:scale-[1.02] hover:shadow-sm lg:aspect-[5/4] lg:min-h-0 lg:gap-1.5 lg:p-4 lg:hover:scale-[1.015]"
            >
              <span
                className="text-6xl leading-none transition-transform duration-200 group-hover:scale-105 lg:text-[clamp(2.75rem,7vh,4.5rem)]"
                aria-hidden="true"
              >
                {topic.emoji}
              </span>
              <span className="font-heading text-foreground group-hover:text-primary text-base font-semibold tracking-tight transition-colors lg:text-xl xl:text-2xl">
                {topic.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
