"use client";

import { useRef, useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { User, Mail, Shield, Camera, Check, X, Pencil, KeyRound, Eye, EyeOff } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});
type ProfileForm = z.infer<typeof profileSchema>;

const emailSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});
type EmailForm = z.infer<typeof emailSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type PasswordForm = z.infer<typeof passwordSchema>;

const inputCls =
  "w-full rounded-xl border border-[#f5a623]/10 bg-[#0d1320] px-4 py-3 text-sm text-white transition outline-none placeholder:text-[#4b5563] focus:border-[#f5a623]/50 focus:ring-1 focus:ring-[#f5a623]/15";

export default function AdminSettingsPage() {
  const viewer = useQuery(api.users.viewer);
  const updateProfile = useMutation(api.users.updateProfile);
  const updateEmail = useMutation(api.users.updateEmail);
  const updateAvatar = useMutation(api.users.updateAvatar);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const changePassword = useAction(api.users.changePassword);

  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [editingEmail, setEditingEmail] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState(false);

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pwChanging, setPwChanging] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({ resolver: zodResolver(profileSchema) });

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    reset: resetEmail,
    formState: { errors: emailErrors },
  } = useForm<EmailForm>({ resolver: zodResolver(emailSchema) });

  const {
    register: registerPw,
    handleSubmit: handleSubmitPw,
    reset: resetPw,
    formState: { errors: pwErrors },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  const startEditProfile = () => {
    reset({ name: viewer?.name ?? "" });
    setEditingProfile(true);
  };

  const onProfileSubmit = async (data: ProfileForm) => {
    setSavingProfile(true);
    try {
      await updateProfile(data);
      setEditingProfile(false);
    } finally {
      setSavingProfile(false);
    }
  };

  const startEditEmail = () => {
    resetEmail({ email: viewer?.email ?? "" });
    setEmailError("");
    setEmailSuccess(false);
    setEditingEmail(true);
  };

  const onEmailSubmit = async (data: EmailForm) => {
    setEmailError("");
    setEmailSuccess(false);
    setSavingEmail(true);
    try {
      await updateEmail({ email: data.email });
      setEmailSuccess(true);
      setEditingEmail(false);
    } catch (err: unknown) {
      setEmailError(err instanceof Error ? err.message : "Failed to update email");
    } finally {
      setSavingEmail(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    setPwError("");
    setPwSuccess(false);
    setPwChanging(true);
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setPwSuccess(true);
      resetPw();
    } catch (err: unknown) {
      setPwError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setPwChanging(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    setAvatarLoading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = (await res.json()) as { storageId: string };
      await updateAvatar({ storageId: storageId as Id<"_storage"> });
    } catch {
      setPreviewUrl(null);
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (viewer === undefined) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#f5a623] border-t-transparent" />
      </div>
    );
  }

  const initials = viewer?.name
    ? viewer.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "A";

  const displayImage = previewUrl ?? viewer?.image ?? null;

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Settings
        </h1>
        <p className="mt-0.5 text-sm text-[#8b92a5]">Manage your admin profile and security</p>
      </div>

      {/* Avatar card */}
      <div className="overflow-hidden rounded-2xl border border-[#f5a623]/10 bg-[#080c16]">
        <div className="border-b border-[#f5a623]/10 px-5 py-4">
          <span className="text-sm font-semibold text-white">Profile Photo</span>
        </div>
        <div className="flex flex-col items-center gap-4 px-5 py-6 sm:flex-row sm:gap-6">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarLoading}
            className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#f5a623] to-[#ff9f1c] shadow-[0_0_28px_rgba(245,166,35,0.25)] focus:outline-none"
            aria-label="Change profile photo"
          >
            {displayImage ? (
              <Image
                src={displayImage}
                alt={viewer?.name ?? "avatar"}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-2xl font-bold text-[#0a0e1a]">{initials}</span>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0e1a]/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-6 w-6 text-white" />
            </div>
            {avatarLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0a0e1a]/60">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex flex-col gap-2 text-center sm:text-left">
            <p className="text-sm font-semibold text-white">{viewer?.name ?? "—"}</p>
            <p className="text-xs text-[#8b92a5]">JPG, PNG or WebP · Max 5 MB</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarLoading}
              className="flex w-fit items-center gap-2 rounded-xl border border-[#f5a623]/20 px-4 py-2 text-sm font-semibold text-[#8b92a5] transition hover:border-[#f5a623]/50 hover:text-[#f5a623] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Camera className="h-4 w-4" />
              {avatarLoading ? "Uploading…" : viewer?.image ? "Change photo" : "Upload photo"}
            </button>
          </div>
        </div>
      </div>

      {/* Name card */}
      <div className="overflow-hidden rounded-2xl border border-[#f5a623]/10 bg-[#080c16]">
        <div className="flex items-center justify-between border-b border-[#f5a623]/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-[#8b92a5]" />
            <span className="text-sm font-semibold text-white">Display Name</span>
          </div>
          {!editingProfile && (
            <button
              onClick={startEditProfile}
              className="flex items-center gap-1.5 rounded-lg border border-[#f5a623]/10 px-3 py-1.5 text-xs font-semibold text-[#8b92a5] transition hover:border-[#f5a623]/40 hover:text-[#f5a623]"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </button>
          )}
        </div>

        {editingProfile ? (
          <form onSubmit={handleSubmit(onProfileSubmit)} className="flex flex-col gap-4 px-5 py-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase"
              >
                Full name
              </label>
              <input id="name" {...register("name")} className={inputCls} />
              {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center gap-1.5 rounded-xl bg-[#f5a623] px-5 py-2.5 text-sm font-bold text-[#0a0e1a] transition hover:bg-[#ff9f1c] disabled:opacity-60"
              >
                <Check className="h-4 w-4" />
                {savingProfile ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setEditingProfile(false)}
                className="flex items-center gap-1.5 rounded-xl border border-[#f5a623]/10 px-5 py-2.5 text-sm font-medium text-[#8b92a5] transition hover:text-white"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="px-5 py-4">
            <p className="text-sm text-white">{viewer?.name ?? "—"}</p>
          </div>
        )}
      </div>

      {/* Email card */}
      <div className="overflow-hidden rounded-2xl border border-[#f5a623]/10 bg-[#080c16]">
        <div className="flex items-center justify-between border-b border-[#f5a623]/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-[#8b92a5]" />
            <span className="text-sm font-semibold text-white">Email Address</span>
          </div>
          {!editingEmail && (
            <button
              onClick={startEditEmail}
              className="flex items-center gap-1.5 rounded-lg border border-[#f5a623]/10 px-3 py-1.5 text-xs font-semibold text-[#8b92a5] transition hover:border-[#f5a623]/40 hover:text-[#f5a623]"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </button>
          )}
        </div>

        {editingEmail ? (
          <form
            onSubmit={handleSubmitEmail(onEmailSubmit)}
            className="flex flex-col gap-4 px-5 py-5"
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase"
              >
                New Email
              </label>
              <input id="email" type="email" {...registerEmail("email")} className={inputCls} />
              {emailErrors.email && (
                <p className="text-xs text-red-400">{emailErrors.email.message}</p>
              )}
              {emailError && <p className="text-xs text-red-400">{emailError}</p>}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={savingEmail}
                className="flex items-center gap-1.5 rounded-xl bg-[#f5a623] px-5 py-2.5 text-sm font-bold text-[#0a0e1a] transition hover:bg-[#ff9f1c] disabled:opacity-60"
              >
                <Check className="h-4 w-4" />
                {savingEmail ? "Saving…" : "Update Email"}
              </button>
              <button
                type="button"
                onClick={() => setEditingEmail(false)}
                className="flex items-center gap-1.5 rounded-xl border border-[#f5a623]/10 px-5 py-2.5 text-sm font-medium text-[#8b92a5] transition hover:text-white"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="px-5 py-4">
            <p className="text-sm text-white">{viewer?.email ?? "—"}</p>
            {emailSuccess && (
              <p className="mt-2 text-xs text-green-400">Email updated successfully.</p>
            )}
          </div>
        )}
      </div>

      {/* Password card */}
      <div className="overflow-hidden rounded-2xl border border-[#f5a623]/10 bg-[#080c16]">
        <div className="flex items-center gap-2 border-b border-[#f5a623]/10 px-5 py-4">
          <KeyRound className="h-4 w-4 text-[#8b92a5]" />
          <span className="text-sm font-semibold text-white">Change Password</span>
        </div>
        <form onSubmit={handleSubmitPw(onPasswordSubmit)} className="flex flex-col gap-4 px-5 py-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
              Current Password
            </label>
            <div className="relative">
              <input
                {...registerPw("currentPassword")}
                type={showCurrent ? "text" : "password"}
                placeholder="Enter current password"
                className={inputCls + " pr-11"}
              />
              <button
                type="button"
                onClick={() => setShowCurrent((s) => !s)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-[#4b5563] hover:text-[#8b92a5]"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {pwErrors.currentPassword && (
              <p className="text-xs text-red-400">{pwErrors.currentPassword.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
                New Password
              </label>
              <div className="relative">
                <input
                  {...registerPw("newPassword")}
                  type={showNew ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  className={inputCls + " pr-11"}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((s) => !s)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#4b5563] hover:text-[#8b92a5]"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {pwErrors.newPassword && (
                <p className="text-xs text-red-400">{pwErrors.newPassword.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  {...registerPw("confirmPassword")}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat new password"
                  className={inputCls + " pr-11"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#4b5563] hover:text-[#8b92a5]"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {pwErrors.confirmPassword && (
                <p className="text-xs text-red-400">{pwErrors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {pwError && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              {pwError}
            </p>
          )}
          {pwSuccess && (
            <p className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-2.5 text-sm text-green-400">
              Password changed successfully.
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={pwChanging}
              className="flex items-center gap-1.5 rounded-xl bg-[#f5a623] px-5 py-2.5 text-sm font-bold text-[#0a0e1a] transition hover:bg-[#ff9f1c] disabled:opacity-60"
            >
              <KeyRound className="h-4 w-4" />
              {pwChanging ? "Updating…" : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* Role badge */}
      <div className="overflow-hidden rounded-2xl border border-[#f5a623]/10 bg-[#080c16]">
        <div className="flex items-center gap-2 border-b border-[#f5a623]/10 px-5 py-4">
          <Shield className="h-4 w-4 text-[#8b92a5]" />
          <span className="text-sm font-semibold text-white">Role & Permissions</span>
        </div>
        <div className="px-5 py-4">
          <span className="inline-flex items-center rounded-full border border-[#f5a623]/30 bg-[#f5a623]/10 px-3 py-1 text-xs font-semibold tracking-widest text-[#f5a623] uppercase">
            {viewer?.role ?? "admin"}
          </span>
          <p className="mt-2 text-xs text-[#8b92a5]">Full access to all admin features</p>
        </div>
      </div>
    </div>
  );
}
