import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCartItems = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const items = await ctx.db
      .query("cartItems")
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

export const addToCart = mutation({
  args: { productId: v.id("products"), quantity: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const existing = await ctx.db
      .query("cartItems")
      .withIndex("userId_productId", (q) => q.eq("userId", userId).eq("productId", args.productId))
      .first();

    const product = await ctx.db.get(args.productId);
    if (!product || !product.isActive) throw new Error("Product not available");

    if (existing) {
      const newQty = Math.min(existing.quantity + args.quantity, product.stock);
      await ctx.db.patch(existing._id, { quantity: newQty });
    } else {
      await ctx.db.insert("cartItems", {
        userId,
        productId: args.productId,
        quantity: Math.min(args.quantity, product.stock),
      });
    }
  },
});

export const updateCartQuantity = mutation({
  args: { cartItemId: v.id("cartItems"), quantity: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const item = await ctx.db.get(args.cartItemId);
    if (!item || item.userId !== userId) throw new Error("Not found");

    if (args.quantity < 1) {
      await ctx.db.delete(args.cartItemId);
    } else {
      await ctx.db.patch(args.cartItemId, { quantity: args.quantity });
    }
  },
});

export const removeFromCart = mutation({
  args: { cartItemId: v.id("cartItems") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const item = await ctx.db.get(args.cartItemId);
    if (!item || item.userId !== userId) throw new Error("Not found");

    await ctx.db.delete(args.cartItemId);
  },
});

export const clearCart = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const items = await ctx.db
      .query("cartItems")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();

    await Promise.all(items.map((item) => ctx.db.delete(item._id)));
  },
});
