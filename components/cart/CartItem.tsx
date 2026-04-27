"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import type { CartItem as CartItemType } from "@/types";

export function CartItem({ item }: { item: CartItemType }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-3 py-4 first:pt-0">
      {/* Thumbnail */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#1e2435] bg-[#0d1117]">
        <Image
          src={item.image || "/logo.png"}
          alt={item.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm leading-snug font-medium text-white">{item.name}</p>
          <button
            onClick={() => removeItem(item.productId)}
            aria-label="Remove item"
            className="mt-0.5 shrink-0 text-[#8b92a5] transition-colors hover:text-[#ef4444]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <span className="text-xs text-[#8b92a5] capitalize">
          {item.condition === "ex-uk" ? "Ex UK" : "Brand New"}
        </span>

        <div className="mt-1 flex items-center justify-between">
          {/* Qty controls */}
          <div className="flex items-center rounded-lg border border-[#1e2435] bg-[#0a0e1a]">
            <button
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              aria-label="Decrease quantity"
              className="flex h-7 w-7 items-center justify-center text-[#8b92a5] transition-colors hover:text-white"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-7 text-center text-xs font-semibold text-white">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                updateQuantity(item.productId, Math.min(item.stock, item.quantity + 1))
              }
              disabled={item.quantity >= item.stock}
              aria-label="Increase quantity"
              className="flex h-7 w-7 items-center justify-center text-[#8b92a5] transition-colors hover:text-white disabled:opacity-40"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Line total */}
          <span className="text-sm font-bold text-[#f5a623]">
            KES {(item.price * item.quantity).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
