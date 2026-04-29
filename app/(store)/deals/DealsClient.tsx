"use client";

import { useRef, useCallback } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { Flame } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProductCard } from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types";

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

function TiltCard({
  product,
  index,
  showHotBadge,
}: {
  product: Product;
  index: number;
  showHotBadge?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRX = useSpring(rotateX, { stiffness: 200, damping: 22 });
  const springRY = useSpring(rotateY, { stiffness: 200, damping: 22 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      rotateY.set(((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * 10);
      rotateX.set(-((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * 7);
    },
    [rotateX, rotateY]
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.5) }}
      style={{
        rotateX: springRX,
        rotateY: springRY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <ProductCard product={product} showHotBadge={showHotBadge} />
    </motion.div>
  );
}

export function DealsClient() {
  const products = useQuery(api.products.getDealsProducts);
  const items = products as Product[] | undefined;

  return (
    <div className="min-h-screen bg-[#0a0e1a] px-4 py-10 md:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 flex items-center gap-4"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5a623]/15">
            <Flame className="h-6 w-6 text-[#f5a623]" />
          </div>
          <div>
            <p className="mb-0.5 text-xs font-semibold tracking-widest text-[#f5a623] uppercase">
              Ex UK · Ex USA · Limited Time
            </p>
            <h1
              className="text-3xl font-bold text-white sm:text-4xl"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Hot Deals
            </h1>
          </div>
        </motion.div>

        {/* Dense grid — 2 cols mobile → 3 tablet → 4 desktop → 5 wide */}
        <div
          className="grid gap-3 sm:gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          }}
        >
          {items === undefined
            ? Array.from({ length: 20 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : items.map((product, i) => (
                <TiltCard
                  key={product._id}
                  product={product}
                  index={i}
                  showHotBadge={product.isHotDeal}
                />
              ))}
        </div>

        {items?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Flame className="mb-4 h-12 w-12 text-[#f5a623]/30" />
            <p className="text-lg font-semibold text-white">No deals right now</p>
            <p className="mt-1 text-sm text-[#8b92a5]">
              Check back soon — new deals drop regularly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
