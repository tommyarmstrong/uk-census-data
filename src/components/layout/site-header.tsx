"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu } from "lucide-react";

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
    "min-h-11 rounded-md px-3 py-2.5 text-sm transition-colors duration-200",
    active
      ? "bg-primary/10 text-primary font-medium"
      : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
  );
}

function BrandMark({ className }: { className?: string }) {
  return (
    <Image
      src="/icon.svg"
      alt=""
      width={32}
      height={32}
      className={cn("size-[1.1em] rounded-sm", className)}
      aria-hidden
      priority
    />
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
          className="font-heading text-foreground hover:text-primary flex shrink-0 items-center gap-2 text-base font-semibold tracking-tight transition-colors sm:text-lg"
        >
          <BrandMark />
          UK Census Data
        </Link>

        <nav
          className="ml-auto hidden min-w-0 items-center gap-0.5 lg:flex"
          aria-label="Main"
        >
          <Link
            href={withGeographyParam("/", geoCode)}
            className={navLinkClass(pathname === "/")}
          >
            Home
          </Link>
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

        <div className="ml-auto lg:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="min-h-11 min-w-11"
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
        <span className="font-heading flex items-center gap-2 text-base font-semibold tracking-tight sm:text-lg">
          <BrandMark />
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
