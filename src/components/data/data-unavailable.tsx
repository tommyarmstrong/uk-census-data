import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type DataUnavailableProps = {
  className?: string;
  /** Optional extra context under the main message. */
  detail?: ReactNode;
};

/** Chart / series not available — never invent figures. */
export function DataUnavailable({
  className,
  detail = "Live census data is not available for this chart.",
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
