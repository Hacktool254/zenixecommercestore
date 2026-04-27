"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { User, Mail, Phone, MapPin, Shield, Camera, Check, X, Pencil } from "lucide-react";
import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";
import type { CloudinaryUploadWidgetResults, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { cloudinaryUrl } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;

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

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

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

  const handleAvatarUpload = async (result: CloudinaryUploadWidgetResults) => {
    const info = result.info as CloudinaryUploadWidgetInfo | undefined;
    if (info?.secure_url) {
      setAvatarLoading(true);
      try {
        await updateAvatar({ image: info.secure_url });
      } finally {
        setAvatarLoading(false);
      }
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
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-gradient-to-br from-[#f5a623] to-[#ff9f1c] shadow-[0_0_28px_rgba(245,166,35,0.25)]">
              {viewer?.image ? (
                <Image
                  src={cloudinaryUrl(viewer.image)}
                  alt={viewer.name ?? "avatar"}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-2xl font-bold text-[#0a0e1a]">{initials}</span>
                </div>
              )}
              {avatarLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0e1a]/60">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}
            </div>
          </div>

          {/* Upload button + hint */}
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <p className="text-sm font-medium text-white">{viewer?.name ?? "—"}</p>
            <p className="text-xs text-[#8b92a5]">
              JPG, PNG or WebP · Max 5 MB · Square images look best
            </p>
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "zenix_products"}
              options={{ maxFiles: 1, cropping: true, croppingAspectRatio: 1, folder: "avatars" }}
              onSuccess={handleAvatarUpload}
            >
              {({ open }) => (
                <button
                  onClick={() => open()}
                  disabled={avatarLoading}
                  className="flex w-fit items-center gap-2 rounded-xl border border-[#1e2435] px-4 py-2 text-sm font-semibold text-[#8b92a5] transition hover:border-[#f5a623]/40 hover:text-[#f5a623] disabled:opacity-50"
                >
                  <Camera className="h-4 w-4" />
                  {viewer?.image ? "Change photo" : "Upload photo"}
                </button>
              )}
            </CldUploadWidget>
          </div>
        </div>
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
