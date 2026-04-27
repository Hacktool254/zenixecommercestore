"use client";

// Tubes cursor — SVG ribbon trail with bezier smoothing, tapers and fades
// Similar to Framer's tubes cursor effect
import { useEffect, useRef } from "react";

const TRAIL_LENGTH = 24;
const TUBE_WIDTH = 14;

interface Point {
  x: number;
  y: number;
}

function catmullRom(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x:
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y:
      0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
}

export function RingCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Trail history
    const trail: Point[] = Array.from({ length: TRAIL_LENGTH }, () => ({ x: -300, y: -300 }));
    const target = { x: -300, y: -300 };
    const current = { x: -300, y: -300 };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    let raf: number;
    const tick = () => {
      // Smooth head toward cursor
      current.x += (target.x - current.x) * 0.25;
      current.y += (target.y - current.y) * 0.25;

      // Shift trail
      trail.unshift({ x: current.x, y: current.y });
      trail.pop();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (trail.length < 4) {
        raf = requestAnimationFrame(tick);
        return;
      }

      // Draw tube segments with catmull-rom interpolation
      const steps = 6;
      for (let i = 1; i < trail.length - 2; i++) {
        const p0 = trail[Math.max(0, i - 1)]!;
        const p1 = trail[i]!;
        const p2 = trail[i + 1]!;
        const p3 = trail[Math.min(trail.length - 1, i + 2)]!;

        const segProgress = i / (trail.length - 1); // 0 = head, 1 = tail
        const width = TUBE_WIDTH * (1 - segProgress) * (1 - segProgress);
        const alpha = (1 - segProgress) * 0.9;

        for (let s = 0; s < steps; s++) {
          const t0 = s / steps;
          const t1 = (s + 1) / steps;
          const a = catmullRom(p0, p1, p2, p3, t0);
          const b = catmullRom(p0, p1, p2, p3, t1);

          const w0 = width * (1 - t0 * 0.3);
          const w1 = width * (1 - t1 * 0.3);

          // Perpendicular normal for tube width
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const nx = (-dy / len) * 0.5;
          const ny = (dx / len) * 0.5;

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.lineWidth = (w0 + w1) * 0.5;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          // Gradient stroke along segment
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, `rgba(245, 166, 35, ${alpha})`);
          grad.addColorStop(1, `rgba(255, 159, 28, ${alpha * 0.8})`);

          ctx.strokeStyle = grad;
          ctx.shadowBlur = 10;
          ctx.shadowColor = "rgba(245, 166, 35, 0.5)";

          ctx.beginPath();
          ctx.moveTo(a.x + nx * w0, a.y + ny * w0);
          ctx.lineTo(b.x + nx * w1, b.y + ny * w1);
          ctx.lineTo(b.x - nx * w1, b.y - ny * w1);
          ctx.lineTo(a.x - nx * w0, a.y - ny * w0);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }

      // Dot at cursor head
      ctx.save();
      ctx.fillStyle = "#f5a623";
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#f5a623";
      ctx.globalAlpha = 0.95;
      ctx.beginPath();
      ctx.arc(trail[0]!.x, trail[0]!.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden="true"
    />
  );
}
