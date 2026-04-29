"use client";

import { useState, useEffect, useSyncExternalStore, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Smartphone,
  Tablet,
  Monitor,
  Watch,
  Headphones,
  Tv,
  Gamepad2,
  Wifi,
  Plug,
  ShoppingBag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useUIStore } from "@/stores/ui.store";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cloudinaryUrl, cn } from "@/lib/utils";
import type { Product } from "@/types";

// ── Category data for dropdown ─────────────────────────────────────────────
interface DropCategory {
  label: string;
  href: string;
  icon: LucideIcon;
  color: string;
  glow: string;
}

const DROP_CATEGORIES: DropCategory[] = [
  {
    label: "iPhones",
    href: "/shop/iphones",
    icon: Smartphone,
    color: "#a8d5e2",
    glow: "rgba(168,213,226,0.18)",
  },
  {
    label: "Samsung",
    href: "/shop/samsung",
    icon: Smartphone,
    color: "#1e88e5",
    glow: "rgba(30,136,229,0.18)",
  },
  {
    label: "iPad",
    href: "/shop/ipad",
    icon: Tablet,
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.18)",
  },
  {
    label: "Mac",
    href: "/shop/mac",
    icon: Monitor,
    color: "#cbd5e1",
    glow: "rgba(203,213,225,0.18)",
  },
  {
    label: "Wearables",
    href: "/shop/wearables",
    icon: Watch,
    color: "#34d399",
    glow: "rgba(52,211,153,0.18)",
  },
  {
    label: "Audio",
    href: "/shop/audio",
    icon: Headphones,
    color: "#f87171",
    glow: "rgba(248,113,113,0.18)",
  },
  {
    label: "Gaming",
    href: "/shop/gaming",
    icon: Gamepad2,
    color: "#fb923c",
    glow: "rgba(251,146,60,0.18)",
  },
  {
    label: "Starlink",
    href: "/shop/connectivity",
    icon: Wifi,
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.18)",
  },
  {
    label: "Power",
    href: "/shop/power",
    icon: Plug,
    color: "#22c55e",
    glow: "rgba(34,197,94,0.18)",
  },
  {
    label: "Accessories",
    href: "/shop/accessories",
    icon: ShoppingBag,
    color: "#fb923c",
    glow: "rgba(251,146,60,0.18)",
  },
];

const CATS_PER_PAGE = 4;

