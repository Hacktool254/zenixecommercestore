"use client";

import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { ProductForm } from "@/components/admin/ProductForm";
import type { ProductFormValues } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  const createProduct = useMutation(api.products.createProduct);
  const router = useRouter();

  const handleSubmit = async (data: ProductFormValues, images: string[]) => {
    const specs = data.specs.length
      ? Object.fromEntries(data.specs.filter((s) => s.key).map((s) => [s.key, s.value]))
      : undefined;

    await createProduct({
      name: data.name,
      slug: data.slug,
      description: data.description,
      category: data.category,
      condition: data.condition,
      price: data.price,
      compareAtPrice: data.compareAtPrice || undefined,
      images,
      specs,
      stock: data.stock,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      isHotDeal: data.isHotDeal,
      isNewArrival: data.isNewArrival,
    });

    router.push("/admin/products");
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div>
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Add Product
        </h1>
        <p className="mt-0.5 text-sm text-[#8b92a5]">Create a new product listing</p>
      </div>
      <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" />
    </div>
  );
}
