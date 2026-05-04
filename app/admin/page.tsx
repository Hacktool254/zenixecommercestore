"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import {
  ShoppingBag,
  DollarSign,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Line,
} from "recharts";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const GOLD = "#f5a623";
const DONUT_COLORS = ["#f5a623", "#ff9f1c", "#8b92a5", "#1e2435", "#f5a62380"];

const STATUS_COLORS: Record<string, string> = {
  pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  processing: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  shipped: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  delivered: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
};

interface TooltipEntry {
  name: string;
  value: number;
}
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-[#f5a623]/20 bg-[#080c16]/95 p-4 shadow-2xl backdrop-blur">
      <p className="mb-2 text-[9px] font-black tracking-[0.3em] text-[#f5a623]/60 uppercase">
        {label}
      </p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-black text-white">
          {entry.name === "Revenue"
            ? `KES ${entry.value.toLocaleString()}`
            : `${entry.value} orders`}
        </p>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const stats = useQuery(api.orders.getDashboardStats);

  if (stats === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center py-40">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#f5a623] border-t-transparent" />
      </div>
    );
  }

  const kpis = [
    {
      label: "Total Revenue",
      value: `KES ${(stats.totalRevenue / 1000).toFixed(0)}K`,
      delta: stats.revenueDelta,
      icon: DollarSign,
    },
    {
      label: "Total Orders",
      value: stats.totalSales.toLocaleString(),
      delta: stats.salesDelta,
      icon: ShoppingBag,
    },
    {
      label: "Avg Order Value",
      value: `KES ${Math.round(stats.aov).toLocaleString()}`,
      delta: stats.aovDelta,
      icon: Zap,
    },
    {
      label: "Active Products",
      value: stats.totalProducts.toLocaleString(),
      delta: null,
      icon: Package,
    },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-[#f5a623]/10 pb-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-px w-8 rounded-full bg-[#f5a623]/50" />
            <p className="text-[10px] font-black tracking-[0.5em] text-[#f5a623]/60 uppercase">
              Operational Intelligence
            </p>
          </div>
          <h1 className="text-3xl leading-none font-black tracking-tighter text-white md:text-5xl">
            REVENUE <span className="font-normal text-[#f5a623] italic">Stream</span>
          </h1>
          <p className="text-sm text-[#8b92a5]">
            {format(new Date(), "MMMM yyyy")} · Live dashboard
          </p>
        </div>
        <Link href="/admin/products/new">
          <button className="flex items-center gap-2 rounded-2xl bg-[#f5a623] px-5 py-3 text-xs font-black tracking-[0.2em] text-[#0a0e1a] uppercase shadow-lg shadow-[#f5a623]/20 transition hover:scale-[1.02] active:scale-95 md:gap-3 md:px-8 md:py-4">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </button>
        </Link>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map(({ label, value, delta }) => (
          <div
            key={label}
            className="rounded-2xl border border-[#f5a623]/10 bg-[#0d1117] p-6 transition hover:border-[#f5a623]/25"
          >
            <p className="mb-3 text-[9px] font-black tracking-[0.3em] text-[#8b92a5]/60 uppercase">
              {label}
            </p>
            <p className="mb-2 text-3xl leading-none font-black tracking-tighter text-white">
              {value}
            </p>
            {delta !== null && (
              <div
                className={cn(
                  "flex items-center gap-1 text-[10px] font-bold",
                  (delta ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"
                )}
              >
                {(delta ?? 0) >= 0 ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {Math.abs(delta ?? 0)}% vs last period
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue area chart */}
        <div className="flex h-[300px] flex-col rounded-2xl border border-[#f5a623]/10 bg-[#0d1117] p-4 md:h-[400px] md:p-6 lg:col-span-2">
          <div className="mb-6">
            <h3 className="font-black tracking-tight text-white">Revenue Stream</h3>
            <p className="mt-1 text-xs text-[#8b92a5]/60 italic">Monthly revenue vs order volume</p>
            <div className="mt-4 flex gap-5">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#f5a623]" />
                <span className="text-[9px] font-black tracking-widest text-white/40 uppercase">
                  Revenue
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full border border-dashed border-[#8b92a5]" />
                <span className="text-[9px] font-black tracking-widest text-white/40 uppercase">
                  Orders
                </span>
              </div>
            </div>
          </div>
          <div className="-ml-2 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.months}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GOLD} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(245,166,35,0.06)"
                  strokeDasharray="6 6"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgba(139,146,165,0.6)", fontSize: 11, fontWeight: 700 }}
                  dy={8}
                />
                <YAxis
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgba(139,146,165,0.6)", fontSize: 10 }}
                  tickFormatter={(v) => `${v / 1000}K`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgba(139,146,165,0.6)", fontSize: 10 }}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ stroke: "rgba(245,166,35,0.1)", strokeWidth: 1 }}
                />
                <Area
                  yAxisId="left"
                  name="Revenue"
                  type="monotone"
                  dataKey="value"
                  stroke={GOLD}
                  strokeWidth={2}
                  fill="url(#revGrad)"
                  dot={{ fill: GOLD, r: 3 }}
                />
                <Line
                  yAxisId="right"
                  name="Orders"
                  type="monotone"
                  dataKey="orders"
                  stroke="#8b92a5"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  dot={{ fill: "#8b92a5", r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category donut */}
        <div className="flex h-[300px] flex-col rounded-2xl border border-[#f5a623]/10 bg-[#0d1117] p-4 md:h-[400px] md:p-6">
          <div className="mb-4">
            <h3 className="font-black tracking-tight text-white">By Category</h3>
            <p className="mt-1 text-xs text-[#8b92a5]/60 italic">Revenue distribution</p>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.revenueByCategory}
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={6}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.revenueByCategory.map(
                    (_: { name: string; value: number; percentage: number }, i: number) => (
                      <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                    )
                  )}
                </Pie>
                <Tooltip
                  formatter={(v) => [`KES ${Number(v).toLocaleString()}`, ""]}
                  contentStyle={{
                    background: "#080c16",
                    border: "1px solid rgba(245,166,35,0.2)",
                    borderRadius: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-auto grid grid-cols-2 gap-2">
            {stats.revenueByCategory.map((cat: { name: string; percentage: number }, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
                />
                <div className="min-w-0">
                  <p className="truncate text-[9px] font-black text-white uppercase">{cat.name}</p>
                  <p className="text-[9px] text-[#8b92a5]/50">{cat.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Top products */}
        <div className="rounded-2xl border border-[#f5a623]/10 bg-[#0d1117] p-6">
          <h3 className="mb-1 font-black tracking-tight text-white">Top Products</h3>
          <p className="mb-6 text-xs text-[#8b92a5]/60 italic">By revenue this period</p>
          <div className="space-y-5">
            {stats.topProducts.length === 0 && (
              <p className="text-sm text-[#8b92a5]/40 italic">No sales data yet</p>
            )}
            {stats.topProducts.map(
              (p: { name: string; revenue: number; share: number }, i: number) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="w-4 text-[10px] font-black text-[#f5a623]/30">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">{p.name}</p>
                    <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[#1e2435]">
                      <div
                        className="h-full rounded-full bg-[#f5a623] transition-all duration-1000"
                        style={{ width: `${p.share}%` }}
                      />
                    </div>
                  </div>
                  <p className="shrink-0 text-xs font-black text-white">
                    KES {Math.round(p.revenue / 1000)}K
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Monthly bar */}
        <div className="flex h-[300px] flex-col rounded-2xl border border-[#f5a623]/10 bg-[#0d1117] p-6">
          <h3 className="mb-1 font-black tracking-tight text-white">Monthly Revenue</h3>
          <p className="mb-4 text-xs text-[#8b92a5]/60 italic">Bar view</p>
          <div className="-ml-2 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.months}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgba(139,146,165,0.6)", fontSize: 10 }}
                  dy={6}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgba(139,146,165,0.6)", fontSize: 10 }}
                  tickFormatter={(v) => `${v / 1000}K`}
                />
                <Tooltip
                  formatter={(v) => [`KES ${Number(v).toLocaleString()}`, "Revenue"]}
                  contentStyle={{
                    background: "#080c16",
                    border: "1px solid rgba(245,166,35,0.2)",
                    borderRadius: 12,
                  }}
                  cursor={{ fill: "rgba(245,166,35,0.03)" }}
                />
                <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                  {stats.months.map(
                    (_: { name: string; value: number; orders: number }, i: number) => (
                      <Cell
                        key={i}
                        fill={i === stats.months.length - 1 ? GOLD : "rgba(245,166,35,0.15)"}
                      />
                    )
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order status */}
        <div className="rounded-2xl border border-[#f5a623]/10 bg-[#0d1117] p-6">
          <h3 className="mb-1 font-black tracking-tight text-white">Order Status</h3>
          <p className="mb-6 text-xs text-[#8b92a5]/60 italic">Fulfillment breakdown</p>
          <div className="space-y-1">
            {(["delivered", "shipped", "processing", "pending", "cancelled"] as const).map((s) => {
              const count = (stats.statusBreakdown as Record<string, number>)[s] ?? 0;
              const pct =
                stats.totalSales > 0 ? Math.round((count / (stats.totalSales || 1)) * 100) : 0;
              return (
                <div
                  key={s}
                  className="flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.02]"
                >
                  <p className="text-sm font-semibold text-white capitalize">{s}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-[#8b92a5]/50">{count}</span>
                    <span
                      className={cn(
                        "rounded-full border px-3 py-0.5 text-[9px] font-black tracking-widest uppercase",
                        STATUS_COLORS[s]
                      )}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="overflow-hidden rounded-2xl border border-[#f5a623]/10 bg-[#0d1117]">
        <div className="flex items-center justify-between border-b border-[#f5a623]/10 px-6 py-4">
          <h3 className="font-black tracking-tight text-white">Recent Orders</h3>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[#f5a623]/60 transition hover:text-[#f5a623]"
          >
            View all →
          </Link>
        </div>
        <div className="divide-y divide-[#f5a623]/5">
          {stats.recentOrders.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-[#8b92a5]/40 italic">No orders yet</p>
          ) : (
            stats.recentOrders
              .slice(0, 8)
              .map(
                (order: {
                  _id: string;
                  orderNumber: string;
                  _creationTime: number;
                  total: number;
                  status: string;
                }) => (
                  <Link
                    key={order._id}
                    href={`/admin/orders`}
                    className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-[#f5a623]/[0.03]"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] font-black tracking-widest text-[#f5a623]/60 uppercase">
                        {order.orderNumber}
                      </p>
                      <p className="mt-0.5 text-xs text-[#8b92a5]/60">
                        {new Date(order._creationTime).toLocaleDateString("en-KE", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-black text-[#f5a623]">
                        KES {order.total.toLocaleString()}
                      </span>
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-[9px] font-black tracking-widest uppercase",
                          STATUS_COLORS[order.status] ??
                            "border-[#1e2435] bg-[#1e2435] text-[#8b92a5]"
                        )}
                      >
                        {order.status}
                      </span>
                    </div>
                  </Link>
                )
              )
          )}
        </div>
      </div>
    </div>
  );
}
