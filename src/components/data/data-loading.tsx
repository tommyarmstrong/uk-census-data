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
      className={cn("bg-muted/40 h-28 animate-pulse rounded-lg", className)}
      aria-busy="true"
      aria-label={label}
    />
  );
}
