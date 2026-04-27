"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/convex/_generated/api";
import {
  User,
  Mail,
  Phone,
  Pencil,
  Check,
  X,
  Shield,
  ShoppingBag,
  Heart,
  MapPin,
} from "lucide-react";
import Link from "next/link";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;

const inputCls =
  "w-full rounded-xl border border-[#1e2435] bg-[#111827] px-4 py-3 text-sm text-white transition outline-none placeholder:text-[#4b5563] focus:border-[#f5a623]/50 focus:ring-1 focus:ring-[#f5a623]/15";

export default function AccountPage() {
  const viewer = useQuery(api.users.viewer);
  const orders = useQuery(api.orders.getUserOrders);
  const wishlist = useQuery(api.wishlists.getWishlist);
  const updateProfile = useMutation(api.users.updateProfile);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({ resolver: zodResolver(profileSchema) });

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

  const quickStats = [
    {
      label: "Total Orders",
      value: orders?.length ?? "—",
      icon: ShoppingBag,
      href: "/account/orders",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Wishlist Items",
      value: wishlist?.length ?? "—",
      icon: Heart,
      href: "/account/wishlist",
      color: "text-pink-400",
      bg: "bg-pink-400/10",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div>
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          My Profile
        </h1>
        <p className="mt-0.5 text-sm text-[#8b92a5]">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        {quickStats.map(({ label, value, icon: Icon, href, color, bg }) => (
          <Link
            key={label}
            href={href}
            className="group flex items-center gap-3.5 rounded-2xl border border-[#1e2435] bg-[#0d1117] p-4 transition hover:border-[#f5a623]/20 hover:bg-[#111827]"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-xs text-[#8b92a5]">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Profile card */}
      <div className="overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
        {/* Card header */}
        <div className="flex items-center justify-between border-b border-[#1e2435] px-6 py-4">
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
              Edit profile
            </button>
          )}
        </div>

        {/* Avatar + name banner */}
        <div className="relative overflow-hidden border-b border-[#1e2435] px-6 py-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#f5a623]/5 to-transparent" />
          <div className="relative flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f5a623] to-[#ff9f1c] shadow-[0_0_28px_rgba(245,166,35,0.25)]">
              <span className="text-xl font-bold text-[#0a0e1a]">{initials}</span>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{viewer?.name ?? "—"}</p>
              <p className="text-sm text-[#8b92a5]">{viewer?.email ?? "—"}</p>
              <span className="mt-1 inline-block rounded-full border border-[#f5a623]/30 bg-[#f5a623]/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-widest text-[#f5a623] uppercase">
                {viewer?.role ?? "customer"}
              </span>
            </div>
          </div>
        </div>

        {/* Fields */}
        {editing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 px-6 py-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
                  Full name
                </label>
                <input {...register("name")} className={inputCls} />
                {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
                  Phone
                </label>
                <input {...register("phone")} placeholder="+254 7XX XXX XXX" className={inputCls} />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
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
    <div className="flex items-center gap-4 px-6 py-4">
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
