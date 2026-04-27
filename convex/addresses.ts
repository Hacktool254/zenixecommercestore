import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserAddresses = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("addresses")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const addAddress = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    street: v.string(),
    city: v.string(),
    isDefault: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    if (args.isDefault) {
      const existing = await ctx.db
        .query("addresses")
        .withIndex("userId", (q) => q.eq("userId", userId))
        .collect();
      await Promise.all(existing.map((a) => ctx.db.patch(a._id, { isDefault: false })));
    }

    return await ctx.db.insert("addresses", { userId, ...args });
  },
});

export const updateAddress = mutation({
  args: {
    id: v.id("addresses"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    street: v.optional(v.string()),
    city: v.optional(v.string()),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const address = await ctx.db.get(args.id);
    if (!address || address.userId !== userId) throw new Error("Not found");

    if (args.isDefault) {
      const existing = await ctx.db
        .query("addresses")
        .withIndex("userId", (q) => q.eq("userId", userId))
        .collect();
      await Promise.all(existing.map((a) => ctx.db.patch(a._id, { isDefault: false })));
    }

    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const deleteAddress = mutation({
  args: { id: v.id("addresses") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const address = await ctx.db.get(args.id);
    if (!address || address.userId !== userId) throw new Error("Not found");

    await ctx.db.delete(args.id);
  },
});

export const setDefaultAddress = mutation({
  args: { id: v.id("addresses") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const address = await ctx.db.get(args.id);
    if (!address || address.userId !== userId) throw new Error("Not found");

    const all = await ctx.db
      .query("addresses")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();

    await Promise.all(all.map((a) => ctx.db.patch(a._id, { isDefault: a._id === args.id })));
  },
});
