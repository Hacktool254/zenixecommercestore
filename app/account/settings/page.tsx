"use client";

import { useRef, useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Camera,
  Check,
  X,
  Pencil,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;

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
  "w-full rounded-xl border border-[#1e2435] bg-[#111827] px-4 py-3 text-sm text-white transition outline-none placeholder:text-[#4b5563] focus:border-[#f5a623]/50 focus:ring-1 focus:ring-[#f5a623]/15";

function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#111827]">
        <Icon className="h-4 w-4 text-[#8b92a5]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">{label}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-white">{value}</p>
      </div>
      {href && <span className="text-xs text-[#f5a623]">→</span>}
    </div>
  );
  if (href)
    return (
      <Link href={href} className="block transition hover:bg-[#111827]">
        {inner}
      </Link>
    );
  return <div>{inner}</div>;
}

export default function SettingsPage() {
  const viewer = useQuery(api.users.viewer);
  const updateProfile = useMutation(api.users.updateProfile);
  const updateAvatar = useMutation(api.users.updateAvatar);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const changePassword = useAction(api.users.changePassword);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
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
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  const {
    register: registerPw,
    handleSubmit: handleSubmitPw,
    reset: resetPw,
    formState: { errors: pwErrors },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

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

  const startEdit = () => {
    reset({ name: viewer?.name ?? "", phone: viewer?.phone ?? "" });
    setEditing(true);
  };

  const onSubmit = async (data: ProfileForm) => {
    setSaving(true);
    try {
      await updateProfile(data);
      setEditing(false);
    } finally {
      setSaving(false);
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
    : "U";

  const displayImage = previewUrl ?? viewer?.image ?? null;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Settings
        </h1>
        <p className="mt-0.5 text-sm text-[#8b92a5]">Manage your profile and account preferences</p>
      </div>

      {/* Avatar card */}
      <div className="overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
        <div className="border-b border-[#1e2435] px-5 py-4">
          <span className="text-sm font-semibold text-white">Profile Photo</span>
        </div>
        <div className="flex flex-col items-center gap-4 px-5 py-6 sm:flex-row sm:gap-6">
          {/* Avatar — clicking it opens the file picker */}
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
            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0e1a]/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-6 w-6 text-white" />
            </div>
            {/* Upload spinner */}
            {avatarLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0a0e1a]/60">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            )}
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Text + button */}
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <p className="text-sm font-semibold text-white">{viewer?.name ?? "—"}</p>
            <p className="text-xs text-[#8b92a5]">JPG, PNG or WebP · Max 5 MB</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarLoading}
              className="flex w-fit items-center gap-2 rounded-xl border border-[#1e2435] px-4 py-2 text-sm font-semibold text-[#8b92a5] transition hover:border-[#f5a623]/40 hover:text-[#f5a623] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Camera className="h-4 w-4" />
              {avatarLoading ? "Uploading…" : viewer?.image ? "Change photo" : "Upload photo"}
            </button>
          </div>
        </div>
      </div>

      {/* Change password card */}
      <div className="overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
        <div className="flex items-center gap-2 border-b border-[#1e2435] px-5 py-4">
          <KeyRound className="h-4 w-4 text-[#8b92a5]" />
          <span className="text-sm font-semibold text-white">Change Password</span>
        </div>
        <form onSubmit={handleSubmitPw(onPasswordSubmit)} className="flex flex-col gap-4 px-5 py-5">
          {/* Current password */}
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

          {/* New password */}
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
                Confirm New Password
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

      {/* Profile card */}
      <div className="overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
        <div className="flex items-center justify-between border-b border-[#1e2435] px-5 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#8b92a5]" />
            <span className="text-sm font-semibold text-white">Account Information</span>
          </div>
          {!editing && (
            <button
              onClick={startEdit}
              className="flex items-center gap-1.5 rounded-lg border border-[#1e2435] px-3 py-1.5 text-xs font-semibold text-[#8b92a5] transition hover:border-[#f5a623]/40 hover:text-[#f5a623]"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 px-5 py-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="phone"
                  className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  {...register("phone")}
                  placeholder="+254 7XX XXX XXX"
                  className={inputCls}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 rounded-xl bg-[#f5a623] px-5 py-2.5 text-sm font-bold text-[#0a0e1a] transition hover:bg-[#ff9f1c] disabled:opacity-60"
              >
                <Check className="h-4 w-4" />
                {saving ? "Saving…" : "Save changes"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 rounded-xl border border-[#1e2435] px-5 py-2.5 text-sm font-medium text-[#8b92a5] transition hover:text-white"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="divide-y divide-[#1e2435]">
            <InfoRow icon={User} label="Full name" value={viewer?.name ?? "—"} />
            <InfoRow icon={Mail} label="Email" value={viewer?.email ?? "—"} />
            <InfoRow icon={Phone} label="Phone" value={viewer?.phone ?? "Not set"} />
            <InfoRow
              icon={MapPin}
              label="Addresses"
              value="Manage saved addresses"
              href="/account/addresses"
            />
          </div>
        )}
      </div>
    </div>
  );
}
