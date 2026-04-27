"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/convex/_generated/api";
import { User, Mail, Phone, Pencil, Check, X } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;

export default function AccountPage() {
  const viewer = useQuery(api.users.viewer);
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

  const cancel = () => setEditing(false);

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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1
          className="text-xl font-bold text-white"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Profile
        </h1>
        <p className="mt-0.5 text-sm text-[#8b92a5]">Manage your personal information</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
        {/* Avatar row */}
        <div className="flex items-center gap-4 border-b border-[#1e2435] px-6 py-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5a623]/15">
            <User className="h-7 w-7 text-[#f5a623]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-white">{viewer?.name ?? "—"}</p>
            <p className="truncate text-sm text-[#8b92a5]">{viewer?.email ?? "—"}</p>
          </div>
          {!editing && (
            <button
              onClick={startEdit}
              className="flex items-center gap-1.5 rounded-lg border border-[#1e2435] px-3 py-1.5 text-xs font-medium text-[#8b92a5] transition hover:border-[#f5a623]/40 hover:text-white"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
          )}
        </div>

        {/* Fields */}
        {editing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 px-6 py-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
                Full name
              </label>
              <input
                {...register("name")}
                className="w-full rounded-lg border border-[#1e2435] bg-[#111827] px-3 py-2.5 text-sm text-white transition outline-none focus:border-[#f5a623]/50 focus:ring-1 focus:ring-[#f5a623]/20"
              />
              {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
                Phone
              </label>
              <input
                {...register("phone")}
                placeholder="+254 7XX XXX XXX"
                className="w-full rounded-lg border border-[#1e2435] bg-[#111827] px-3 py-2.5 text-sm text-white transition outline-none placeholder:text-[#4b5563] focus:border-[#f5a623]/50 focus:ring-1 focus:ring-[#f5a623]/20"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg bg-[#f5a623] px-4 py-2 text-sm font-semibold text-[#0a0e1a] transition hover:bg-[#ff9f1c] disabled:opacity-60"
              >
                <Check className="h-4 w-4" />
                {saving ? "Saving…" : "Save changes"}
              </button>
              <button
                type="button"
                onClick={cancel}
                className="flex items-center gap-1.5 rounded-lg border border-[#1e2435] px-4 py-2 text-sm text-[#8b92a5] transition hover:text-white"
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
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <Icon className="h-4 w-4 shrink-0 text-[#8b92a5]" />
      <span className="w-24 shrink-0 text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
        {label}
      </span>
      <span className="text-sm text-white">{value}</span>
    </div>
  );
}
