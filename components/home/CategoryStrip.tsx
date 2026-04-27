"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Smartphone,
  Tv,
  Headphones,
  Gamepad2,
  Wifi,
  Plug,
  ShoppingBag,
  Monitor,
  Watch,
  Tablet,
} from "lucide-react";

const CATEGORIES = [
  { label: "iPhones", href: "/shop/iphones", icon: Smartphone, color: "#a8d5e2" },
  { label: "Samsung", href: "/shop/samsung", icon: Smartphone, color: "#1e88e5" },
  { label: "iPad", href: "/shop/ipad", icon: Tablet, color: "#a78bfa" },
  { label: "Mac", href: "/shop/mac", icon: Monitor, color: "#cbd5e1" },
  { label: "Wearables", href: "/shop/wearables", icon: Watch, color: "#34d399" },
  { label: "Audio", href: "/shop/audio", icon: Headphones, color: "#f87171" },
  { label: "Televisions", href: "/shop/televisions", icon: Tv, color: "#f5a623" },
  { label: "Gaming", href: "/shop/gaming", icon: Gamepad2, color: "#f87171" },
  { label: "Starlink", href: "/shop/connectivity", icon: Wifi, color: "#38bdf8" },
  { label: "Power", href: "/shop/power", icon: Plug, color: "#22c55e" },
  { label: "Accessories", href: "/shop/accessories", icon: ShoppingBag, color: "#fb923c" },
];

export function CategoryStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-[#0a0e1a] py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="mb-6 text-lg font-semibold text-white"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Shop by Category
        </motion.h2>

        {/* Scrollable row */}
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map(({ label, href, icon: Icon, color }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="snap-start"
            >
              <Link href={href} className="group flex flex-col items-center gap-2.5 outline-none">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#1e2435] bg-[#0d1117] transition-all duration-200 group-hover:scale-105 group-hover:border-[#f5a623]/40 group-hover:shadow-[0_0_16px_rgba(245,166,35,0.15)]">
                  <Icon className="h-7 w-7 transition-colors duration-200" style={{ color }} />
                </div>
                <div className="relative">
                  <span className="text-xs font-medium whitespace-nowrap text-[#8b92a5] transition-colors duration-200 group-hover:text-white">
                    {label}
                  </span>
                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-[#f5a623] transition-all duration-200 group-hover:w-full" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
