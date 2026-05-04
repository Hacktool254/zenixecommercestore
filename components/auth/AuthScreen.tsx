"use client";

import { useState, Suspense, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";

// ── Schemas ──────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type LoginData = z.infer<typeof loginSchema>;

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type RegisterData = z.infer<typeof registerSchema>;

// ── Input ─────────────────────────────────────────────────────────────────────

function Input({
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <div className="w-full">
      <input
        {...props}
        className="w-full rounded-xl border border-[#1e2435] bg-[#0a0e1a] px-4 py-3 text-sm text-white placeholder-[#4a5168] transition outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]"
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function PasswordInput({
  error,
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string; label?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="w-full">
      <div className="relative">
        <input
          {...props}
          type={show ? "text" : "password"}
          className="w-full rounded-xl border border-[#1e2435] bg-[#0a0e1a] px-4 py-3 pr-10 text-sm text-white placeholder-[#4a5168] transition outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-[#4a5168] transition hover:text-white"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ── Login Form ────────────────────────────────────────────────────────────────

function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/account";
  const [serverError, setServerError] = useState<string | null>(null);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const viewer = useQuery(api.users.viewer);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (!justLoggedIn || viewer === undefined) return;
    if (viewer?.role === "admin") {
      router.replace("/admin");
    } else {
      router.push(redirect);
    }
  }, [justLoggedIn, viewer, router, redirect]);

  const onSubmit = async (data: LoginData) => {
    setServerError(null);
    try {
      await signIn("password", { email: data.email, password: data.password, flow: "signIn" });
      setJustLoggedIn(true);
    } catch {
      setServerError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center px-10 text-center">
      <h1
        className="text-2xl font-bold text-white"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Sign In
      </h1>
      <p className="mt-1 mb-6 text-xs text-[#4a5168]">Welcome back to Zenix Electronics</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col items-center gap-3">
        <Input
          {...register("email")}
          type="email"
          autoComplete="email"
          placeholder="Email address"
          error={errors.email?.message}
        />
        <PasswordInput
          {...register("password")}
          autoComplete="current-password"
          placeholder="Password"
          error={errors.password?.message}
        />

        <div className="flex w-full justify-end">
          <Link
            href="/forgot-password"
            className="text-xs text-[#4a5168] transition hover:text-[#f5a623]"
          >
            Forgot your password?
          </Link>
        </div>

        {serverError && (
          <p className="w-full rounded-lg bg-red-500/10 px-4 py-2 text-xs text-red-400">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-[#f5a623] py-3 text-xs font-bold tracking-widest text-[#0a0e1a] uppercase transition hover:bg-[#ff9f1c] hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Sign In
        </button>
      </form>

      {/* Mobile-only switch */}
      <div className="mt-6 block lg:hidden">
        <p className="text-xs text-[#4a5168]">Don&apos;t have an account?</p>
        <button
          onClick={onSwitch}
          className="mt-2 rounded-full border-2 border-[#f5a623] bg-transparent px-6 py-2 text-xs font-bold tracking-widest text-[#f5a623] uppercase transition hover:bg-[#f5a623] hover:text-[#0a0e1a]"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

// ── Register Form ─────────────────────────────────────────────────────────────

function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterData) => {
    setServerError(null);
    try {
      await signIn("password", {
        name: data.name,
        email: data.email,
        password: data.password,
        flow: "signUp",
      });
      router.push("/account");
    } catch {
      setServerError("Could not create account. That email may already be in use.");
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center px-10 text-center">
      <h1
        className="text-2xl font-bold text-white"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Create Account
      </h1>
      <p className="mt-1 mb-6 text-xs text-[#4a5168]">Join Zenix Electronics today</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col items-center gap-3">
        <Input
          {...register("name")}
          type="text"
          autoComplete="name"
          placeholder="Full name"
          error={errors.name?.message}
        />
        <Input
          {...register("email")}
          type="email"
          autoComplete="email"
          placeholder="Email address"
          error={errors.email?.message}
        />
        <PasswordInput
          {...register("password")}
          autoComplete="new-password"
          placeholder="Password (min. 8 characters)"
          error={errors.password?.message}
        />
        <PasswordInput
          {...register("confirmPassword")}
          autoComplete="new-password"
          placeholder="Confirm password"
          error={errors.confirmPassword?.message}
        />

        {serverError && (
          <p className="w-full rounded-lg bg-red-500/10 px-4 py-2 text-xs text-red-400">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-[#f5a623] py-3 text-xs font-bold tracking-widest text-[#0a0e1a] uppercase transition hover:bg-[#ff9f1c] hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Sign Up
        </button>
      </form>

      {/* Mobile-only switch */}
      <div className="mt-6 block lg:hidden">
        <p className="text-xs text-[#4a5168]">Already have an account?</p>
        <button
          onClick={onSwitch}
          className="mt-2 rounded-full border-2 border-[#f5a623] bg-transparent px-6 py-2 text-xs font-bold tracking-widest text-[#f5a623] uppercase transition hover:bg-[#f5a623] hover:text-[#0a0e1a]"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

function AuthScreenInner({ initialMode }: { initialMode: "login" | "register" }) {
  const [panelActive, setPanelActive] = useState(initialMode === "register");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0e1a] px-4 py-8">
      {/* Logo */}
      <Link href="/" className="mb-6">
        <Image
          src="/logo.png"
          alt="Zenix Electronics"
          width={44}
          height={44}
          className="h-11 w-11 rounded-full object-cover"
          priority
        />
      </Link>

      {/*
        auth-wrapper — 850px wide, 560px tall on desktop.
        Two form halves + sliding panel, exactly like the reference.
      */}
      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        style={{
          maxWidth: 850,
          minHeight: 560,
          background: "#0d1117",
          border: "1px solid #1e2435",
        }}
      >
        {/* ── Login form half ── */}
        <div
          className="absolute top-0 left-0 hidden h-full w-1/2 lg:block"
          style={{
            zIndex: panelActive ? 1 : 2,
            opacity: panelActive ? 0 : 1,
            transform: panelActive ? "translateX(100%)" : "translateX(0)",
            transition: "all 0.6s ease-in-out",
            animation: panelActive ? undefined : "auth-show 0.6s",
          }}
        >
          <Suspense>
            <LoginForm onSwitch={() => setPanelActive(true)} />
          </Suspense>
        </div>

        {/* ── Register form half ── */}
        <div
          className="absolute top-0 left-0 hidden h-full w-1/2 lg:block"
          style={{
            zIndex: panelActive ? 5 : 1,
            opacity: panelActive ? 1 : 0,
            transform: panelActive ? "translateX(100%)" : "translateX(0)",
            transition: "all 0.6s ease-in-out",
            animation: panelActive ? "auth-show 0.6s" : undefined,
          }}
        >
          <RegisterForm onSwitch={() => setPanelActive(false)} />
        </div>

        {/* ── Mobile: show whichever form is active ── */}
        <div className="block lg:hidden">
          {!panelActive ? (
            <Suspense>
              <LoginForm onSwitch={() => setPanelActive(true)} />
            </Suspense>
          ) : (
            <RegisterForm onSwitch={() => setPanelActive(false)} />
          )}
        </div>

        {/* ── Sliding panel (desktop only) ── */}
        <div
          className="absolute top-0 hidden h-full w-1/2 overflow-hidden lg:block"
          style={{
            left: "50%",
            zIndex: 100,
            transform: panelActive ? "translateX(-100%)" : "translateX(0)",
            transition: "transform 0.6s ease-in-out",
          }}
        >
          {/* The inner panel is 200% wide so both content halves sit side by side */}
          <div
            className="relative h-full"
            style={{
              width: "200%",
              left: "-100%",
              transform: panelActive ? "translateX(50%)" : "translateX(0)",
              transition: "transform 0.6s ease-in-out",
              background: "linear-gradient(135deg, #f5a623 0%, #e8890a 40%, #c46e00 100%)",
            }}
          >
            {/* Left content — "Welcome Back!" shown when register is active */}
            <div
              className="absolute flex h-full w-1/2 flex-col items-center justify-center px-12 text-center"
              style={{
                transform: panelActive ? "translateX(0)" : "translateX(-20%)",
                transition: "transform 0.6s ease-in-out",
              }}
            >
              <h1
                className="text-3xl font-bold text-[#0a0e1a]"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Welcome Back!
              </h1>
              <p className="mt-4 mb-8 text-sm leading-relaxed font-light text-[#0a0e1a]/80">
                Stay connected by logging in with your credentials and continue your experience
              </p>
              <button
                onClick={() => setPanelActive(false)}
                className="rounded-full border-2 border-[#0a0e1a] bg-transparent px-10 py-3 text-xs font-bold tracking-widest text-[#0a0e1a] uppercase transition hover:bg-[#0a0e1a] hover:text-[#f5a623]"
              >
                Sign In
              </button>
            </div>

            {/* Right content — "Hey There!" shown when login is active */}
            <div
              className="absolute right-0 flex h-full w-1/2 flex-col items-center justify-center px-12 text-center"
              style={{
                transform: panelActive ? "translateX(20%)" : "translateX(0)",
                transition: "transform 0.6s ease-in-out",
              }}
            >
              <h1
                className="text-3xl font-bold text-[#0a0e1a]"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Hey There!
              </h1>
              <p className="mt-4 mb-8 text-sm leading-relaxed font-light text-[#0a0e1a]/80">
                Begin your amazing journey by creating an account with us today
              </p>
              <button
                onClick={() => setPanelActive(true)}
                className="rounded-full border-2 border-[#0a0e1a] bg-transparent px-10 py-3 text-xs font-bold tracking-widest text-[#0a0e1a] uppercase transition hover:bg-[#0a0e1a] hover:text-[#f5a623]"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes auth-show {
          0%, 49.99% { opacity: 0; z-index: 1; }
          50%, 100%  { opacity: 1; z-index: 5; }
        }
      `}</style>
    </div>
  );
}

export function AuthScreen({ initialMode }: { initialMode: "login" | "register" }) {
  return (
    <Suspense>
      <AuthScreenInner initialMode={initialMode} />
    </Suspense>
  );
}
