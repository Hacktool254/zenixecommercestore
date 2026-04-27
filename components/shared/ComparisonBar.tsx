"use client";

import { useUIStore } from "@/stores/ui.store";
import { useCartStore } from "@/stores/cart.store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, GitCompare, ShoppingCart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function ComparisonBar() {
  const list = useUIStore((s) => s.comparisonList);
  const remove = useUIStore((s) => s.removeFromComparison);
  const clear = useUIStore((s) => s.clearComparison);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  return (
    <AnimatePresence>
      {list.length >= 2 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 30 }}
          className="fixed bottom-16 left-0 z-40 w-full px-4 pb-3 md:bottom-4"
        >
          <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-[#f5a623]/30 bg-[#0d1117]/95 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md">
            {/* Product chips */}
            <div className="flex flex-1 flex-wrap items-center gap-2">
              {list.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center gap-2 rounded-xl border border-[#1e2435] bg-[#111827] px-2 py-1.5"
                >
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={p.images[0] ?? "/logo.png"}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                  <span className="max-w-[100px] truncate text-xs font-medium text-white">
                    {p.name}
                  </span>
                  <button
                    onClick={() => remove(p._id)}
                    className="ml-0.5 text-[#8b92a5] transition hover:text-red-400"
                    aria-label={`Remove ${p.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {/* Placeholder slots */}
              {list.length < 3 && (
                <div className="flex h-10 items-center rounded-xl border border-dashed border-[#1e2435] px-3 text-xs text-[#8b92a5]">
                  + add 1 more
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={clear}
                className="hidden text-xs text-[#8b92a5] transition hover:text-white sm:block"
              >
                Clear
              </button>
              <button
                onClick={() => router.push("/compare")}
                className="flex items-center gap-1.5 rounded-xl bg-[#f5a623] px-4 py-2 text-sm font-bold text-[#0a0e1a] transition hover:bg-[#ff9f1c] hover:shadow-[0_0_16px_rgba(245,166,35,0.35)]"
              >
                <GitCompare className="h-4 w-4" />
                Compare
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
