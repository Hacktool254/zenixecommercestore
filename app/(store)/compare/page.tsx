"use client";

import { useUIStore } from "@/stores/ui.store";
import { useCartStore } from "@/stores/cart.store";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, X, GitCompare } from "lucide-react";
import type { Product } from "@/types";

export default function ComparePage() {
  const list = useUIStore((s) => s.comparisonList);
  const remove = useUIStore((s) => s.removeFromComparison);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (p: Product) => {
    addItem({
      productId: p._id,
      name: p.name,
      price: p.price,
      quantity: 1,
      image: p.images[0] ?? "",
      condition: p.condition,
      stock: p.stock,
    });
  };

  if (list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-32 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1e2435]">
          <GitCompare className="h-8 w-8 text-[#8b92a5]" />
        </div>
        <p className="text-lg font-semibold text-white">Nothing to compare</p>
        <p className="text-sm text-[#8b92a5]">
          Use the compare button on product cards to add up to 3 products.
        </p>
        <Link
          href="/shop"
          className="mt-1 rounded-xl bg-[#f5a623] px-6 py-2.5 text-sm font-bold text-[#0a0e1a] transition hover:bg-[#ff9f1c]"
        >
          Browse products
        </Link>
      </div>
    );
  }

  // Merge all spec keys across products
  const allSpecKeys = Array.from(new Set(list.flatMap((p) => Object.keys(p.specs ?? {}))));

  // Find lowest price index for highlighting
  const minPrice = Math.min(...list.map((p) => p.price));

  const colCount = list.length;
  const gridCols = colCount === 1 ? "grid-cols-1" : colCount === 2 ? "grid-cols-2" : "grid-cols-3";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <h1
        className="mb-8 text-2xl font-bold text-white"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Compare Products
      </h1>

      {/* Image + name + remove row */}
      <div className={`mb-1 grid gap-3 ${gridCols}`}>
        {list.map((p) => (
          <div
            key={p._id}
            className="flex flex-col items-center gap-3 rounded-2xl border border-[#1e2435] bg-[#0d1117] p-4"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#111827]">
              <Image
                src={p.images[0] ?? "/logo.png"}
                alt={p.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
            <p className="line-clamp-2 text-center text-sm font-semibold text-white">{p.name}</p>
            <div className="flex w-full gap-2">
              <button
                onClick={() => handleAddToCart(p)}
                disabled={p.stock === 0}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#f5a623] py-2 text-xs font-bold text-[#0a0e1a] transition hover:bg-[#ff9f1c] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Add to cart
              </button>
              <button
                onClick={() => remove(p._id)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#1e2435] text-[#8b92a5] transition hover:border-red-400/40 hover:text-red-400"
                aria-label="Remove from comparison"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
        {/* Price */}
        <Row label="Price" accent>
          {list.map((p) => (
            <Cell key={p._id} highlight={p.price === minPrice}>
              <span
                className={`text-base font-bold ${p.price === minPrice ? "text-green-400" : "text-[#f5a623]"}`}
              >
                KES {p.price.toLocaleString()}
              </span>
              {p.price === minPrice && list.length > 1 && (
                <span className="mt-0.5 block text-[10px] font-semibold text-green-400">
                  Best price
                </span>
              )}
            </Cell>
          ))}
        </Row>

        {/* Category */}
        <Row label="Category">
          {list.map((p) => (
            <Cell key={p._id}>
              <span className="text-white capitalize">{p.category}</span>
            </Cell>
          ))}
        </Row>

        {/* Condition */}
        <Row label="Condition" accent>
          {list.map((p) => (
            <Cell key={p._id}>
              {p.condition === "brand-new" ? (
                <span className="rounded-md bg-[#22c55e]/15 px-2 py-0.5 text-xs font-semibold text-[#22c55e]">
                  Brand New
                </span>
              ) : (
                <span className="rounded-md bg-[#38bdf8]/15 px-2 py-0.5 text-xs font-semibold text-[#38bdf8]">
                  Ex UK
                </span>
              )}
            </Cell>
          ))}
        </Row>

        {/* Stock */}
        <Row label="Stock">
          {list.map((p) => (
            <Cell key={p._id}>
              {p.stock === 0 ? (
                <span className="text-red-400">Out of stock</span>
              ) : p.stock <= 3 ? (
                <span className="text-amber-400">Only {p.stock} left</span>
              ) : (
                <span className="text-green-400">In stock</span>
              )}
            </Cell>
          ))}
        </Row>

        {/* Dynamic spec rows */}
        {allSpecKeys.map((key, i) => (
          <Row key={key} label={key} accent={i % 2 === 0}>
            {list.map((p) => (
              <Cell key={p._id}>
                <span className="text-white">{p.specs?.[key] ?? "—"}</span>
              </Cell>
            ))}
          </Row>
        ))}
      </div>
    </div>
  );
}

function Row({
  label,
  accent,
  children,
}: {
  label: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-stretch divide-x divide-[#1e2435] border-b border-[#1e2435] last:border-b-0 ${accent ? "bg-[#111827]" : ""}`}
    >
      <div className="flex w-28 shrink-0 items-center px-4 py-3 md:w-36">
        <span className="text-xs font-semibold tracking-wide text-[#8b92a5] capitalize">
          {label}
        </span>
      </div>
      <div className="flex flex-1 divide-x divide-[#1e2435]">{children}</div>
    </div>
  );
}

function Cell({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <div
      className={`flex flex-1 items-center px-4 py-3 text-sm ${highlight ? "bg-green-400/5" : ""}`}
    >
      {children}
    </div>
  );
}
