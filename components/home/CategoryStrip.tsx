"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
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
  const ref = useRef<HTMLElement>(null);

  // Parallax: scroll from entering the section to leaving it
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden bg-[#080c16]"
    >
      {/* Parallax background layer */}
      <motion.div className="pointer-events-none absolute inset-[-10%] z-0" style={{ y: bgY }}>
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#f5a623 1px, transparent 1px), linear-gradient(90deg, #f5a623 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Gradient blobs */}
        <div
          className="absolute top-1/4 left-1/4 h-[400px] w-[400px] rounded-full blur-[120px]"
          style={{ background: "rgba(245,166,35,0.06)" }}
        />
        <div
          className="absolute right-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full blur-[100px]"
          style={{ background: "rgba(56,189,248,0.05)" }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 w-full px-4 py-20 md:px-6 lg:px-8"
        style={{ y: contentY }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="mb-1 text-xs font-semibold tracking-widest text-[#f5a623] uppercase">
            Explore
          </p>
          <h2
            className="text-3xl font-bold text-white sm:text-4xl"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Shop by Category
          </h2>
        </motion.div>

        {/* Grid — wraps on all screens */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-11">
          {CATEGORIES.map(({ label, href, icon: Icon, color }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.06, 0.5) }}
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
      </motion.div>
    </section>
  );
}
