"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { ShoppingBag, DollarSign, Package, AlertTriangle, Clock, ChevronRight } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "text-amber-400 bg-amber-400/10",
  processing: "text-blue-400 bg-blue-400/10",
  shipped: "text-purple-400 bg-purple-400/10",
  delivered: "text-green-400 bg-green-400/10",
  cancelled: "text-red-400 bg-red-400/10",
};

export default function AdminDashboard() {
  const stats = useQuery(api.orders.getAdminStats);

  if (stats === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#f5a623] border-t-transparent" />
      </div>
    );
  }

  const kpis = [
    {
      label: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Total Revenue",
      value: `KES ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "Active Products",
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: "text-[#f5a623]",
      bg: "bg-[#f5a623]/10",
    },
    {
      label: "Low Stock Items",
      value: stats.lowStockCount.toLocaleString(),
      icon: AlertTriangle,
      color: "text-red-400",
      bg: "bg-red-400/10",
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <div>
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Dashboard
        </h1>
        <p className="mt-0.5 text-sm text-[#8b92a5]">Welcome back</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="flex flex-col gap-3 rounded-2xl border border-[#1e2435] bg-[#0d1117] p-5"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-[#8b92a5]">{label}</p>
              <p className="mt-0.5 text-xl font-bold text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
          <div className="flex items-center justify-between border-b border-[#1e2435] px-5 py-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#8b92a5]" />
              <span className="text-sm font-semibold text-white">Recent Orders</span>
            </div>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-xs text-[#8b92a5] transition hover:text-[#f5a623]"
            >
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-[#1e2435]">
            {stats.recentOrders.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-[#8b92a5]">No orders yet</p>
            ) : (
              stats.recentOrders.map((order) => (
                <Link
                  key={order._id}
                  href={`/order/${order._id}`}
                  className="flex items-center justify-between gap-3 px-5 py-3 transition hover:bg-[#111827]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{order.orderNumber}</p>
                    <p className="text-xs text-[#8b92a5]">
                      {new Date(order._creationTime).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[#f5a623]">
                      KES {order.total.toLocaleString()}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${STATUS_COLORS[order.status] ?? "bg-[#1e2435] text-[#8b92a5]"}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Low stock */}
        <div className="overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
          <div className="flex items-center justify-between border-b border-[#1e2435] px-5 py-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-sm font-semibold text-white">Low Stock Alerts</span>
            </div>
            <Link
              href="/admin/inventory"
              className="flex items-center gap-1 text-xs text-[#8b92a5] transition hover:text-[#f5a623]"
            >
              Inventory <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-[#1e2435]">
            {stats.lowStockProducts.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-[#8b92a5]">All stock levels OK</p>
            ) : (
              stats.lowStockProducts.map((p) => (
                <Link
                  key={p._id}
                  href={`/admin/products/${p._id}`}
                  className="flex items-center justify-between gap-3 px-5 py-3 transition hover:bg-[#111827]"
                >
                  <p className="truncate text-sm font-medium text-white">{p.name}</p>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      p.stock === 0
                        ? "bg-red-400/10 text-red-400"
                        : "bg-amber-400/10 text-amber-400"
                    }`}
                  >
                    {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
