import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.union(v.literal("customer"), v.literal("admin")),
    image: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  })
    .index("email", ["email"])
    .index("role", ["role"]),

  products: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    category: v.string(),
    brand: v.optional(v.string()),
    condition: v.union(v.literal("brand-new"), v.literal("ex-uk"), v.literal("ex-usa")),
    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    images: v.array(v.string()),
    specs: v.optional(v.record(v.string(), v.string())),
    stock: v.number(),
    isActive: v.boolean(),
    isFeatured: v.boolean(),
    isHotDeal: v.boolean(),
    isNewArrival: v.boolean(),
    displayOrder: v.optional(v.number()),
    variants: v.optional(
      v.array(
        v.object({
          storage: v.string(),
          simType: v.optional(
            v.union(
              v.literal("physical-sim"),
              v.literal("esim"),
              v.literal("wifi"),
              v.literal("wifi-5g")
            )
          ),
          color: v.optional(v.string()),
          price: v.number(),
          stock: v.number(),
        })
      )
    ),
  })
    .index("slug", ["slug"])
    .index("category", ["category"])
    .index("brand", ["brand"])
    .index("condition", ["condition"])
    .index("isActive", ["isActive"])
    .index("isHotDeal", ["isHotDeal"])
    .index("isNewArrival", ["isNewArrival"]),

  orders: defineTable({
    userId: v.id("users"),
    orderNumber: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    items: v.array(
      v.object({
        productId: v.id("products"),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
        image: v.string(),
        condition: v.string(),
      })
    ),
    subtotal: v.number(),
    deliveryFee: v.number(),
    total: v.number(),
    address: v.object({
      name: v.string(),
      phone: v.string(),
      street: v.string(),
      city: v.string(),
      notes: v.optional(v.string()),
    }),
    paymentMethod: v.union(v.literal("mpesa"), v.literal("card")),
    paymentStatus: v.union(v.literal("pending"), v.literal("paid"), v.literal("failed")),
    paystackReference: v.optional(v.string()),
  })
    .index("userId", ["userId"])
    .index("orderNumber", ["orderNumber"])
    .index("status", ["status"])
    .index("paymentStatus", ["paymentStatus"]),

  cartItems: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    quantity: v.number(),
  })
    .index("userId", ["userId"])
    .index("userId_productId", ["userId", "productId"]),

  wishlists: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
  })
    .index("userId", ["userId"])
    .index("userId_productId", ["userId", "productId"]),

  addresses: defineTable({
    userId: v.id("users"),
    name: v.string(),
    phone: v.string(),
    street: v.string(),
    city: v.string(),
    isDefault: v.boolean(),
  }).index("userId", ["userId"]),
});
