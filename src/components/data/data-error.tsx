import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DataErrorProps = {
  className?: string;
  message: string;
  onRetry?: () => void;
  /** Extra guidance under the message. */
  hint?: string;
};

/** NOMIS unreachable and no usable cache — do not invent figures. */
export function DataError({
  className,
  message,
  onRetry,
  hint,
}: DataErrorProps) {
  return (
    <div
      role="alert"
      className={cn(
        "border-destructive/30 bg-destructive/5 rounded-lg border p-4",
        className,
      )}
    >
      <p className="text-sm font-medium">Data unavailable</p>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        {message}
      </p>
      {hint ? (
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          {hint}
        </p>
      ) : null}
      {onRetry ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 min-h-11 sm:min-h-0"
          onClick={onRetry}
        >
          Retry
        </Button>
      ) : null}
    </div>
  );
}
