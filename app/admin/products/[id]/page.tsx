"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { ProductForm } from "@/components/admin/ProductForm";
import type { ProductFormValues } from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params["id"] as Id<"products">;

  const product = useQuery(api.products.getProductById, { id });
  const updateProduct = useMutation(api.products.updateProduct);

  if (product === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center py-32">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#f5a623] border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-1 items-center justify-center py-32">
        <p className="text-[#8b92a5]">Product not found.</p>
      </div>
    );
  }

  const defaultValues: Partial<ProductFormValues> = {
    name: product.name,
    slug: product.slug,
    description: product.description,
    category: product.category,
    condition: product.condition,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    stock: product.stock,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    isHotDeal: product.isHotDeal,
    isNewArrival: product.isNewArrival,
    specs: product.specs
      ? Object.entries(product.specs).map(([key, value]) => ({ key, value }))
      : [],
  };

  const handleSubmit = async (data: ProductFormValues, images: string[]) => {
    const specs = data.specs.length
      ? Object.fromEntries(data.specs.filter((s) => s.key).map((s) => [s.key, s.value]))
      : undefined;

    await updateProduct({
      id,
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
          Edit Product
        </h1>
        <p className="mt-0.5 truncate text-sm text-[#8b92a5]">{product.name}</p>
      </div>
      <ProductForm
        defaultValues={defaultValues}
        defaultImages={product.images}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
}
