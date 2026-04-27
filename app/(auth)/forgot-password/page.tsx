"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle } from "lucide-react";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { signIn } = useAuthActions();
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      await signIn("password", { email: data.email, flow: "reset" });
      setSent(true);
    } catch {
      setServerError("Could not send reset email. Please try again.");
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <CheckCircle className="h-10 w-10 text-[#f5a623]" />
        <h1
          className="text-xl font-bold text-white"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Check your inbox
        </h1>
        <p className="text-sm text-[#8b92a5]">
          We sent a password reset link to your email address.
        </p>
        <Link href="/login" className="mt-2 text-sm font-medium text-[#f5a623] hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1
        className="mb-1 text-2xl font-bold text-white"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Reset password
      </h1>
      <p className="mb-6 text-sm text-[#8b92a5]">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="forgot-email" className="mb-1.5 block text-xs font-medium text-[#8b92a5]">
            Email
          </label>
          <input
            id="forgot-email"
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-[#1e2435] bg-[#0a0e1a] px-4 py-2.5 text-sm text-white placeholder-[#8b92a5] transition outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]"
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
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
          Send reset link
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-[#8b92a5]">
        Remembered your password?{" "}
        <Link href="/login" className="font-medium text-[#f5a623] hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
