"use client";

import { Suspense } from "react";

import { RegionFilter } from "@/components/layout/region-filter";

function TopicRegionFilterInner() {
  return <RegionFilter id="region-filter-topic" />;
}

function TopicRegionFilterFallback() {
  return (
    <div
      className="bg-muted/40 h-11 w-[15rem] animate-pulse rounded-lg sm:h-8"
      aria-hidden
    />
  );
}

/** Geography control for topic pages (replaces the static “Showing: …” line). */
export function TopicRegionFilter() {
  return (
    <Suspense fallback={<TopicRegionFilterFallback />}>
      <TopicRegionFilterInner />
    </Suspense>
  );
}
