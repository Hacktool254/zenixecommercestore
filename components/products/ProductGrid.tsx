"use client";

import { useRef, useCallback } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types";

function CardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
      <Skeleton className="aspect-square w-full" />
      <div className="flex flex-col gap-2 p-3">
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

function TiltCard({ product, index }: { product: Product; index: number }) {
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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.06, 0.4) }}
      style={{
        rotateX: springRX,
        rotateY: springRY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <ProductCard product={product} />
    </motion.div>
  );
}

interface Props {
  products: Product[] | undefined;
  skeletonCount?: number;
}

export function ProductGrid({ products, skeletonCount = 8 }: Props) {
  if (products === undefined) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="mb-2 text-lg font-semibold text-white">No products found</p>
        <p className="text-sm text-[#8b92a5]">Try adjusting your filters or search term.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, i) => (
        <TiltCard key={product._id} product={product} index={i} />
      ))}
    </div>
  );
}
