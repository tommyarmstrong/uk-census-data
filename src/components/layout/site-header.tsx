"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TOPICS } from "@/lib/topics";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          UK Census Data
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Topics">
          {TOPICS.map((topic) => {
            const href = `/topics/${topic.slug}`;
            const active = pathname === href;

            return (
              <Link
                key={topic.slug}
                href={href}
                className={cn(
                  "rounded-md px-2 py-1.5 text-xs transition-colors",
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {topic.name}
              </Link>
            );
          })}
        </nav>

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
              <SheetTitle>Topics</SheetTitle>
            </SheetHeader>
            <nav className="mt-4 flex flex-col gap-1" aria-label="Topics">
              <Link
                href="/"
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors",
                  pathname === "/"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Home
              </Link>
              {TOPICS.map((topic) => {
                const href = `/topics/${topic.slug}`;
                const active = pathname === href;

                return (
                  <Link
                    key={topic.slug}
                    href={href}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {topic.name}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
