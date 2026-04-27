"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "iphones", label: "iPhones" },
  { value: "mac", label: "Mac" },
  { value: "televisions", label: "Televisions" },
  { value: "audio", label: "Audio" },
  { value: "gaming", label: "Gaming" },
  { value: "connectivity", label: "Starlink / Connectivity" },
  { value: "power", label: "Power" },
  { value: "accessories", label: "Accessories" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function FilterPanel({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = (key: string) => searchParams.get(key) ?? "";

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
      onClose?.();
    },
    [router, pathname, searchParams, onClose]
  );

  const clearAll = () => {
    router.push(pathname);
    onClose?.();
  };

  const hasFilters =
    get("category") || get("condition") || get("minPrice") || get("maxPrice") || get("inStock");

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">Filters</span>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-[#f5a623] hover:underline"
          >
            <X className="h-3 w-3" /> Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <p className="mb-3 text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
          Category
        </p>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map(({ value, label }) => (
            <label key={value} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                name="category"
                checked={get("category") === value}
                onChange={() => update("category", value)}
                className="accent-[#f5a623]"
              />
              <span
                className={`text-sm ${get("category") === value ? "text-[#f5a623]" : "text-[#cbd5e1]"}`}
              >
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <p className="mb-3 text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
          Condition
        </p>
        <div className="flex gap-2">
          {[
            { value: "", label: "All" },
            { value: "brand-new", label: "Brand New" },
            { value: "ex-uk", label: "Ex UK" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => update("condition", value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                get("condition") === value
                  ? "bg-[#f5a623] text-[#0a0e1a]"
                  : "border border-[#1e2435] text-[#8b92a5] hover:border-[#f5a623]/40 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p className="mb-3 text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
          Max Price (KES)
        </p>
        <input
          type="range"
          min={0}
          max={500000}
          step={5000}
          defaultValue={get("maxPrice") || 500000}
          onMouseUp={(e) =>
            update(
              "maxPrice",
              (e.target as HTMLInputElement).value === "500000"
                ? ""
                : (e.target as HTMLInputElement).value
            )
          }
          onTouchEnd={(e) =>
            update(
              "maxPrice",
              (e.target as HTMLInputElement).value === "500000"
                ? ""
                : (e.target as HTMLInputElement).value
            )
          }
          className="w-full accent-[#f5a623]"
        />
        <div className="mt-1 flex justify-between text-xs text-[#8b92a5]">
          <span>KES 0</span>
          <span>
            {get("maxPrice") ? `KES ${Number(get("maxPrice")).toLocaleString()}` : "KES 500,000"}
          </span>
        </div>
      </div>

      {/* In stock only */}
      <label className="flex cursor-pointer items-center gap-3">
        <div
          onClick={() => update("inStock", get("inStock") === "1" ? "" : "1")}
          className={`relative h-5 w-9 rounded-full transition-colors ${get("inStock") === "1" ? "bg-[#f5a623]" : "bg-[#1e2435]"}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${get("inStock") === "1" ? "translate-x-4" : ""}`}
          />
        </div>
        <span className="text-sm text-[#cbd5e1]">In stock only</span>
      </label>
    </div>
  );
}

/* Desktop sidebar */
export function FilterSidebar() {
  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <div className="sticky top-24 rounded-2xl border border-[#1e2435] bg-[#0d1117] p-5">
        <FilterPanel />
      </div>
    </aside>
  );
}

/* Mobile bottom sheet trigger */
export function FilterSheet({
  sortValue,
  onSortChange,
}: {
  sortValue: string;
  onSortChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 lg:hidden">
      <Sheet>
        <SheetTrigger className="flex items-center gap-2 rounded-xl border border-[#1e2435] bg-[#0d1117] px-4 py-2.5 text-sm font-medium text-[#cbd5e1] transition-colors hover:border-[#f5a623]/40 hover:text-white">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="max-h-[80vh] overflow-y-auto rounded-t-2xl border-[#1e2435] bg-[#0d1117] px-6 pb-8"
        >
          <SheetHeader className="mb-6">
            <SheetTitle className="text-white">Filters</SheetTitle>
          </SheetHeader>
          <FilterPanel />
        </SheetContent>
      </Sheet>

      {/* Sort — visible on mobile too */}
      <select
        value={sortValue}
        onChange={(e) => onSortChange(e.target.value)}
        className="rounded-xl border border-[#1e2435] bg-[#0d1117] px-3 py-2.5 text-sm text-[#cbd5e1] outline-none focus:border-[#f5a623]/40"
      >
        {SORT_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value} className="bg-[#0d1117]">
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

export { SORT_OPTIONS };
