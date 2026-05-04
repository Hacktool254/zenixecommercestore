"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, X } from "lucide-react";

export default function AdminProductsPage() {
  const products = useQuery(api.products.getAllProductsAdmin);
  const deleteProduct = useMutation(api.products.deleteProduct);

  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState<Id<"products"> | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = (products ?? []).filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await deleteProduct({ id: confirmId });
      setConfirmId(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Products
          </h1>
          <p className="mt-0.5 text-sm text-[#8b92a5]">{products?.length ?? "—"} products total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 rounded-xl bg-[#f5a623] px-4 py-2 text-sm font-bold text-[#0a0e1a] transition hover:bg-[#ff9f1c]"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#8b92a5]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full rounded-xl border border-[#1e2435] bg-[#0d1117] py-2.5 pr-4 pl-9 text-sm text-white transition outline-none placeholder:text-[#4b5563] focus:border-[#f5a623]/50"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
        {products === undefined ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#f5a623] border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-[#8b92a5]">No products found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e2435] text-left">
                  <th className="px-5 py-3 text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
                    Product
                  </th>
                  <th className="hidden px-5 py-3 text-xs font-semibold tracking-widest text-[#8b92a5] uppercase md:table-cell">
                    Category
                  </th>
                  <th className="hidden px-5 py-3 text-xs font-semibold tracking-widest text-[#8b92a5] uppercase lg:table-cell">
                    Condition
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
                    Price
                  </th>
                  <th className="hidden px-5 py-3 text-xs font-semibold tracking-widest text-[#8b92a5] uppercase sm:table-cell">
                    Stock
                  </th>
                  <th className="hidden px-5 py-3 text-xs font-semibold tracking-widest text-[#8b92a5] uppercase sm:table-cell">
                    Status
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2435]">
                {filtered.map((p) => (
                  <tr key={p._id} className="transition hover:bg-[#111827]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[#111827]">
                          <Image
                            src={p.images[0] ?? "/logo.png"}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <span className="max-w-[160px] truncate font-medium text-white">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="hidden px-5 py-3 text-[#8b92a5] capitalize md:table-cell">
                      {p.category}
                    </td>
                    <td className="hidden px-5 py-3 lg:table-cell">
                      {p.condition === "brand-new" ? (
                        <span className="rounded-md bg-[#22c55e]/15 px-2 py-0.5 text-xs font-semibold text-[#22c55e]">
                          Brand New
                        </span>
                      ) : (
                        <span className="rounded-md bg-[#38bdf8]/15 px-2 py-0.5 text-xs font-semibold text-[#38bdf8]">
                          {p.condition === "ex-uk" ? "Ex UK" : "Ex USA"}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-semibold text-[#f5a623]">
                      KES {p.price.toLocaleString()}
                    </td>
                    <td className="hidden px-5 py-3 sm:table-cell">
                      <span
                        className={`font-semibold ${
                          p.stock === 0
                            ? "text-red-400"
                            : p.stock <= 5
                              ? "text-amber-400"
                              : "text-green-400"
                        }`}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="hidden px-5 py-3 sm:table-cell">
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
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${p._id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1e2435] text-[#8b92a5] transition hover:border-[#f5a623]/40 hover:text-[#f5a623]"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => setConfirmId(p._id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1e2435] text-[#8b92a5] transition hover:border-red-400/40 hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-[#1e2435] bg-[#0d1117] p-6">
            <div className="mb-4 flex items-start justify-between">
              <h2 className="text-base font-semibold text-white">Delete product?</h2>
              <button
                onClick={() => setConfirmId(null)}
                className="text-[#8b92a5] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-6 text-sm text-[#8b92a5]">
              This action cannot be undone. The product will be permanently removed.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white transition hover:bg-red-600 disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 rounded-xl border border-[#1e2435] py-2.5 text-sm text-[#8b92a5] transition hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
