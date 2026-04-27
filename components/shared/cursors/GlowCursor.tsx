"use client";

// Smoke cursor — canvas particles that drift upward with turbulence and fade
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export function GlowCursor() {
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

    const particles: Particle[] = [];
    const mouse = { x: -500, y: -500 };
    let t = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      for (let i = 0; i < 3; i++) {
        const maxLife = 60 + Math.random() * 40;
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(0.4 + Math.random() * 0.8),
          life: maxLife,
          maxLife,
          size: 18 + Math.random() * 22,
          hue: 28 + Math.random() * 20, // warm orange-amber hues
        });
      }
    };
    window.addEventListener("mousemove", onMove);

    let raf: number;
    const tick = () => {
      t += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]!;
        p.life--;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // turbulence
        p.vx += Math.sin(t + p.y * 0.01) * 0.04;
        p.vy -= 0.01;
        p.x += p.vx;
        p.y += p.vy;
        p.size *= 1.015;

        const progress = p.life / p.maxLife; // 1→0
        const alpha = progress < 0.3 ? (progress / 0.3) * 0.45 : progress * 0.45;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0, `hsla(${p.hue}, 90%, 65%, ${alpha})`);
        grad.addColorStop(0.5, `hsla(${p.hue}, 80%, 50%, ${alpha * 0.5})`);
        grad.addColorStop(1, `hsla(${p.hue}, 70%, 40%, 0)`);

        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

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
