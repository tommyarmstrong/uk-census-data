"use client";

import { Suspense } from "react";

import { RegionFilter } from "@/components/layout/region-filter";

function TopicRegionFilterInner() {
  return (
    <RegionFilter
      id="region-filter-topic"
      className="w-full max-w-md"
      fullWidth
    />
  );
}

function TopicRegionFilterFallback() {
  return (
    <div className="text-muted-foreground flex h-11 items-center text-xs">
      Region
    </div>
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
