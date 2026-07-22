"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GEOGRAPHY_SEARCH_PARAM,
  getSelectableGeographies,
  resolveGeographyFromParam,
} from "@/lib/geography-url";
import { cn } from "@/lib/utils";

const SELECTABLE_GEOGRAPHIES = getSelectableGeographies();
const SELECTABLE_ITEMS = Object.fromEntries(
  SELECTABLE_GEOGRAPHIES.map((option) => [option.code, option.name]),
);

type RegionFilterProps = {
  className?: string;
  /** Stretch trigger to full width (e.g. mobile sheet). */
  fullWidth?: boolean;
  id?: string;
};

export function RegionFilter({
  className,
  fullWidth = false,
  id = "region-filter",
}: RegionFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const geography = resolveGeographyFromParam(
    searchParams.get(GEOGRAPHY_SEARCH_PARAM),
  );

  const onValueChange = (next: string | null) => {
    if (!next) {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set(GEOGRAPHY_SEARCH_PARAM, next);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label
        htmlFor={id}
        className="text-muted-foreground shrink-0 text-xs font-medium"
      >
        Region
      </label>
      <Select
        value={geography.code}
        onValueChange={onValueChange}
        items={SELECTABLE_ITEMS}
      >
        <SelectTrigger
          id={id}
          size="sm"
          className={cn(
            "min-h-11 sm:min-h-8",
            fullWidth && "w-full min-w-0",
            !fullWidth && "max-w-56",
          )}
          aria-label="Select region"
        >
          <SelectValue placeholder="Select region" />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false} align="start">
          {SELECTABLE_GEOGRAPHIES.map((option) => (
            <SelectItem key={option.code} value={option.code}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
