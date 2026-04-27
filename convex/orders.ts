import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const orderItemValidator = v.object({
  productId: v.id("products"),
  name: v.string(),
  price: v.number(),
  quantity: v.number(),
  image: v.string(),
  condition: v.string(),
});

const addressValidator = v.object({
  name: v.string(),
  phone: v.string(),
  street: v.string(),
  city: v.string(),
  notes: v.optional(v.string()),
});

export const createOrder = mutation({
  args: {
    items: v.array(orderItemValidator),
    subtotal: v.number(),
    deliveryFee: v.number(),
    total: v.number(),
    address: addressValidator,
    paymentMethod: v.union(v.literal("mpesa"), v.literal("card")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const orderNumber = `ZNX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const orderId = await ctx.db.insert("orders", {
      userId,
      orderNumber,
      status: "pending",
      paymentStatus: "pending",
      ...args,
    });

    return { orderId, orderNumber };
  },
});

export const getOrderById = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const order = await ctx.db.get(args.id);
    if (!order) return null;
    if (order.userId !== userId) {
      const user = await ctx.db.get(userId);
      if (!user || user.role !== "admin") throw new Error("Unauthorized");
    }
    return order;
  },
});

export const getOrderByNumber = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("orderNumber", (q) => q.eq("orderNumber", args.orderNumber))
      .first();
  },
});

export const getUserOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("orders")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getAllOrders = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("processing"),
        v.literal("shipped"),
        v.literal("delivered"),
        v.literal("cancelled")
      )
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") throw new Error("Admin only");

    if (args.status) {
      return await ctx.db
        .query("orders")
        .withIndex("status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    }

    return await ctx.db.query("orders").order("desc").collect();
  },
});

export const updateOrderStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") throw new Error("Admin only");

    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const updatePaymentStatus = mutation({
  args: {
    id: v.id("orders"),
    paymentStatus: v.union(v.literal("pending"), v.literal("paid"), v.literal("failed")),
    paystackReference: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    if (args.paymentStatus === "paid") {
      await ctx.db.patch(id, { status: "processing" });
    }
  },
});
