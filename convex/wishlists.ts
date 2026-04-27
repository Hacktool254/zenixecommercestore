import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getWishlist = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const items = await ctx.db
      .query("wishlists")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();

    return await Promise.all(
      items.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return { ...item, product };
      })
    );
  },
});

export const isInWishlist = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const item = await ctx.db
      .query("wishlists")
      .withIndex("userId_productId", (q) => q.eq("userId", userId).eq("productId", args.productId))
      .first();

    return !!item;
  },
});

export const addToWishlist = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const existing = await ctx.db
      .query("wishlists")
      .withIndex("userId_productId", (q) => q.eq("userId", userId).eq("productId", args.productId))
      .first();

    if (!existing) {
      await ctx.db.insert("wishlists", { userId, productId: args.productId });
    }
  },
});

export const removeFromWishlist = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const item = await ctx.db
      .query("wishlists")
      .withIndex("userId_productId", (q) => q.eq("userId", userId).eq("productId", args.productId))
      .first();

    if (item) await ctx.db.delete(item._id);
  },
});

export const toggleWishlist = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const existing = await ctx.db
      .query("wishlists")
      .withIndex("userId_productId", (q) => q.eq("userId", userId).eq("productId", args.productId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false;
    } else {
      await ctx.db.insert("wishlists", { userId, productId: args.productId });
      return true;
    }
  },
});
