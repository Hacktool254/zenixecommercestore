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

// Show 5 above + active + 5 below = 11 items visible, filling the panel
const ABOVE = 5;
const BELOW = 5;
const TOTAL_VISIBLE = ABOVE + 1 + BELOW;

export function WidgetCarousel({ items, autoScrollMs = 2200 }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (!paused) startTimer();
  };

  // Wheel scroll when hovered — each tick of the wheel advances/reverses by 1
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let wheelAccum = 0;
    const THRESHOLD = 60;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      wheelAccum += e.deltaY;
      if (wheelAccum > THRESHOLD) {
        wheelAccum = 0;
        setActive((prev) => mod(prev + 1, items.length));
      } else if (wheelAccum < -THRESHOLD) {
        wheelAccum = 0;
        setActive((prev) => mod(prev - 1, items.length));
      }
    };

    const attach = () => el.addEventListener("wheel", onWheel, { passive: false });
    const detach = () => {
      el.removeEventListener("wheel", onWheel);
      wheelAccum = 0;
    };

    el.addEventListener("mouseenter", attach);
    el.addEventListener("mouseleave", detach);
    return () => {
      el.removeEventListener("mouseenter", attach);
      el.removeEventListener("mouseleave", detach);
      detach();
    };
  }, [items.length]);

  const offsets = Array.from({ length: TOTAL_VISIBLE }, (_, i) => i - ABOVE);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full flex-col items-stretch justify-between py-1 select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {offsets.map((offset) => {
        const idx = mod(active + offset, items.length);
        const item = items[idx];
        if (!item) return null;

        const isActive = offset === 0;
        const absOffset = Math.abs(offset);

        // Very subtle scale — barely noticeable difference
        const scale = isActive ? 1 : 1 - absOffset * 0.04;

        // Opacity: above fades faster than below (disappearing upward feel)
        const opacity = isActive
          ? 1
          : offset < 0
            ? Math.max(0.08, 0.75 - absOffset * 0.14)
            : Math.max(0.12, 0.85 - absOffset * 0.14);

        const accentColor = item.color ?? "#f5a623";

        return (
          <motion.button
            key={offset}
            onClick={() => handleClick(idx)}
            animate={{ scale, opacity }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`relative w-full cursor-pointer overflow-hidden rounded-xl border px-3.5 text-left transition-colors duration-150 ${
              isActive
                ? "border-[rgba(245,166,35,0.35)] bg-[#111827]/90 py-2.5 shadow-[0_0_16px_rgba(245,166,35,0.12)]"
                : "border-[#1e2435] bg-[#0d1117]/50 py-1.5 hover:border-[rgba(245,166,35,0.2)] hover:bg-[#0d1117]"
            }`}
            style={{ transformOrigin: "center" }}
          >
            {isActive && (
              <motion.div
                layoutId="widget-active-bar"
                className="absolute top-0 bottom-0 left-0 w-[3px] rounded-r-full"
                style={{ background: accentColor }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
              />
            )}
            <p
              className={`truncate leading-snug font-semibold ${isActive ? "text-sm" : "text-xs"}`}
              style={{ color: isActive ? accentColor : "#cbd5e1" }}
            >
              {item.label}
            </p>
            {isActive && item.sub && (
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
            className="pointer-events-none absolute right-2 bottom-0 flex items-center gap-1"
          >
            <span className="text-[8px] tracking-widest text-[#8b92a5] uppercase">
              scroll to browse
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
