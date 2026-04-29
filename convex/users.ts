import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Scrypt } from "lucia";
import { api } from "./_generated/api";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    return ctx.storage.generateUploadUrl();
  },
});

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return ctx.db.get(userId);
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    await ctx.db.patch(userId, args);
  },
});

export const updateAvatar = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) throw new Error("Failed to get image URL");
    await ctx.db.patch(userId, { image: url });
  },
});

export const promoteToAdmin = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();
    if (!user) throw new Error(`No user found with email: ${args.email}`);
    await ctx.db.patch(user._id, { role: "admin" });
    return { promoted: user.email };
  },
});

// Admin-only: delete a user and all associated data by ID
export const adminDeleteUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    // Delete related records
    const cart = await ctx.db
      .query("cartItems")
      .withIndex("userId", (q) => q.eq("userId", args.id))
      .collect();
    for (const item of cart) await ctx.db.delete(item._id);
    const wishlist = await ctx.db
      .query("wishlists")
      .withIndex("userId", (q) => q.eq("userId", args.id))
      .collect();
    for (const item of wishlist) await ctx.db.delete(item._id);
    const addresses = await ctx.db
      .query("addresses")
      .withIndex("userId", (q) => q.eq("userId", args.id))
      .collect();
    for (const addr of addresses) await ctx.db.delete(addr._id);
    // Delete auth accounts (full scan — authAccounts has no userId index by default)
    const accounts = await ctx.db.query("authAccounts").collect();
    for (const acc of accounts) {
      if (acc.userId === args.id) await ctx.db.delete(acc._id);
    }
    await ctx.db.delete(args.id);
    return { deleted: args.id };
  },
});

// Change password: verify current password then update hash
export const changePassword = action({
  args: {
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    // Find the password account for this user
    const accounts: Array<{ _id: string; secret?: string; userId: string }> = await ctx.runQuery(
      api.users.getAuthAccount,
      { userId }
    );
    const account = accounts[0];
    if (!account?.secret) throw new Error("No password account found");

    const scrypt = new Scrypt();
    const valid = await scrypt.verify(account.secret, args.currentPassword);
    if (!valid) throw new Error("Current password is incorrect");

    const newHash = await scrypt.hash(args.newPassword);
    await ctx.runMutation(api.users.updateAuthAccountSecret, {
      accountId: account._id as string,
      secret: newHash,
    });
  },
});

export const getAuthAccount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const accounts = await ctx.db.query("authAccounts").collect();
    return accounts.filter((a) => a.userId === args.userId && a.provider === "password");
  },
});

export const updateAuthAccountSecret = mutation({
  args: { accountId: v.string(), secret: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.accountId as Parameters<typeof ctx.db.patch>[0], {
      secret: args.secret,
    });
  },
});

// Admin: list all customers (non-admin users)
export const list = query({
  args: { searchTerm: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .withIndex("role", (q) => q.eq("role", "customer"))
      .collect();
    const orders = await ctx.db.query("orders").collect();

    const enriched = users.map((u) => {
      const userOrders = orders.filter((o) => o.userId === u._id);
      const totalSpend = userOrders.reduce((sum, o) => sum + o.total, 0);
      return {
        ...u,
        orderCount: userOrders.length,
        totalSpend,
        lastOrderAt:
          userOrders.length > 0 ? Math.max(...userOrders.map((o) => o._creationTime)) : null,
      };
    });

    if (args.searchTerm) {
      const q = args.searchTerm.toLowerCase();
      return enriched.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.phone?.toLowerCase().includes(q)
      );
    }
    return enriched;
  },
});
