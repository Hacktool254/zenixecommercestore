"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { Home, Grid2x2, Tag, User, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/cart.store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/shop", icon: Grid2x2 },
  { label: "Deals", href: "/deals", icon: Tag },
  { label: "Account", href: "/account", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const itemCount = useSyncExternalStore(
    useCartStore.subscribe,
    () => useCartStore.getState().itemCount(),
    () => 0
  );
  const openDrawer = useCartStore((s) => s.openDrawer);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center border-t border-[#1e2435] md:hidden"
      style={{
        background: "rgba(10,14,26,0.97)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2"
          >
            <Icon
              className={cn(
                "h-[22px] w-[22px] transition-colors duration-150",
                active ? "text-[#f5a623]" : "text-[#8b92a5]"
              )}
              strokeWidth={active ? 2.5 : 1.75}
            />
            <span
              className={cn(
                "text-[10px] font-medium transition-colors duration-150",
                active ? "text-[#f5a623]" : "text-[#8b92a5]"
              )}
            >
              {label}
            </span>
          </Link>
        );
      })}

      {/* Cart tab */}
      <button
        onClick={openDrawer}
        className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2"
        aria-label="Cart"
      >
        <div className="relative">
          <ShoppingCart
            className="h-[22px] w-[22px] text-[#8b92a5] transition-colors duration-150"
            strokeWidth={1.75}
          />
          <AnimatePresence>
            {itemCount > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1.5 -right-1.5 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-[#f5a623] px-0.5 text-[9px] leading-none font-bold text-[#0a0e1a]"
              >
                {itemCount > 99 ? "99+" : itemCount}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <span className="text-[10px] font-medium text-[#8b92a5]">Cart</span>
      </button>
    </nav>
  );
}
