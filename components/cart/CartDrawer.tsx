"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { CartItem } from "./CartItem";

export function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isDrawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const subtotal = useCartStore((s) => s.subtotal);

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
            transition={{ duration: 0.2 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[#1e2435] bg-[#0a0e1a] shadow-[−8px_0_40px_rgba(0,0,0,0.6)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1e2435] px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#f5a623]" />
                <h2
                  className="text-base font-bold text-white"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  Your Cart
                </h2>
                {items.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f5a623] text-[10px] font-bold text-[#0a0e1a]">
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={closeDrawer}
                aria-label="Close cart"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8b92a5] transition-colors hover:bg-[#1e2435] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0d1117]">
                    <ShoppingBag className="h-7 w-7 text-[#8b92a5]" />
                  </div>
                  <div>
                    <p className="mb-1 font-semibold text-white">Your cart is empty</p>
                    <p className="text-sm text-[#8b92a5]">Add some products to get started.</p>
                  </div>
                  <Link
                    href="/shop"
                    onClick={closeDrawer}
                    className="mt-2 rounded-xl bg-[#f5a623] px-5 py-2.5 text-sm font-semibold text-[#0a0e1a] transition-all hover:bg-[#ff9f1c]"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[#1e2435]">
                  {items.map((item) => (
                    <CartItem key={item.productId} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[#1e2435] px-5 py-5">
                {/* Subtotal */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-[#8b92a5]">Subtotal</span>
                  <span
                    className="text-lg font-bold text-white"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    KES {subtotal().toLocaleString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Link
                    href="/checkout"
                    onClick={closeDrawer}
                    className="flex w-full items-center justify-center rounded-xl bg-[#f5a623] py-3 text-sm font-bold text-[#0a0e1a] transition-all hover:bg-[#ff9f1c] hover:shadow-[0_0_20px_rgba(245,166,35,0.35)] active:scale-95"
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    href="/cart"
                    onClick={closeDrawer}
                    className="flex w-full items-center justify-center rounded-xl border border-[#1e2435] py-3 text-sm font-medium text-[#cbd5e1] transition-colors hover:border-[#f5a623]/40 hover:text-white"
                  >
                    View Full Cart
                  </Link>
                </div>

                <p className="mt-3 text-center text-xs text-[#8b92a5]">
                  Delivery charges calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
