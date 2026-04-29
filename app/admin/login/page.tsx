"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});
type FormData = z.infer<typeof schema>;

function GridBackground() {
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

    let offset = 0;
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const spacing = 40;
      ctx.strokeStyle = "rgba(245,166,35,0.07)";
      ctx.lineWidth = 1;

      // vertical lines
      for (let x = 0; x < canvas.width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      // horizontal lines — scroll down slowly
      for (let y = (offset % spacing) - spacing; y < canvas.height + spacing; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // moving scan line
      const scanY = (offset * 2) % (canvas.height + 40);
      const grad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.5, "rgba(245,166,35,0.15)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 20, canvas.width, 40);

      offset += 0.3;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0" />;
}

export default function AdminLoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuthActions();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError("");
    setLoading(true);
    try {
      await signIn("password", {
        email: data.email,
        password: data.password,
        flow: "signIn",
      });
      router.push("/admin");
    } catch {
      setError("Access denied — invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080c16]">
      <GridBackground />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full blur-[200px]"
          style={{ background: "rgba(245,166,35,0.05)" }}
        />
        <div
          className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full blur-[180px]"
          style={{ background: "rgba(245,166,35,0.04)" }}
        />
      </div>

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md px-4"
        style={{ fontFamily: "'Courier New', monospace" }}
      >
        <div
          className="relative overflow-hidden rounded-2xl border border-[#f5a623]/20 bg-[#080c16]/90 p-10 backdrop-blur-xl"
          style={{ boxShadow: "0 0 60px rgba(245,166,35,0.08), 0 0 120px rgba(245,166,35,0.04)" }}
        >
          {/* Corner decorations */}
          {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map((pos) => (
            <div
              key={pos}
              className="absolute h-5 w-5"
              style={{
                top: pos.includes("top") ? 12 : undefined,
                bottom: pos.includes("bottom") ? 12 : undefined,
                left: pos.includes("left") ? 12 : undefined,
                right: pos.includes("right") ? 12 : undefined,
                borderTop: pos.includes("top") ? "2px solid #f5a623" : undefined,
                borderBottom: pos.includes("bottom") ? "2px solid #f5a623" : undefined,
                borderLeft: pos.includes("left") ? "2px solid #f5a623" : undefined,
                borderRight: pos.includes("right") ? "2px solid #f5a623" : undefined,
              }}
            />
          ))}

          {/* Header */}
          <div className="mb-10 text-center">
            <p className="mb-1 text-[10px] tracking-[0.3em] text-[#f5a623]/60 uppercase">
              ▶ System Ready
            </p>
            <h1
              className="text-3xl font-black tracking-[0.25em] text-[#f5a623] uppercase"
              style={{ textShadow: "0 0 30px rgba(245,166,35,0.4)" }}
            >
              Admin Access
            </h1>
            <p className="mt-2 text-[10px] tracking-[0.2em] text-[#f5a623]/40 uppercase">
              Zenix Electronics — Restricted
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label className="mb-2 block text-[10px] tracking-[0.2em] text-[#f5a623]/70 uppercase">
                User Identification
              </label>
              <div className="relative">
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Enter admin email"
                  autoComplete="email"
                  className="w-full rounded-lg border border-[#f5a623]/20 bg-[#f5a623]/5 px-4 py-3 text-sm text-[#f5a623] placeholder-[#f5a623]/25 transition-all outline-none focus:border-[#f5a623]/60 focus:bg-[#f5a623]/10 focus:shadow-[0_0_20px_rgba(245,166,35,0.15)]"
                  style={{ fontFamily: "'Courier New', monospace" }}
                />
                {errors.email && (
                  <p className="mt-1 text-[10px] text-red-400">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-[10px] tracking-[0.2em] text-[#f5a623]/70 uppercase">
                Security Code
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPw ? "text" : "password"}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-[#f5a623]/20 bg-[#f5a623]/5 px-4 py-3 pr-11 text-sm text-[#f5a623] placeholder-[#f5a623]/25 transition-all outline-none focus:border-[#f5a623]/60 focus:bg-[#f5a623]/10 focus:shadow-[0_0_20px_rgba(245,166,35,0.15)]"
                  style={{ fontFamily: "'Courier New', monospace" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#f5a623]/40 transition hover:text-[#f5a623]"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {errors.password && (
                  <p className="mt-1 text-[10px] text-red-400">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-center text-xs text-red-400">
                ⚠ {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group relative mt-2 overflow-hidden rounded-lg border-2 border-[#f5a623]/60 py-3.5 text-sm font-bold tracking-[0.2em] text-[#f5a623] uppercase transition-all hover:border-[#f5a623] hover:shadow-[0_0_30px_rgba(245,166,35,0.3)] disabled:opacity-50"
              style={{ background: "rgba(245,166,35,0.08)" }}
            >
              {/* Shimmer sweep */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#f5a623]/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              <span className="relative flex items-center justify-center gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Authenticating..." : "Initialize Login"}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#f5a623]/20 to-transparent" />
            <span className="text-[9px] tracking-[0.2em] text-[#f5a623]/30 uppercase">
              Restricted Access
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#f5a623]/20 to-transparent" />
          </div>

          <p className="text-center text-[9px] tracking-widest text-[#f5a623]/20 uppercase">
            Zenix Electronics Admin Portal
          </p>
        </div>
      </div>
    </div>
  );
}
