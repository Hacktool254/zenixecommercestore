"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const schema = z
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

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
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
    <>
      <h1
        className="mb-1 text-2xl font-bold text-white"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Create account
      </h1>
      <p className="mb-6 text-sm text-[#8b92a5]">Join Zenix Electronics today</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#8b92a5]">Full name</label>
          <input
            {...register("name")}
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            className="w-full rounded-xl border border-[#1e2435] bg-[#0a0e1a] px-4 py-2.5 text-sm text-white placeholder-[#8b92a5] transition outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]"
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#8b92a5]">Email</label>
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-[#1e2435] bg-[#0a0e1a] px-4 py-2.5 text-sm text-white placeholder-[#8b92a5] transition outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]"
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#8b92a5]">Password</label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Min. 8 characters"
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

        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#8b92a5]">
            Confirm password
          </label>
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-[#1e2435] bg-[#0a0e1a] px-4 py-2.5 text-sm text-white placeholder-[#8b92a5] transition outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-[#8b92a5] hover:text-white"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>
          )}
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
          Create account
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-[#8b92a5]">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-[#f5a623] hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
