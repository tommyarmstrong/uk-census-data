import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type DataUnavailableProps = {
  className?: string;
  /** Optional extra context under the main message. */
  detail?: ReactNode;
};

/** Chart / series not wired yet — never invent figures. */
export function DataUnavailable({
  className,
  detail = "Chart not wired yet. Live NOMIS data will appear here when connected.",
}: DataUnavailableProps) {
  return (
    <div
      className={cn(
        "border-border/80 bg-muted/30 rounded-lg border border-dashed p-6 text-center",
        className,
      )}
    >
      <p className="text-sm font-medium">Data unavailable</p>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        {detail}
      </p>
    </div>
  );
}
