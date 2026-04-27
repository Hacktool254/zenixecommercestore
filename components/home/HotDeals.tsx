"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProductCard } from "@/components/shared/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
      <Skeleton className="aspect-square w-full" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="mt-2 flex justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-8 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function HotDeals() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const products = useQuery(api.products.getHotDeals);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#0d1117] py-14">
      {/* Subtle orange glow top-left */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full blur-3xl"
        style={{ background: "rgba(245,166,35,0.06)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5a623]/15">
              <Flame className="h-5 w-5 text-[#f5a623]" />
            </div>
            <div>
              <p className="mb-0.5 text-xs font-semibold tracking-widest text-[#f5a623] uppercase">
                Limited Time
              </p>
              <h2
                className="text-2xl font-bold text-white sm:text-3xl"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Hot Deals
              </h2>
            </div>
          </div>
          <Link
            href="/deals"
            className="flex items-center gap-1.5 text-sm font-medium text-[#8b92a5] transition-colors hover:text-[#f5a623]"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {products === undefined
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.slice(0, 4).map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                >
                  <ProductCard
                    product={product as Parameters<typeof ProductCard>[0]["product"]}
                    showHotBadge
                  />
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
