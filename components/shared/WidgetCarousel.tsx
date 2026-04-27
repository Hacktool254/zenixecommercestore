"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface WidgetItem {
  id: string;
  label: string;
  sub?: string;
  color?: string;
}

interface Props {
  items: WidgetItem[];
  autoScrollMs?: number;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export function WidgetCarousel({ items, autoScrollMs = 2200 }: Props) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => mod(prev + 1, items.length));
    }, autoScrollMs);
  };

  useEffect(() => {
    start();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, autoScrollMs]);

  const handleClick = (idx: number) => {
    setActive(idx);
    start(); // reset timer on manual click
  };

  // Render 5 items visible: -2 -1 [0] +1 +2
  const VISIBLE = 5;
  const offsets = Array.from({ length: VISIBLE }, (_, i) => i - Math.floor(VISIBLE / 2));

  return (
    <div className="relative flex h-full flex-col items-stretch justify-center gap-0 select-none">
      {offsets.map((offset) => {
        const idx = mod(active + offset, items.length);
        const item = items[idx];
        if (!item) return null;
        const isActive = offset === 0;
        const absOffset = Math.abs(offset);

        // Scale and opacity drop-off from center
        const scale = isActive ? 1 : absOffset === 1 ? 0.82 : 0.65;
        const opacity = isActive ? 1 : absOffset === 1 ? 0.55 : 0.28;
        const py = isActive ? "py-3.5 px-5" : absOffset === 1 ? "py-2.5 px-4" : "py-1.5 px-3";
        const textSize = isActive ? "text-sm" : absOffset === 1 ? "text-xs" : "text-[10px]";
        const accentColor = item.color ?? "#f5a623";

        return (
          <motion.button
            key={`${offset}-${item.id}`}
            layout
            onClick={() => handleClick(idx)}
            animate={{ scale, opacity }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className={`relative w-full cursor-pointer overflow-hidden rounded-xl border text-left transition-colors duration-200 ${py} ${
              isActive
                ? "border-[rgba(245,166,35,0.35)] bg-[#111827]/90 shadow-[0_0_20px_rgba(245,166,35,0.15)]"
                : "border-[#1e2435] bg-[#0d1117]/60"
            }`}
            style={{ transformOrigin: "center" }}
          >
            {isActive && (
              <motion.div
                layoutId="widget-active-bar"
                className="absolute top-0 bottom-0 left-0 w-[3px] rounded-r-full"
                style={{ background: accentColor }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <p
              className={`leading-snug font-semibold ${textSize}`}
              style={{ color: isActive ? accentColor : "#cbd5e1" }}
            >
              {item.label}
            </p>
            {item.sub && isActive && (
              <AnimatePresence>
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-0.5 text-[10px] text-[#8b92a5]"
                >
                  {item.sub}
                </motion.p>
              </AnimatePresence>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
