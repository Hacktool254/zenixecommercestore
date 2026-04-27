"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Suspense } from "react";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

function LoginForm() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/account";

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      await signIn("password", { email: data.email, password: data.password, flow: "signIn" });
      router.push(redirect);
    } catch {
      setServerError("Invalid email or password. Please try again.");
    }
  };

  return (
    <>
      <h1
        className="mb-1 text-2xl font-bold text-white"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Sign in
      </h1>
      <p className="mb-6 text-sm text-[#8b92a5]">Welcome back to Zenix Electronics</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="login-email" className="mb-1.5 block text-xs font-medium text-[#8b92a5]">
            Email
          </label>
          <input
            id="login-email"
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-[#1e2435] bg-[#0a0e1a] px-4 py-2.5 text-sm text-white placeholder-[#8b92a5] transition outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]"
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="mb-1.5 block text-xs font-medium text-[#8b92a5]"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              {...register("password")}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-[#1e2435] bg-[#0a0e1a] px-4 py-2.5 text-sm text-white placeholder-[#8b92a5] transition outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-[#8b92a5] hover:text-white"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs text-[#8b92a5] transition hover:text-[#f5a623]"
          >
            Forgot password?
          </Link>
        </div>

        {serverError && (
          <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-xs text-red-400">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f5a623] py-2.5 text-sm font-bold text-[#0a0e1a] transition hover:bg-[#ff9f1c] hover:shadow-[0_0_20px_rgba(245,166,35,0.35)] disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Sign in
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-[#8b92a5]">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-[#f5a623] hover:underline">
          Create one
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
