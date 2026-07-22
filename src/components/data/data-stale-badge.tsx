import { cn } from "@/lib/utils";

type DataStaleBadgeProps = {
  className?: string;
};

/** Shown when UI is served from browser cache after a network failure. */
export function DataStaleBadge({ className }: DataStaleBadgeProps) {
  return (
    <span
      className={cn(
        "bg-accent text-accent-foreground inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        className,
      )}
    >
      Cached — may be out of date
    </span>
  );
}
