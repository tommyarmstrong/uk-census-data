"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu } from "lucide-react";

import { RegionFilter } from "@/components/layout/region-filter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  GEOGRAPHY_SEARCH_PARAM,
  resolveGeographyFromParam,
  withGeographyParam,
} from "@/lib/geography-url";
import { TOPICS } from "@/lib/topics";
import { cn } from "@/lib/utils";

function navLinkClass(active: boolean) {
  return cn(
    "rounded-md px-2 py-1.5 text-xs transition-colors",
    active
      ? "bg-muted text-foreground"
      : "text-muted-foreground hover:text-foreground",
  );
}

function sheetLinkClass(active: boolean) {
  return cn(
    "rounded-md px-3 py-2 text-sm transition-colors",
    active
      ? "bg-muted text-foreground"
      : "text-muted-foreground hover:text-foreground",
  );
}

function SiteHeaderInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const geography = resolveGeographyFromParam(
    searchParams.get(GEOGRAPHY_SEARCH_PARAM),
  );
  const geoCode = geography.code;
  const aboutHref = withGeographyParam("/about", geoCode);

  return (
    <header className="bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link
          href={withGeographyParam("/", geoCode)}
          className="shrink-0 text-sm font-semibold tracking-tight"
        >
          UK Census Data
        </Link>

        <div className="hidden min-w-0 sm:block">
          <RegionFilter id="region-filter-header" />
        </div>

        <nav
          className="ml-auto hidden items-center gap-1 lg:flex"
          aria-label="Main"
        >
          {TOPICS.map((topic) => {
            const href = withGeographyParam(`/topics/${topic.slug}`, geoCode);
            const active = pathname === `/topics/${topic.slug}`;

            return (
              <Link
                key={topic.slug}
                href={href}
                className={navLinkClass(active)}
              >
                {topic.name}
              </Link>
            );
          })}
          <Link
            href={aboutHref}
            className={navLinkClass(pathname === "/about")}
          >
            About
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <div className="sm:hidden">
            <RegionFilter id="region-filter-compact" />
          </div>

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open navigation"
                />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <RegionFilter id="region-filter-sheet" fullWidth />
              </div>
              <nav className="mt-4 flex flex-col gap-1" aria-label="Main">
                <Link
                  href={withGeographyParam("/", geoCode)}
                  className={sheetLinkClass(pathname === "/")}
                >
                  Home
                </Link>
                {TOPICS.map((topic) => {
                  const href = withGeographyParam(
                    `/topics/${topic.slug}`,
                    geoCode,
                  );
                  const active = pathname === `/topics/${topic.slug}`;

                  return (
                    <Link
                      key={topic.slug}
                      href={href}
                      className={sheetLinkClass(active)}
                    >
                      {topic.name}
                    </Link>
                  );
                })}
                <Link
                  href={aboutHref}
                  className={sheetLinkClass(pathname === "/about")}
                >
                  About
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function HeaderFallback() {
  return (
    <header className="bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center px-4 sm:px-6">
        <span className="text-sm font-semibold tracking-tight">
          UK Census Data
        </span>
      </div>
    </header>
  );
}

export function SiteHeader() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <SiteHeaderInner />
    </Suspense>
  );
}