// ── Categories dropdown ────────────────────────────────────────────────────
function CategoriesDropdown() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(DROP_CATEGORIES.length / CATS_PER_PAGE);
  const visible = DROP_CATEGORIES.slice(page * CATS_PER_PAGE, (page + 1) * CATS_PER_PAGE);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      style={{
        transformOrigin: "top left",
        background: "rgba(10,14,26,0.97)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      className="absolute top-0 left-0 z-50 flex items-center gap-2 rounded-2xl border border-[#1e2435] p-3 shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
    >
      {/* Left arrow */}
      <button
        onClick={() => setPage((p) => Math.max(0, p - 1))}
        disabled={page === 0}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#1e2435] text-[#8b92a5] transition-all hover:border-[#f5a623]/40 hover:text-[#f5a623] disabled:cursor-not-allowed disabled:opacity-25"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Cards — AnimatePresence on the page container */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="flex gap-2"
          >
            {visible.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.href}
                  initial={{ opacity: 0, y: -10, scale: 0.88 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 28,
                    delay: i * 0.05,
                  }}
                >
                  <Link
                    href={cat.href}
                    className="group flex h-[118px] w-[112px] flex-col items-center justify-center gap-2.5 rounded-xl border border-[#1e2435] p-3 transition-all duration-200 hover:scale-[1.05] hover:border-[rgba(245,166,35,0.35)]"
                    style={{
                      background: `radial-gradient(ellipse at 50% 0%, ${cat.glow} 0%, #0d1117 80%)`,
                    }}
                  >
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
                      style={{
                        background: cat.glow,
                        boxShadow: `0 0 20px ${cat.color}35`,
                      }}
                    >
                      <Icon className="h-[22px] w-[22px]" style={{ color: cat.color }} />
                    </div>
                    <span className="text-center text-[11px] leading-tight font-semibold text-[#cbd5e1] transition-colors group-hover:text-white">
                      {cat.label}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right arrow */}
      <button
        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
        disabled={page === totalPages - 1}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#1e2435] text-[#8b92a5] transition-all hover:border-[#f5a623]/40 hover:text-[#f5a623] disabled:cursor-not-allowed disabled:opacity-25"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

// ── Deals dropdown ─────────────────────────────────────────────────────────
function DealsDropdown({ products }: { products: Product[] | undefined }) {
  const items = products?.slice(0, 4) ?? [];
  const loading = products === undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      style={{
        transformOrigin: "top left",
        background: "rgba(10,14,26,0.97)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      className="absolute top-0 left-0 z-50 w-[272px] rounded-2xl border border-[#1e2435] p-2.5 shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
    >
      <p className="mb-2 px-2 text-[9px] font-semibold tracking-[0.2em] text-[#f5a623] uppercase">
        Featured Deals
      </p>

      <div className="flex flex-col gap-1.5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-[#1e2435] px-3 py-2.5"
              >
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-[#1e2435]" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 w-3/4 animate-pulse rounded bg-[#1e2435]" />
                  <div className="h-2 w-1/2 animate-pulse rounded bg-[#1e2435]" />
                </div>
              </div>
            ))
          : items.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.18, delay: i * 0.05 }}
              >
                <Link
                  href={`/shop/${product.category}/${product.slug}`}
                  className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-[#1e2435] px-3 py-2.5 transition-all hover:border-[rgba(245,166,35,0.3)] hover:bg-[#111827]/90"
                >
                  {/* Active accent bar */}
                  <motion.div className="absolute top-0 bottom-0 left-0 w-[3px] rounded-r-full bg-[#f5a623] opacity-0 transition-opacity group-hover:opacity-100" />
                  {/* Thumbnail */}
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[#1e2435]">
                    {product.images[0] ? (
                      <Image
                        src={cloudinaryUrl(product.images[0])}
                        alt={product.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-[#1e2435]" />
                    )}
                  </div>
                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-semibold text-[#cbd5e1] transition-colors group-hover:text-white">
                      {product.name}
                    </p>
                    <p className="text-[10px] font-bold text-[#f5a623]">
                      KES {product.price.toLocaleString()}
                    </p>
                  </div>
                  {/* Badge */}
                  {product.isHotDeal && (
                    <span className="shrink-0 rounded-full bg-[#ef4444]/15 px-1.5 py-0.5 text-[8px] font-bold tracking-wider text-[#ef4444] uppercase">
                      Deal
                    </span>
                  )}
                </Link>
              </motion.div>
            ))}
      </div>

      <div className="mt-2 border-t border-[#1e2435] pt-2">
        <Link
          href="/deals"
          className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#8b92a5] transition-colors hover:text-[#f5a623]"
        >
          View All Deals <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </motion.div>
  );
}

// ── Nav item — hover line + optional dropdown ──────────────────────────────
function NavItem({
  label,
  href,
  active,
  dropContent,
}: {
  label: string;
  href: string;
  active: boolean;
  dropContent?: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDrop = () => {
    if (!dropContent) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setDropOpen(true);
  };
  const closeDrop = () => {
    if (!dropContent) return;
    // Long enough for the mouse to cross from nav link into the dropdown panel
    timerRef.current = setTimeout(() => setDropOpen(false), 300);
  };
  const keepDrop = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        setHovered(true);
        keepDrop();
        setDropOpen(!!dropContent ? true : false);
      }}
      onMouseLeave={() => {
        setHovered(false);
        closeDrop();
      }}
    >
      <Link
        href={href}
        className={cn(
          "relative block px-3 py-1.5 text-sm font-medium transition-colors duration-150",
          active ? "text-[#f5a623]" : "text-[#cbd5e1] hover:text-white"
        )}
      >
        {label}

        {/* Active gold indicator — layout-animated between active links */}
        {active && (
          <motion.span
            layoutId="nav-indicator"
            className="absolute right-3 bottom-0 left-3 h-[2px] rounded-full bg-[#f5a623]"
          />
        )}

        {/* Hover line — non-active only, draws left→right */}
        {!active && (
          <motion.span
            className="absolute right-3 bottom-0 left-3 h-[2px] rounded-full bg-white/25"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: hovered ? 1 : 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "left" }}
          />
        )}
      </Link>

      {/* Invisible bridge — fills the gap between link and panel so hover is continuous */}
      {dropContent && dropOpen && (
        <div
          className="absolute top-full left-0 z-40 h-3 w-full"
          onMouseEnter={keepDrop}
          onMouseLeave={closeDrop}
        />
      )}

      {/* Dropdown panel */}
      {dropContent && (
        <AnimatePresence>
          {dropOpen && (
            <div
              className="absolute top-full left-0 z-50 pt-3"
              onMouseEnter={keepDrop}
              onMouseLeave={closeDrop}
            >
              {dropContent}
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

// ── Main header ────────────────────────────────────────────────────────────
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

  // Pre-fetch hot deals so the dropdown has no loading flash
  const hotDeals = useQuery(api.products.getHotDeals);

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

          {/* Desktop nav — absolutely centered */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
            {NAV_LINKS.map(({ label, href }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              const dropContent =
                label === "Categories" ? (
                  <CategoriesDropdown />
                ) : label === "Deals" ? (
                  <DealsDropdown products={hotDeals as Product[] | undefined} />
                ) : undefined;

              return (
                <NavItem
                  key={href}
                  label={label}
                  href={href}
                  active={active}
                  dropContent={dropContent}
                />
              );
            })}
          </nav>

          {/* Right icons */}
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={openSearch}
              aria-label="Open search"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#cbd5e1] transition-colors hover:bg-[#1a2035] hover:text-white"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            <Link
              href="/account"
              aria-label="Account"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#cbd5e1] transition-colors hover:bg-[#1a2035] hover:text-white"
            >
              <User className="h-[18px] w-[18px]" />
            </Link>

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

            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-[#cbd5e1] transition-colors hover:bg-[#1a2035] hover:text-white md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Featured Products label */}
          <div className="hidden w-[200px] shrink-0 items-center justify-start pl-4 lg:flex lg:w-[230px]">
            <span className="text-[10px] font-semibold tracking-widest text-[#f5a623] uppercase select-none">
              Featured Products
            </span>
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

      {/* Mobile menu overlay */}
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
