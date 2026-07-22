import { cn } from "@/lib/utils";

type DataLoadingProps = {
  className?: string;
  label?: string;
};

/** Skeleton placeholder while a NOMIS fetch is in flight. */
export function DataLoading({
  className,
  label = "Loading census data",
}: DataLoadingProps) {
  return (
    <div
      className={cn(
        "from-muted/50 via-accent/40 to-muted/50 h-28 animate-pulse rounded-lg bg-linear-to-r",
        className,
      )}
      aria-busy="true"
      aria-label={label}
    />
  );
}
