"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import {
  Search,
  Warehouse,
  AlertTriangle,
  Package,
  TrendingUp,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type StockFilter = "all" | "out" | "low" | "ok";

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)
    return (
      <span className="inline-flex rounded-full border border-red-400/20 bg-red-400/10 px-2.5 py-1 text-[9px] font-black tracking-widest text-red-400 uppercase">
        Out of Stock
      </span>
    );
  if (stock <= 9)
    return (
      <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[9px] font-black tracking-widest text-amber-400 uppercase">
        Low Stock
      </span>
    );
  return (
    <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-black tracking-widest text-emerald-400 uppercase">
      In Stock
    </span>
  );
}

export default function AdminInventoryPage() {
  const products = useQuery(api.products.getAllProductsAdmin);
  const updateStock = useMutation(api.products.updateStock);

  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Id<"products"> | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StockFilter>("all");

  const handleSave = async (id: Id<"products">) => {
    const val = parseInt(edits[id] ?? "", 10);
    if (isNaN(val) || val < 0) return;
    setSaving(id);
    try {
      await updateStock({ id, stock: val });
      setEdits((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } finally {
      setSaving(null);
    }
  };

  const filtered = products?.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    const matchFilter =
      filter === "all" ||
      (filter === "out" && p.stock === 0) ||
      (filter === "low" && p.stock > 0 && p.stock <= 9) ||
      (filter === "ok" && p.stock > 9);
    return matchSearch && matchFilter;
  });

  const totalProducts = products?.filter((p) => p.isActive).length ?? 0;
  const outOfStock = products?.filter((p) => p.stock === 0).length ?? 0;
  const lowStock = products?.filter((p) => p.stock > 0 && p.stock <= 9).length ?? 0;
  const warehouseValue = products?.reduce((s, p) => s + p.price * p.stock, 0) ?? 0;

  const FILTERS: { id: StockFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "out", label: "Out of Stock" },
    { id: "low", label: "Low Stock" },
    { id: "ok", label: "In Stock" },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-[#f5a623]/10 pb-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-[#f5a623]/40" />
            <p className="text-[10px] font-black tracking-[0.4em] text-[#f5a623]/50 uppercase">
              Stock Management
            </p>
          </div>
          <h1 className="text-4xl leading-none font-black tracking-tighter text-white">
            INVENTORY <span className="font-normal text-[#f5a623] italic">Control</span>
          </h1>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#f5a623]/10 bg-[#0d1117] p-5">
          <div className="mb-3 flex items-center gap-2">
            <Warehouse className="h-4 w-4 text-[#f5a623]/60" />
            <p className="text-[9px] font-black tracking-[0.3em] text-[#8b92a5]/60 uppercase">
              Warehouse Value
            </p>
          </div>
          <p className="text-2xl font-black tracking-tighter text-white">
            KES {(warehouseValue / 1000).toFixed(0)}K
          </p>
        </div>
        <div className="rounded-2xl border border-[#f5a623]/10 bg-[#0d1117] p-5">
          <div className="mb-3 flex items-center gap-2">
            <Package className="h-4 w-4 text-[#f5a623]/60" />
            <p className="text-[9px] font-black tracking-[0.3em] text-[#8b92a5]/60 uppercase">
              Active Products
            </p>
          </div>
          <p className="text-2xl font-black tracking-tighter text-white">{totalProducts}</p>
        </div>
        <div className="rounded-2xl border border-amber-400/10 bg-[#0d1117] p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400/60" />
            <p className="text-[9px] font-black tracking-[0.3em] text-[#8b92a5]/60 uppercase">
              Low Stock
            </p>
          </div>
          <p className="text-2xl font-black tracking-tighter text-amber-400">{lowStock}</p>
        </div>
        <div className="rounded-2xl border border-red-400/10 bg-[#0d1117] p-5">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-red-400/60" />
            <p className="text-[9px] font-black tracking-[0.3em] text-[#8b92a5]/60 uppercase">
              Out of Stock
            </p>
          </div>
          <p className="text-2xl font-black tracking-tighter text-red-400">{outOfStock}</p>
        </div>
      </div>

      {/* Filters + search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={cn(
                "rounded-xl px-3 py-1.5 text-[10px] font-black tracking-widest uppercase transition",
                filter === id
                  ? "bg-[#f5a623] text-[#0a0e1a]"
                  : "border border-[#f5a623]/10 text-[#8b92a5] hover:border-[#f5a623]/30 hover:text-white"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#8b92a5]/60" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="h-10 rounded-xl border border-[#f5a623]/10 bg-[#0d1117] pr-4 pl-10 text-sm text-white outline-none placeholder:text-[#8b92a5]/40 focus:border-[#f5a623]/40"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#f5a623]/10 bg-[#0d1117]">
        {products === undefined ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-7 w-7 animate-spin text-[#f5a623]" />
          </div>
        ) : (filtered?.length ?? 0) === 0 ? (
          <p className="py-16 text-center text-sm text-[#8b92a5]/40 italic">No products found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f5a623]/10">
                  {["Product", "Category", "Price", "Stock", "Status", "Update"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-4 text-left text-[9px] font-black tracking-[0.25em] text-[#8b92a5]/50 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5a623]/5">
                {filtered?.map((p) => {
                  const hasEdit = edits[p._id] !== undefined;
                  const isLow = p.stock > 0 && p.stock <= 9;
                  const isOut = p.stock === 0;
                  return (
                    <tr
                      key={p._id}
                      className={cn(
                        "transition hover:bg-[#f5a623]/[0.02]",
                        (isOut || isLow) && "bg-red-400/[0.01]"
                      )}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[#1e2435]">
                            <Image
                              src={p.images[0] ?? "/logo.png"}
                              alt={p.name}
                              fill
                              className="object-contain p-1"
                              sizes="40px"
                            />
                          </div>
                          <p className="max-w-[180px] truncate font-bold text-white">{p.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[10px] font-black tracking-wider text-[#8b92a5] uppercase">
                          {p.category}
                        </p>
                      </td>
                      <td className="px-5 py-4 font-black text-[#f5a623]">
                        KES {p.price.toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "text-2xl font-black tracking-tighter",
                            isOut ? "text-red-400" : isLow ? "text-amber-400" : "text-emerald-400"
                          )}
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <StockBadge stock={p.stock} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={hasEdit ? edits[p._id] : p.stock}
                            onChange={(e) =>
                              setEdits((prev) => ({ ...prev, [p._id]: e.target.value }))
                            }
                            className="w-20 rounded-xl border border-[#f5a623]/10 bg-[#080c16] px-3 py-2 text-sm text-white transition outline-none focus:border-[#f5a623]/40"
                          />
                          {hasEdit && (
                            <button
                              onClick={() => handleSave(p._id)}
                              disabled={saving === p._id}
                              className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5a623] text-[#0a0e1a] transition hover:bg-[#ff9f1c] disabled:opacity-60"
                              aria-label="Save stock"
                            >
                              {saving === p._id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Check className="h-3.5 w-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
