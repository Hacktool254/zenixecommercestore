"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { Check } from "lucide-react";

function StockIndicator({ stock }: { stock: number }) {
  if (stock === 0)
    return <span className="inline-block h-2 w-2 rounded-full bg-red-400" title="Out of stock" />;
  if (stock <= 9)
    return <span className="inline-block h-2 w-2 rounded-full bg-amber-400" title="Low stock" />;
  return <span className="inline-block h-2 w-2 rounded-full bg-green-400" title="In stock" />;
}

export default function AdminInventoryPage() {
  const products = useQuery(api.products.getAllProductsAdmin);
  const updateStock = useMutation(api.products.updateStock);

  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Id<"products"> | null>(null);

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

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div>
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Inventory
        </h1>
        <p className="mt-0.5 text-sm text-[#8b92a5]">Update stock levels for all products</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 text-xs text-[#8b92a5]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-green-400" /> ≥10 In stock
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-400" /> 1–9 Low stock
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-red-400" /> 0 Out of stock
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
        {products === undefined ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#f5a623] border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e2435] text-left">
                  {["", "Product", "Category", "Status", "Current Stock", "Update"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-xs font-semibold tracking-widest text-[#8b92a5] uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2435]">
                {products.map((p) => {
                  const hasEdit = edits[p._id] !== undefined;
                  return (
                    <tr key={p._id} className="transition hover:bg-[#111827]">
                      <td className="py-3 pl-5">
                        <StockIndicator stock={p.stock} />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-[#111827]">
                            <Image
                              src={p.images[0] ?? "/logo.png"}
                              alt={p.name}
                              fill
                              className="object-cover"
                              sizes="36px"
                            />
                          </div>
                          <span className="max-w-[200px] truncate font-medium text-white">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-[#8b92a5] capitalize">{p.category}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            p.isActive
                              ? "bg-green-400/10 text-green-400"
                              : "bg-[#1e2435] text-[#8b92a5]"
                          }`}
                        >
                          {p.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`font-bold ${
                            p.stock === 0
                              ? "text-red-400"
                              : p.stock <= 9
                                ? "text-amber-400"
                                : "text-green-400"
                          }`}
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={hasEdit ? edits[p._id] : p.stock}
                            onChange={(e) =>
                              setEdits((prev) => ({ ...prev, [p._id]: e.target.value }))
                            }
                            className="w-20 rounded-lg border border-[#1e2435] bg-[#111827] px-2.5 py-1.5 text-sm text-white transition outline-none focus:border-[#f5a623]/50"
                          />
                          {hasEdit && (
                            <button
                              onClick={() => handleSave(p._id)}
                              disabled={saving === p._id}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5a623] text-[#0a0e1a] transition hover:bg-[#ff9f1c] disabled:opacity-60"
                              aria-label="Save stock"
                            >
                              {saving === p._id ? (
                                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#0a0e1a] border-t-transparent" />
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
