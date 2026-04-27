"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { MapPin, Plus, Trash2, Star, X, Check } from "lucide-react";

const addressSchema = z.object({
  name: z.string().min(2, "Name required"),
  phone: z.string().min(9, "Valid phone required"),
  street: z.string().min(3, "Street required"),
  city: z.string().min(2, "City required"),
  isDefault: z.boolean(),
});
type AddressForm = z.infer<typeof addressSchema>;

const inputCls =
  "w-full rounded-xl border border-[#1e2435] bg-[#111827] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#4b5563] focus:border-[#f5a623]/50 focus:ring-1 focus:ring-[#f5a623]/15";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default function AddressesPage() {
  const addresses = useQuery(api.addresses.getUserAddresses);
  const addAddress = useMutation(api.addresses.addAddress);
  const deleteAddress = useMutation(api.addresses.deleteAddress);
  const setDefault = useMutation(api.addresses.setDefaultAddress);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<Id<"addresses"> | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: { isDefault: false },
  });

  const onSubmit = async (data: AddressForm) => {
    setSaving(true);
    try {
      await addAddress(data);
      reset();
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: Id<"addresses">) => {
    setDeletingId(id);
    try {
      await deleteAddress({ id });
    } finally {
      setDeletingId(null);
    }
  };

  if (addresses === undefined) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#f5a623] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Addresses
          </h1>
          <p className="mt-0.5 text-sm text-[#8b92a5]">Manage your saved delivery addresses</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#f5a623] px-4 py-2.5 text-sm font-bold text-[#0a0e1a] transition hover:bg-[#ff9f1c]"
          >
            <Plus className="h-4 w-4" />
            Add address
          </button>
        )}
      </div>

      {/* Add form */}
      {showForm && (
        <div className="overflow-hidden rounded-2xl border border-[#f5a623]/30 bg-[#0d1117]">
          <div className="flex items-center justify-between border-b border-[#1e2435] px-5 py-4">
            <span className="font-semibold text-white">New delivery address</span>
            <button
              onClick={() => {
                setShowForm(false);
                reset();
              }}
              className="text-[#8b92a5] transition hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.name?.message}>
                <input {...register("name")} placeholder="John Doe" className={inputCls} />
              </Field>
              <Field label="Phone" error={errors.phone?.message}>
                <input {...register("phone")} placeholder="+254 7XX XXX XXX" className={inputCls} />
              </Field>
            </div>
            <Field label="Street / area" error={errors.street?.message}>
              <input
                {...register("street")}
                placeholder="e.g. Accra Road, Westlands"
                className={inputCls}
              />
            </Field>
            <Field label="City" error={errors.city?.message}>
              <input {...register("city")} placeholder="Nairobi" className={inputCls} />
            </Field>
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                {...register("isDefault")}
                type="checkbox"
                className="h-4 w-4 accent-[#f5a623]"
              />
              <span className="text-sm text-[#8b92a5]">Set as default delivery address</span>
            </label>
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 rounded-xl bg-[#f5a623] px-5 py-2.5 text-sm font-bold text-[#0a0e1a] transition hover:bg-[#ff9f1c] disabled:opacity-60"
              >
                <Check className="h-4 w-4" />
                {saving ? "Saving…" : "Save address"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  reset();
                }}
                className="rounded-xl border border-[#1e2435] px-5 py-2.5 text-sm font-medium text-[#8b92a5] transition hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Empty */}
      {addresses.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-[#1e2435] bg-[#0d1117] px-6 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#111827]">
            <MapPin className="h-8 w-8 text-[#4b5563]" />
          </div>
          <div>
            <p className="font-semibold text-white">No saved addresses</p>
            <p className="mt-1 text-sm text-[#8b92a5]">Add an address to speed up checkout.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#f5a623] px-6 py-2.5 text-sm font-bold text-[#0a0e1a] transition hover:bg-[#ff9f1c]"
          >
            <Plus className="h-4 w-4" />
            Add address
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`group relative overflow-hidden rounded-2xl border p-5 transition ${
                addr.isDefault
                  ? "border-[#f5a623]/35 bg-[#0d1117] shadow-[0_0_0_1px_rgba(245,166,35,0.08)]"
                  : "border-[#1e2435] bg-[#0d1117] hover:border-[#2a3347]"
              }`}
            >
              {/* Default glow top stripe */}
              {addr.isDefault && (
                <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#f5a623]/60 to-transparent" />
              )}

              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3.5">
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${addr.isDefault ? "bg-[#f5a623]/15" : "bg-[#111827]"}`}
                  >
                    <MapPin
                      className={`h-4 w-4 ${addr.isDefault ? "text-[#f5a623]" : "text-[#8b92a5]"}`}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white">{addr.name}</p>
                      {addr.isDefault && (
                        <span className="rounded-full border border-[#f5a623]/30 bg-[#f5a623]/10 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-[#f5a623] uppercase">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-[#8b92a5]">
                      {addr.street}, {addr.city}
                    </p>
                    <p className="text-sm text-[#8b92a5]">{addr.phone}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1.5">
                  {!addr.isDefault && (
                    <button
                      onClick={() => void setDefault({ id: addr._id })}
                      className="flex items-center gap-1.5 rounded-xl border border-[#1e2435] px-3 py-1.5 text-[11px] font-semibold text-[#8b92a5] transition hover:border-[#f5a623]/40 hover:text-[#f5a623]"
                    >
                      <Star className="h-3.5 w-3.5" />
                      Set default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(addr._id)}
                    disabled={deletingId === addr._id}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#1e2435] text-[#8b92a5] transition hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-400 disabled:opacity-40"
                    aria-label="Delete address"
                  >
                    {deletingId === addr._id ? (
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border border-[#8b92a5] border-t-transparent" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
