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
    "rounded-md px-2 py-1.5 text-xs transition-colors duration-200",
    active
      ? "bg-primary/10 text-primary font-medium"
      : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
  );
}

function sheetLinkClass(active: boolean) {
  return cn(
    "rounded-md px-3 py-2.5 text-sm transition-colors duration-200 min-h-11",
    active
      ? "bg-primary/10 text-primary font-medium"
      : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
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
    <header className="border-border/80 bg-background/85 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 sm:h-16 sm:px-6">
        <Link
          href={withGeographyParam("/", geoCode)}
          className="font-heading text-foreground hover:text-primary shrink-0 text-base font-semibold tracking-tight transition-colors sm:text-lg"
        >
          UK Census Data
        </Link>

        <div className="hidden min-w-0 sm:block">
          <RegionFilter id="region-filter-header" />
        </div>

        <nav
          className="ml-auto hidden items-center gap-0.5 lg:flex"
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
                  className="min-h-11 min-w-11 lg:hidden"
                  aria-label="Open navigation"
                />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-heading">Menu</SheetTitle>
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
    <header className="border-border/80 bg-background/85 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center px-4 sm:h-16 sm:px-6">
        <span className="font-heading text-base font-semibold tracking-tight sm:text-lg">
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

/** Exported for unit tests of the Suspense fallback chrome. */
export { HeaderFallback };
