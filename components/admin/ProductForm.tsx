"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { Plus, Trash2, GripVertical, Upload, X } from "lucide-react";

const CATEGORIES = [
  "iphones",
  "samsung",
  "ipad",
  "mac",
  "wearables",
  "audio",
  "televisions",
  "gaming",
  "connectivity",
  "power",
  "accessories",
];

const productSchema = z.object({
  name: z.string().min(2, "Name required"),
  slug: z
    .string()
    .min(2, "Slug required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  description: z.string().min(10, "Description required"),
  category: z.string().min(1, "Category required"),
  condition: z.enum(["brand-new", "ex-uk", "ex-usa"]),
  price: z.number().min(1, "Price required"),
  compareAtPrice: z.number().min(0).optional(),
  stock: z.number().min(0, "Stock required"),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  isHotDeal: z.boolean(),
  isNewArrival: z.boolean(),
  specs: z.array(z.object({ key: z.string(), value: z.string() })),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface Props {
  defaultValues?: Partial<ProductFormValues>;
  defaultImages?: string[];
  onSubmit: (data: ProductFormValues, images: string[]) => Promise<void>;
  submitLabel: string;
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const MAX_IMAGES = 5;

const inputCls =
  "w-full rounded-xl border border-[#1e2435] bg-[#111827] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-[#4b5563] focus:border-[#f5a623]/50 focus:ring-1 focus:ring-[#f5a623]/20";

const labelCls = "text-xs font-semibold tracking-widest text-[#8b92a5] uppercase";

export function ProductForm({ defaultValues, defaultImages = [], onSubmit, submitLabel }: Props) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(defaultImages);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isActive: true,
      isFeatured: false,
      isHotDeal: false,
      isNewArrival: false,
      condition: "brand-new",
      specs: [],
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "specs" });

  // Auto-generate slug from name if no default slug
  const nameValue = watch("name");
  useEffect(() => {
    if (!defaultValues?.slug) {
      setValue("slug", slugify(nameValue ?? ""));
    }
  }, [nameValue, defaultValues?.slug, setValue]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, MAX_IMAGES - images.length);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = (await res.json()) as { storageId: string };
        // Resolve permanent URL via a dedicated helper (reuse updateAvatar pattern)
        const url = `https://${process.env.NEXT_PUBLIC_CONVEX_URL?.replace("https://", "").replace(".convex.cloud", "")}.convex.cloud/api/storage/${storageId}`;
        setImages((prev) => [...prev, storageId as Id<"_storage"> as unknown as string]);
        void url; // URL resolved server-side by updateAvatar; we store the storageId and let the admin page resolve it
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  };

  const onFormSubmit = async (data: ProductFormValues) => {
    setSaving(true);
    try {
      await onSubmit(data, images);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-7">
      {/* Images */}
      <Section title="Images">
        <div className="flex flex-wrap gap-3">
          {images.map((url, i) => (
            <div
              key={url}
              className="relative h-24 w-24 overflow-hidden rounded-xl border border-[#1e2435]"
            >
              <Image src={url} alt="" fill className="object-cover" sizes="96px" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white hover:bg-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          {images.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex h-24 w-24 flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#1e2435] text-[#8b92a5] transition hover:border-[#f5a623]/50 hover:text-[#f5a623] disabled:opacity-50"
            >
              <Upload className="h-5 w-5" />
              <span className="text-xs">
                {uploading ? "Uploading…" : `Upload (${images.length}/${MAX_IMAGES})`}
              </span>
            </button>
          )}
        </div>
      </Section>

      {/* Basic info */}
      <Section title="Basic Info">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Name" error={errors.name?.message}>
            <input {...register("name")} placeholder="iPhone 15 Pro Max" className={inputCls} />
          </Field>
          <Field label="Slug" error={errors.slug?.message}>
            <input {...register("slug")} placeholder="iphone-15-pro-max" className={inputCls} />
          </Field>
        </div>
        <Field label="Description" error={errors.description?.message}>
          <textarea
            {...register("description")}
            rows={3}
            placeholder="Product description…"
            className={`${inputCls} resize-none`}
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Category" error={errors.category?.message}>
            <select {...register("category")} className={inputCls}>
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-[#111827]">
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Condition" error={errors.condition?.message}>
            <select {...register("condition")} className={inputCls}>
              <option value="brand-new" className="bg-[#111827]">
                Brand New
              </option>
              <option value="ex-uk" className="bg-[#111827]">
                Ex UK
              </option>
              <option value="ex-usa" className="bg-[#111827]">
                Ex USA
              </option>
            </select>
          </Field>
        </div>
      </Section>

      {/* Pricing & stock */}
      <Section title="Pricing & Stock">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Price (KES)" error={errors.price?.message}>
            <input
              {...register("price", { valueAsNumber: true })}
              type="number"
              min="0"
              placeholder="45000"
              className={inputCls}
            />
          </Field>
          <Field label="Compare-at Price (KES)" error={errors.compareAtPrice?.message}>
            <input
              {...register("compareAtPrice", { valueAsNumber: true })}
              type="number"
              min="0"
              placeholder="55000"
              className={inputCls}
            />
          </Field>
          <Field label="Stock" error={errors.stock?.message}>
            <input
              {...register("stock", { valueAsNumber: true })}
              type="number"
              min="0"
              placeholder="10"
              className={inputCls}
            />
          </Field>
        </div>
      </Section>

      {/* Specs */}
      <Section title="Specifications">
        <div className="flex flex-col gap-2">
          {fields.map((field, i) => (
            <div key={field.id} className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 shrink-0 text-[#4b5563]" />
              <input
                {...register(`specs.${i}.key`)}
                placeholder="Key (e.g. Storage)"
                className={`${inputCls} flex-1`}
              />
              <input
                {...register(`specs.${i}.value`)}
                placeholder="Value (e.g. 256GB)"
                className={`${inputCls} flex-1`}
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="shrink-0 text-[#8b92a5] hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ key: "", value: "" })}
            className="flex items-center gap-1.5 self-start rounded-lg border border-dashed border-[#1e2435] px-3 py-2 text-xs font-medium text-[#8b92a5] transition hover:border-[#f5a623]/50 hover:text-[#f5a623]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add spec
          </button>
        </div>
      </Section>

      {/* Flags */}
      <Section title="Flags">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              { name: "isActive", label: "Active" },
              { name: "isFeatured", label: "Featured" },
              { name: "isHotDeal", label: "Hot Deal" },
              { name: "isNewArrival", label: "New Arrival" },
            ] as const
          ).map(({ name, label }) => (
            <label
              key={name}
              className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-[#1e2435] bg-[#111827] px-3 py-2.5"
            >
              <input {...register(name)} type="checkbox" className="h-4 w-4 accent-[#f5a623]" />
              <span className="text-sm text-[#8b92a5]">{label}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[#f5a623] px-6 py-2.5 text-sm font-bold text-[#0a0e1a] transition hover:bg-[#ff9f1c] disabled:opacity-60"
        >
          {saving ? "Saving…" : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-[#1e2435] px-6 py-2.5 text-sm text-[#8b92a5] transition hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
      <div className="border-b border-[#1e2435] px-5 py-3">
        <span className="text-sm font-semibold text-white">{title}</span>
      </div>
      <div className="flex flex-col gap-4 p-5">{children}</div>
    </div>
  );
}

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
    <div className="flex flex-col gap-1.5">
      <label className={labelCls}>{label}</label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
