"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useUIStore } from "@/stores/ui.store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Categories", href: "/categories" },
  { label: "Shop", href: "/shop" },
  { label: "Deals", href: "/deals" },
  { label: "Delivery", href: "/delivery" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const itemCount = useSyncExternalStore(
    useCartStore.subscribe,
    () => useCartStore.getState().itemCount(),
    () => 0
  );
  const openDrawer = useCartStore((s) => s.openDrawer);
  const openSearch = useUIStore((s) => s.openSearch);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 right-0 left-0 z-50 h-[72px] transition-all duration-300",
          scrolled
            ? "border-b border-[#1e2435] shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
            : "border-b border-transparent"
        )}
        style={{
          background: "rgba(10,14,26,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="relative flex h-full w-full items-center px-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/logo.png"
              alt="Zenix Electronics"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
              priority
            />
          </Link>

          {/* Desktop nav — absolutely centered, out of flow so it doesn't affect icon placement */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
            {NAV_LINKS.map(({ label, href }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative px-3 py-1.5 text-sm font-medium transition-colors duration-150",
                    active ? "text-[#f5a623]" : "text-[#cbd5e1] hover:text-white"
                  )}
                >
                  {label}
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute right-3 bottom-0 left-3 h-[2px] rounded-full bg-[#f5a623]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right icons — ml-auto pins them to the right independently of the centered nav */}
          <div className="ml-auto flex items-center gap-1">
            {/* Search */}
            <button
              onClick={openSearch}
              aria-label="Open search"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#cbd5e1] transition-colors hover:bg-[#1a2035] hover:text-white"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            {/* Account */}
            <Link
              href="/account"
              aria-label="Account"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#cbd5e1] transition-colors hover:bg-[#1a2035] hover:text-white"
            >
              <User className="h-[18px] w-[18px]" />
            </Link>

            {/* Cart */}
            <button
              onClick={openDrawer}
              aria-label="Cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#cbd5e1] transition-colors hover:bg-[#1a2035] hover:text-white"
            >
              <ShoppingCart className="h-[18px] w-[18px]" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#f5a623] text-[10px] leading-none font-bold text-[#0a0e1a]"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-[#cbd5e1] transition-colors hover:bg-[#1a2035] hover:text-white md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Featured Products — fixed-width block pinned to right edge, directly above carousel */}
          <div className="hidden w-[200px] shrink-0 items-center justify-start pl-4 lg:flex lg:w-[230px]">
            <Link
              href="/shop?sort=featured"
              className="text-[10px] font-semibold tracking-widest text-[#f5a623] uppercase transition-opacity hover:opacity-70"
            >
              Featured Products
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed top-[72px] right-0 left-0 z-40 border-b border-[#1e2435] md:hidden"
            style={{
              background: "rgba(10,14,26,0.97)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <nav className="flex flex-col px-4 py-3">
              {NAV_LINKS.map(({ label, href }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center border-b border-[#1e2435] py-3 text-sm font-medium transition-colors last:border-0",
                      active ? "text-[#f5a623]" : "text-[#cbd5e1] hover:text-white"
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to close mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
