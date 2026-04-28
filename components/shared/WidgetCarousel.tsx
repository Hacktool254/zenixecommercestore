"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

// How many items visible above and below the active center
const ABOVE = 3;
const BELOW = 3;
const TOTAL_VISIBLE = ABOVE + 1 + BELOW;

export function WidgetCarousel({ items, autoScrollMs = 2200 }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback(() => {
    setActive((prev) => mod(prev + 1, items.length));
  }, [items.length]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, autoScrollMs);
  }, [advance, autoScrollMs]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Start auto-scroll on mount and whenever paused changes
  useEffect(() => {
    if (paused) {
      stopTimer();
    } else {
      startTimer();
    }
    return stopTimer;
  }, [paused, startTimer, stopTimer]);

  const handleClick = (idx: number) => {
    setActive(idx);
    // Reset timer on manual click
    if (!paused) startTimer();
  };

  // Build the visible slots: offsets from -ABOVE to +BELOW
  const offsets = Array.from({ length: TOTAL_VISIBLE }, (_, i) => i - ABOVE);

  return (
    <div
      className="relative flex h-full flex-col items-stretch justify-center gap-1 select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {offsets.map((offset) => {
        const idx = mod(active + offset, items.length);
        const item = items[idx];
        if (!item) return null;

        const isActive = offset === 0;
        const absOffset = Math.abs(offset);

        // Scale and opacity reduce going away from center, more aggressive going up
        const scale = isActive ? 1 : absOffset === 1 ? 0.84 : absOffset === 2 ? 0.68 : 0.52;
        // Items above the active fade more (they "disappear upward")
        const opacityBelow = absOffset === 1 ? 0.55 : absOffset === 2 ? 0.3 : 0.12;
        const opacityAbove = absOffset === 1 ? 0.4 : absOffset === 2 ? 0.18 : 0.06;
        const opacity = isActive ? 1 : offset < 0 ? opacityAbove : opacityBelow;

        const accentColor = item.color ?? "#f5a623";
        const py = isActive ? "py-3 px-4" : absOffset === 1 ? "py-2 px-3.5" : "py-1.5 px-3";
        const textSize = isActive ? "text-sm" : absOffset === 1 ? "text-xs" : "text-[10px]";

        return (
          <motion.button
            key={item.id}
            layout
            onClick={() => handleClick(idx)}
            animate={{ scale, opacity }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
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
                  key="sub"
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

      {/* Pause indicator */}
      <AnimatePresence>
        {paused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute right-0 bottom-0 left-0 flex justify-center pb-1"
          >
            <span className="text-[8px] tracking-widest text-[#8b92a5] uppercase">paused</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
