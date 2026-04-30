import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getAllProducts = query({
  args: {
    category: v.optional(v.string()),
    condition: v.optional(v.union(v.literal("brand-new"), v.literal("ex-uk"), v.literal("ex-usa"))),
    brand: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    inStockOnly: v.optional(v.boolean()),
    sortBy: v.optional(
      v.union(
        v.literal("featured"),
        v.literal("newest"),
        v.literal("price-asc"),
        v.literal("price-desc")
      )
    ),
  },
  handler: async (ctx, args) => {
    let products = await ctx.db
      .query("products")
      .withIndex("isActive", (q) => q.eq("isActive", true))
      .collect();

    if (args.category) {
      products = products.filter((p) => p.category === args.category);
    }
    if (args.condition) {
      products = products.filter((p) => p.condition === args.condition);
    }
    if (args.brand) {
      products = products.filter((p) => p.brand === args.brand);
    }
    if (args.minPrice !== undefined) {
      products = products.filter((p) => p.price >= args.minPrice!);
    }
    if (args.maxPrice !== undefined) {
      products = products.filter((p) => p.price <= args.maxPrice!);
    }
    if (args.inStockOnly) {
      products = products.filter((p) => p.stock > 0);
    }

    if (args.sortBy === "price-asc") {
      products.sort((a, b) => a.price - b.price);
    } else if (args.sortBy === "price-desc") {
      products.sort((a, b) => b.price - a.price);
    } else if (args.sortBy === "newest") {
      products.sort((a, b) => b._creationTime - a._creationTime);
    } else {
      // "featured" or default — use displayOrder
      products.sort((a, b) => {
        const ao = a.displayOrder ?? 9999;
        const bo = b.displayOrder ?? 9999;
        if (ao !== bo) return ao - bo;
        return b._creationTime - a._creationTime;
      });
    }

    return products;
  },
});

export const getProductBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getProductById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getFeaturedProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .withIndex("isActive", (q) => q.eq("isActive", true))
      .filter((q) => q.eq(q.field("isFeatured"), true))
      .take(8);
  },
});

export const getHotDeals = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .withIndex("isHotDeal", (q) => q.eq("isHotDeal", true))
      .filter((q) => q.eq(q.field("isActive"), true))
      .take(8);
  },
});

export const getDealsProducts = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .withIndex("isActive", (q) => q.eq("isActive", true))
      .collect();

    // ex-uk, ex-usa, hot deals — macbooks, samsung, apple, general deals
    const deals = products.filter(
      (p) => p.condition === "ex-uk" || p.condition === "ex-usa" || p.isHotDeal
    );

    deals.sort((a, b) => {
      // hot deals first
      if (a.isHotDeal && !b.isHotDeal) return -1;
      if (!a.isHotDeal && b.isHotDeal) return 1;
      return b._creationTime - a._creationTime;
    });

    return deals;
  },
});

export const getNewArrivals = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .withIndex("isNewArrival", (q) => q.eq("isNewArrival", true))
      .filter((q) => q.eq(q.field("isActive"), true))
      .take(50);
  },
});

export const getRelatedProducts = query({
  args: { category: v.string(), excludeId: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("category", (q) => q.eq("category", args.category))
      .filter((q) => q.and(q.eq(q.field("isActive"), true), q.neq(q.field("_id"), args.excludeId)))
      .take(4);
  },
});

export const searchProducts = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query.trim()) return [];
    const term = args.query.toLowerCase();
    const products = await ctx.db
      .query("products")
      .withIndex("isActive", (q) => q.eq("isActive", true))
      .collect();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );
  },
});

export const getAllProductsAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") throw new Error("Admin only");

    const products = await ctx.db.query("products").collect();
    return products.sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const createProduct = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") throw new Error("Admin only");

    const existing = await ctx.db
      .query("products")
      .withIndex("slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) throw new Error("Slug already exists");

    return await ctx.db.insert("products", args);
  },
});

export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    brand: v.optional(v.string()),
    condition: v.optional(v.union(v.literal("brand-new"), v.literal("ex-uk"), v.literal("ex-usa"))),
    price: v.optional(v.number()),
    compareAtPrice: v.optional(v.number()),
    images: v.optional(v.array(v.string())),
    specs: v.optional(v.record(v.string(), v.string())),
    stock: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
    isHotDeal: v.optional(v.boolean()),
    isNewArrival: v.optional(v.boolean()),
    displayOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") throw new Error("Admin only");

    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") throw new Error("Admin only");

    await ctx.db.delete(args.id);
  },
});

export const updateProductImages = mutation({
  args: {
    slug: v.string(),
    images: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("slug", (q) => q.eq("slug", args.slug))
      .first();
    if (!product) throw new Error(`Product not found: ${args.slug}`);
    await ctx.db.patch(product._id, { images: args.images });
  },
});

export const setDisplayOrder = mutation({
  args: { slug: v.string(), displayOrder: v.number() },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("slug", (q) => q.eq("slug", args.slug))
      .first();
    if (!product) throw new Error(`Product not found: ${args.slug}`);
    await ctx.db.patch(product._id, { displayOrder: args.displayOrder });
  },
});

export const updateStock = mutation({
  args: { id: v.id("products"), stock: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") throw new Error("Admin only");

    await ctx.db.patch(args.id, { stock: args.stock });
  },
});
