"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { CartItem } from "@/components/cart/CartItem";
import { GlowCursor } from "@/components/shared/cursors/GlowCursor";

const DELIVERY_FEE = 300;

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal);
  const clearCart = useCartStore((s) => s.clearCart);

  const total = subtotal() + (items.length > 0 ? DELIVERY_FEE : 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-1 flex-col items-center justify-center px-4 py-24 text-center md:px-6">
        <GlowCursor />
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#0d1117]">
          <ShoppingBag className="h-9 w-9 text-[#8b92a5]" />
        </div>
        <h1
          className="mb-2 text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Your cart is empty
        </h1>
        <p className="mb-6 text-sm text-[#8b92a5]">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link
          href="/shop"
          className="rounded-xl bg-[#f5a623] px-6 py-3 text-sm font-semibold text-[#0a0e1a] transition-all hover:bg-[#ff9f1c] hover:shadow-[0_0_20px_rgba(245,166,35,0.35)]"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <GlowCursor />
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-white sm:text-3xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Your Cart
          </h1>
          <p className="mt-0.5 text-sm text-[#8b92a5]">
            {items.reduce((s, i) => s + i.quantity, 0)} item
            {items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/shop"
          className="flex items-center gap-1.5 text-sm text-[#8b92a5] transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Items list */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
            <div className="flex items-center justify-between border-b border-[#1e2435] px-5 py-3">
              <span className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
                Items
              </span>
              <button
                onClick={clearCart}
                className="flex items-center gap-1 text-xs text-[#8b92a5] transition-colors hover:text-[#ef4444]"
              >
                <Trash2 className="h-3 w-3" />
                Clear all
              </button>
            </div>
            <div className="divide-y divide-[#1e2435] px-5">
              {items.map((item, i) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.05 }}
                >
                  <CartItem item={item} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
            <div className="border-b border-[#1e2435] px-5 py-3">
              <span className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
                Order Summary
              </span>
            </div>

            <div className="flex flex-col gap-3 px-5 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8b92a5]">Subtotal</span>
                <span className="font-medium text-white">KES {subtotal().toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8b92a5]">Delivery</span>
                <span className="font-medium text-white">KES {DELIVERY_FEE.toLocaleString()}</span>
              </div>
              <div className="my-1 border-t border-[#1e2435]" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Total</span>
                <span
                  className="text-xl font-bold text-[#f5a623]"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  KES {total.toLocaleString()}
                </span>
              </div>

              <Link
                href="/checkout"
                className="mt-2 flex w-full items-center justify-center rounded-xl bg-[#f5a623] py-3 text-sm font-bold text-[#0a0e1a] transition-all hover:bg-[#ff9f1c] hover:shadow-[0_0_20px_rgba(245,166,35,0.35)] active:scale-95"
              >
                Proceed to Checkout
              </Link>

              <p className="text-center text-xs text-[#8b92a5]">
                Secure checkout · M-Pesa & Card accepted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
