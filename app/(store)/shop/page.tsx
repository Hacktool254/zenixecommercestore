"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProductGrid } from "@/components/products/ProductGrid";
import { FilterSidebar, FilterSheet, SORT_OPTIONS } from "@/components/products/Filters";
import { WidgetCarousel } from "@/components/shared/WidgetCarousel";
import { X } from "lucide-react";
import type { Product } from "@/types";
import type { WidgetItem } from "@/components/shared/WidgetCarousel";

const CHIP_LABELS: Record<string, (v: string) => string> = {
  category: (v) => v.charAt(0).toUpperCase() + v.slice(1),
  condition: (v) => (v === "brand-new" ? "Brand New" : v === "ex-uk" ? "Ex UK" : "Ex USA"),
  brand: (v) => v,
  maxPrice: (v) => `Max KES ${Number(v).toLocaleString()}`,
  inStock: () => "In Stock Only",
};

const SHOP_WIDGETS: WidgetItem[] = [
  {
    id: "iphone17pro",
    label: "iPhone 17 Pro Max",
    sub: "From KES 189,999",
    color: "#a8d5e2",
    href: "/shop/iphones/iphone-17-pro-max-brand-new",
  },
  {
    id: "s26ultra",
    label: "Samsung S26 Ultra",
    sub: "From KES 179,999",
    color: "#1e88e5",
    href: "/shop/samsung/samsung-s26-ultra-brand-new",
  },
  {
    id: "ps5pro",
    label: "PlayStation 5 Pro",
    sub: "KES 84,999",
    color: "#f87171",
    href: "/shop/gaming/ps5-pro",
  },
  {
    id: "mbprom5",
    label: "MacBook Pro M5",
    sub: "KES 349,999",
    color: "#cbd5e1",
    href: "/shop/mac/macbook-pro-m5",
  },
  {
    id: "ipadpro",
    label: 'iPad Pro 13" M5',
    sub: "From KES 179,999",
    color: "#a78bfa",
    href: "/shop/ipads/ipad-pro-13-m5",
  },
  {
    id: "applewatch",
    label: "Apple Watch Ultra 3",
    sub: "KES 99,999",
    color: "#34d399",
    href: "/shop/wearables/apple-watch-ultra-3",
  },
  {
    id: "airpodsmax",
    label: "AirPods Max USB-C",
    sub: "KES 54,999",
    color: "#f87171",
    href: "/shop/audio/airpods-max-usbc",
  },
  {
    id: "tcl85",
    label: 'TCL C8L 85"',
    sub: "KES 189,999",
    color: "#f5a623",
    href: "/shop/televisions/tcl-c8l-miniled-qled",
  },
];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const category = searchParams.get("category") ?? undefined;
  const condition =
    (searchParams.get("condition") as "brand-new" | "ex-uk" | "ex-usa" | null) ?? undefined;
  const brand = searchParams.get("brand") ?? undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const inStockOnly = searchParams.get("inStock") === "1" ? true : undefined;
  const sortBy =
    (searchParams.get("sort") as "featured" | "newest" | "price-asc" | "price-desc") ?? "featured";

  const products = useQuery(api.products.getAllProducts, {
    category,
    condition,
    brand,
    maxPrice,
    inStockOnly,
    sortBy: sortBy === "featured" ? undefined : sortBy,
  });

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const activeChips = ["category", "condition", "brand", "maxPrice", "inStock"].filter((k) =>
    searchParams.get(k)
  );

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 md:px-6 lg:px-8">
      <div className="flex gap-8 xl:gap-10">
        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Page header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {category ? category.charAt(0).toUpperCase() + category.slice(1) : "All Products"}
              </h1>
              {products !== undefined && (
                <p className="mt-0.5 text-sm text-[#8b92a5]">{products.length} products</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <FilterSheet sortValue={sortBy} onSortChange={handleSort} />
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="hidden rounded-xl border border-[#1e2435] bg-[#0d1117] px-3 py-2.5 text-sm text-[#cbd5e1] outline-none focus:border-[#f5a623]/40 lg:block"
              >
                {SORT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value} className="bg-[#0d1117]">
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {activeChips.map((key) => (
                <span
                  key={key}
                  className="flex items-center gap-1.5 rounded-full border border-[#f5a623]/30 bg-[#f5a623]/10 px-3 py-1 text-xs font-medium text-[#f5a623]"
                >
                  {CHIP_LABELS[key]?.(searchParams.get(key)!) ?? key}
                  <button onClick={() => removeFilter(key)} aria-label={`Remove ${key} filter`}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={() => router.push(pathname)}
                className="text-xs text-[#8b92a5] hover:text-white"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Body */}
          <div className="flex items-start gap-8">
            <FilterSidebar />
            <div className="min-w-0 flex-1">
              <ProductGrid products={products as Product[] | undefined} />
            </div>
          </div>
        </div>

        {/* Right widget — desktop only */}
        <div className="hidden w-[220px] shrink-0 flex-col pt-[72px] xl:flex">
          <p className="mb-3 text-[10px] font-semibold tracking-widest text-[#8b92a5] uppercase">
            Top Picks
          </p>
          <div className="sticky top-24 h-[480px]">
            <WidgetCarousel items={SHOP_WIDGETS} autoScrollMs={2600} />
          </div>
        </div>
      </div>
    </div>
  );
}
