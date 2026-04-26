import type { Id } from "@/convex/_generated/dataModel";

export type ProductCondition = "brand-new" | "ex-uk";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed";

export type UserRole = "customer" | "admin";

export interface Product {
  _id: Id<"products">;
  name: string;
  slug: string;
  description: string;
  category: string;
  condition: ProductCondition;
  price: number;
  compareAtPrice?: number;
  images: string[];
  specs?: Record<string, string>;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isHotDeal: boolean;
  isNewArrival: boolean;
}

export interface CartItem {
  productId: Id<"products">;
  name: string;
  price: number;
  quantity: number;
  image: string;
  condition: string;
  stock: number;
}

export interface Address {
  name: string;
  phone: string;
  street: string;
  city: string;
  notes?: string;
}
