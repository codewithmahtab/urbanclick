"use client";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/providers/navigation-provider";
import { FilterOption } from "@/features/products/types/filters";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

export type FilterSectionProps = {
  title: string;
  filterKey: string;
  options: FilterOption[];
};

export default function FilterSection({
  title,
  options,
  filterKey,
}: FilterSectionProps) {
  if (options.length === 0) {
    return null;
  }

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { pushUrl } = useNavigation();
  const [showAll, setShowAll] = useState(false);

  const handleFilterChange = (checked: boolean, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    const currentValues =
      params.get(filterKey)?.split(",").filter(Boolean) ?? [];

    let newValues: string[] = [];

    if (checked) {
      //add
      newValues = [...new Set([...currentValues, value])];
    } else {
      //remove
      newValues = currentValues.filter((key) => key !== value);
    }

    if (newValues.length > 0) {
      params.set(filterKey, newValues.join(","));
    } else {
      params.delete(filterKey);
    }

    if (params.get("page")) {
      params.set("page", "1");
    }

    pushUrl(`${pathname}?${params.toString()}`);
  };

  const selectedvalues = searchParams.get(filterKey)?.split(",") ?? [];

  const hasMore = options.length > 5;
  const displayedOptions = showAll ? options : options.slice(0, 5);

  return (
    <section className="mt-4 space-y-3">
      <h3 className="text-lg text-foreground/80">{title}</h3>

      <ul
        className={cn(
          "space-y-1 max-h-95 scrollbar-none",
          showAll && "overflow-y-scroll",
        )}
      >
        {displayedOptions.map((option) => {
          const checked = selectedvalues.includes(option.value);

          return (
            <li key={option.value} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={option.value}
                className="h-5 w-5 cursor-pointer"
                checked={checked}
                onChange={(e) =>
                  handleFilterChange(e.target.checked, option.value)
                }
              />
              <label htmlFor={option.value} className="text-lg cursor-pointer">
                {option.label}
              </label>
            </li>
          );
        })}
      </ul>
      {hasMore && (
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="text-yellow-500 cursor-pointer hover:underline"
        >
          {showAll ? "Show Less" : "Show More"}
        </button>
      )}
    </section>
  );
}
