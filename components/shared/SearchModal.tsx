"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUIStore } from "@/stores/ui.store";
import type { Product } from "@/types";

export function SearchModal() {
  const isOpen = useUIStore((s) => s.isSearchOpen);
  const closeSearch = useUIStore((s) => s.closeSearch);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useQuery(
    api.products.searchProducts,
    query.trim().length >= 2 ? { query: query.trim() } : "skip"
  ) as Product[] | undefined;

  // Focus input when opened; clear query when closed
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => {
      clearTimeout(t);
      setQuery("");
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeSearch]);

  const showResults = query.trim().length >= 2;
  const loading = showResults && results === undefined;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[60] bg-[#0a0e1a]/80 backdrop-blur-sm"
            onClick={closeSearch}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[88px] left-1/2 z-[61] w-full max-w-2xl -translate-x-1/2 px-4"
          >
            <div className="overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117] shadow-[0_24px_64px_rgba(0,0,0,0.7)]">
              {/* Input row */}
              <div className="flex items-center gap-3 border-b border-[#1e2435] px-4 py-3">
                <Search className="h-5 w-5 shrink-0 text-[#f5a623]" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, categories…"
                  className="flex-1 bg-transparent text-sm text-white placeholder-[#8b92a5] outline-none"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-[#8b92a5] hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={closeSearch}
                  className="ml-1 rounded-lg border border-[#1e2435] px-2 py-0.5 text-[10px] text-[#8b92a5] hover:text-white"
                >
                  ESC
                </button>
              </div>

              {/* Results */}
              {showResults && (
                <div className="max-h-[60vh] overflow-y-auto">
                  {loading && (
                    <div className="px-4 py-8 text-center text-sm text-[#8b92a5]">Searching…</div>
                  )}
                  {!loading && results && results.length === 0 && (
                    <div className="px-4 py-8 text-center text-sm text-[#8b92a5]">
                      No results for &ldquo;{query}&rdquo;
                    </div>
                  )}
                  {!loading && results && results.length > 0 && (
                    <>
                      <p className="px-4 pt-3 pb-1 text-[10px] font-semibold tracking-widest text-[#8b92a5] uppercase">
                        {results.length} result{results.length !== 1 ? "s" : ""}
                      </p>
                      <ul>
                        {results.slice(0, 8).map((product) => (
                          <li key={product._id}>
                            <Link
                              href={`/shop/${product.category}/${product.slug}`}
                              onClick={closeSearch}
                              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#1a2035]"
                            >
                              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#1e2435] bg-[#0a0e1a]">
                                <Image
                                  src={product.images[0] ?? "/logo.png"}
                                  alt={product.name}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-[#cbd5e1]">
                                  {product.name}
                                </p>
                                <p className="text-xs text-[#8b92a5]">
                                  KES {product.price.toLocaleString()}
                                  {product.condition === "ex-uk" && (
                                    <span className="ml-2 text-[#38bdf8]">Ex UK</span>
                                  )}
                                </p>
                              </div>
                              <ArrowRight className="h-4 w-4 shrink-0 text-[#8b92a5]" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                      {results.length > 8 && (
                        <div className="border-t border-[#1e2435] px-4 py-3">
                          <Link
                            href={`/shop?search=${encodeURIComponent(query)}`}
                            onClick={closeSearch}
                            className="text-sm font-medium text-[#f5a623] hover:underline"
                          >
                            View all {results.length} results →
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Empty state hint */}
              {!showResults && (
                <div className="px-4 py-5">
                  <p className="mb-3 text-[10px] font-semibold tracking-widest text-[#8b92a5] uppercase">
                    Popular categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["iPhones", "MacBooks", "Samsung", "PlayStation", "Starlink", "Audio"].map(
                      (cat) => (
                        <Link
                          key={cat}
                          href={`/shop?search=${cat}`}
                          onClick={closeSearch}
                          className="rounded-lg border border-[#1e2435] bg-[#0a0e1a] px-3 py-1.5 text-xs text-[#cbd5e1] transition-colors hover:border-[#f5a623]/40 hover:text-[#f5a623]"
                        >
                          {cat}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
