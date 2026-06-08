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

    const orders = await ctx.db
      .query("orders")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // Only show orders that have been paid — hide abandoned/unpaid pending orders
    return orders.filter((o) => o.paymentStatus === "paid" || o.paymentStatus === "failed");
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

export const getAdminStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") throw new Error("Admin only");

    const orders = await ctx.db.query("orders").collect();
    const products = await ctx.db.query("products").collect();

    const totalRevenue = orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.total, 0);

    const lowStock = products.filter((p) => p.stock <= 5 && p.isActive);

    return {
      totalOrders: orders.length,
      totalRevenue,
      totalProducts: products.filter((p) => p.isActive).length,
      lowStockCount: lowStock.length,
      recentOrders: orders.sort((a, b) => b._creationTime - a._creationTime).slice(0, 10),
      lowStockProducts: lowStock.sort((a, b) => a.stock - b.stock).slice(0, 10),
    };
  },
});

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") throw new Error("Admin only");

    const orders = await ctx.db.query("orders").collect();
    const products = await ctx.db.query("products").collect();

    const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const totalSales = paidOrders.length;

    // Monthly revenue + orders for last 6 months
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      return {
        name: d.toLocaleString("en-US", { month: "short" }),
        year: d.getFullYear(),
        month: d.getMonth(),
        value: 0,
        orders: 0,
      };
    });
    for (const o of paidOrders) {
      const d = new Date(o._creationTime);
      const idx = months.findIndex((m) => m.year === d.getFullYear() && m.month === d.getMonth());
      if (idx !== -1) {
        months[idx]!.value += o.total;
        months[idx]!.orders += 1;
      }
    }

    // Revenue by category
    const catMap: Record<string, number> = {};
    for (const o of paidOrders) {
      for (const item of o.items) {
        const product = products.find((p) => p._id === item.productId);
        const cat = product?.category ?? "Other";
        catMap[cat] = (catMap[cat] ?? 0) + item.price * item.quantity;
      }
    }
    const totalCatRevenue = Object.values(catMap).reduce((s, v) => s + v, 0);
    const revenueByCategory = Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({
        name,
        value,
        percentage: totalCatRevenue > 0 ? Math.round((value / totalCatRevenue) * 100) : 0,
      }));

    // Top products by revenue
    const productRevMap: Record<string, { name: string; revenue: number; units: number }> = {};
    for (const o of paidOrders) {
      for (const item of o.items) {
        const id = item.productId;
        if (!productRevMap[id]) productRevMap[id] = { name: item.name, revenue: 0, units: 0 };
        productRevMap[id].revenue += item.price * item.quantity;
        productRevMap[id].units += item.quantity;
      }
    }
    const topRevenue = Object.values(productRevMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    const maxRev = topRevenue[0]?.revenue ?? 1;
    const topProducts = topRevenue.map((p) => ({
      ...p,
      share: Math.round((p.revenue / maxRev) * 100),
    }));

    // Order status breakdown
    const statusBreakdown = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    for (const o of orders) {
      if (o.status in statusBreakdown) statusBreakdown[o.status as keyof typeof statusBreakdown]++;
    }

    // Previous period comparison (prev 30d vs current 30d)
    const now30 = Date.now();
    const prev30Start = now30 - 60 * 24 * 3600 * 1000;
    const curr30Start = now30 - 30 * 24 * 3600 * 1000;
    const prevPaidOrders = paidOrders.filter(
      (o) => o._creationTime >= prev30Start && o._creationTime < curr30Start
    );
    const currPaidOrders = paidOrders.filter((o) => o._creationTime >= curr30Start);
    const prevRevenue = prevPaidOrders.reduce((s, o) => s + o.total, 0);
    const currRevenue = currPaidOrders.reduce((s, o) => s + o.total, 0);
    const revenueDelta =
      prevRevenue > 0 ? Math.round(((currRevenue - prevRevenue) / prevRevenue) * 100) : 0;
    const salesDelta =
      prevPaidOrders.length > 0
        ? Math.round(
            ((currPaidOrders.length - prevPaidOrders.length) / prevPaidOrders.length) * 100
          )
        : 0;
    const aov = totalSales > 0 ? totalRevenue / totalSales : 0;
    const prevAov =
      prevPaidOrders.length > 0
        ? prevPaidOrders.reduce((s, o) => s + o.total, 0) / prevPaidOrders.length
        : 0;
    const currAov =
      currPaidOrders.length > 0
        ? currPaidOrders.reduce((s, o) => s + o.total, 0) / currPaidOrders.length
        : 0;
    const aovDelta = prevAov > 0 ? Math.round(((currAov - prevAov) / prevAov) * 100) : 0;
    const lowStockCount = products.filter((p) => p.stock <= 5 && p.isActive).length;

    return {
      totalRevenue,
      totalSales,
      aov,
      months,
      revenueByCategory,
      topProducts,
      statusBreakdown,
      revenueDelta,
      salesDelta,
      aovDelta,
      lowStockCount,
      totalProducts: products.filter((p) => p.isActive).length,
      recentOrders: orders.sort((a, b) => b._creationTime - a._creationTime).slice(0, 8),
    };
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

export const getAbandonedOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") throw new Error("Admin only");

    const orders = await ctx.db
      .query("orders")
      .filter((q) => q.eq(q.field("paymentStatus"), "pending"))
      .order("desc")
      .collect();

    // Enrich with user info
    return await Promise.all(
      orders.map(async (order) => {
        const customer = await ctx.db.get(order.userId);
        return {
          ...order,
          customerName: customer?.name ?? "Unknown",
          customerEmail: customer?.email ?? "",
        };
      })
    );
  },
});
