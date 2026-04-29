"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import {
  Search,
  Download,
  Package,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

const STATUS_INFO: Record<
  OrderStatus,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    icon: <Clock className="h-3 w-3" />,
  },
  processing: {
    label: "Processing",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    icon: <Package className="h-3 w-3" />,
  },
  shipped: {
    label: "Shipped",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    icon: <Truck className="h-3 w-3" />,
  },
  delivered: {
    label: "Delivered",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    icon: <XCircle className="h-3 w-3" />,
  },
};

function StatusBadge({ status }: { status: string }) {
  const info = STATUS_INFO[status as OrderStatus] ?? {
    label: status,
    color: "text-[#8b92a5]",
    bg: "bg-[#1e2435]",
    border: "border-[#1e2435]",
    icon: null,
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-black tracking-widest uppercase",
        info.color,
        info.bg,
        info.border
      )}
    >
      {info.icon}
      {info.label}
    </span>
  );
}

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<Id<"orders"> | null>(null);
  const [updatingId, setUpdatingId] = useState<Id<"orders"> | null>(null);

  const orders = useQuery(api.orders.getAllOrders, filter === "all" ? {} : { status: filter });
  const updateStatus = useMutation(api.orders.updateOrderStatus);

  const selectedOrder = orders?.find((o) => o._id === selectedId) ?? null;

  const filtered = orders?.filter((o) => {
    const q = search.toLowerCase();
    return (
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.address.name.toLowerCase().includes(q) ||
      o.address.phone.includes(q)
    );
  });

  const handleStatusChange = async (id: Id<"orders">, status: OrderStatus) => {
    setUpdatingId(id);
    try {
      await updateStatus({ id, status });
    } finally {
      setUpdatingId(null);
    }
  };

  const exportCSV = () => {
    if (!orders) return;
    const rows = [
      ["Order #", "Date", "Customer", "Phone", "City", "Items", "Total", "Payment", "Status"],
      ...orders.map((o) => [
        o.orderNumber,
        new Date(o._creationTime).toLocaleDateString("en-KE"),
        o.address.name,
        o.address.phone,
        o.address.city,
        o.items.map((i) => `${i.name} x${i.quantity}`).join("; "),
        o.total,
        o.paymentStatus,
        o.status,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv," + encodeURIComponent(csv);
    a.download = `orders_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-[#f5a623]/10 pb-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-[#f5a623]/40" />
            <p className="text-[10px] font-black tracking-[0.4em] text-[#f5a623]/50 uppercase">
              Logistics & Fulfilment
            </p>
          </div>
          <h1 className="text-4xl leading-none font-black tracking-tighter text-white">
            ORDER <span className="font-normal text-[#f5a623] italic">Stream</span>
          </h1>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 rounded-xl border border-[#f5a623]/20 bg-[#f5a623]/5 px-5 py-3 text-xs font-bold tracking-widest text-[#f5a623] uppercase transition hover:bg-[#f5a623]/10"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Filter tabs + search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["all", "pending", "processing", "shipped", "delivered", "cancelled"] as const).map(
            (s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-[10px] font-black tracking-widest uppercase transition",
                  filter === s
                    ? "bg-[#f5a623] text-[#0a0e1a]"
                    : "border border-[#f5a623]/10 text-[#8b92a5] hover:border-[#f5a623]/30 hover:text-white"
                )}
              >
                {s}
              </button>
            )
          )}
        </div>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#8b92a5]/60" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="h-10 rounded-xl border border-[#f5a623]/10 bg-[#0d1117] pr-4 pl-10 text-sm text-white outline-none placeholder:text-[#8b92a5]/40 focus:border-[#f5a623]/40"
          />
        </div>
      </div>

      {/* Split panel */}
      <div className="flex items-start gap-6">
        {/* Order table */}
        <div
          className={cn(
            "flex-1 overflow-hidden rounded-2xl border border-[#f5a623]/10 bg-[#0d1117] transition-all",
            selectedId ? "lg:w-[58%]" : "w-full"
          )}
        >
          {orders === undefined ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-7 w-7 animate-spin text-[#f5a623]" />
            </div>
          ) : (filtered?.length ?? 0) === 0 ? (
            <p className="py-16 text-center text-sm text-[#8b92a5]/40 italic">No orders found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f5a623]/10">
                    {["Order", "Customer", "Total", "Status", "Date"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-4 text-left text-[9px] font-black tracking-[0.25em] text-[#8b92a5]/50 uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5a623]/5">
                  {filtered?.map((order) => {
                    const active = selectedId === order._id;
                    return (
                      <tr
                        key={order._id}
                        onClick={() => setSelectedId(active ? null : order._id)}
                        className={cn(
                          "relative cursor-pointer transition",
                          active ? "bg-[#f5a623]/[0.04]" : "hover:bg-[#f5a623]/[0.02]"
                        )}
                      >
                        {active && (
                          <td className="absolute top-1/2 left-0 h-8 w-0.5 -translate-y-1/2 rounded-r bg-[#f5a623]" />
                        )}
                        <td className="px-5 py-4">
                          <p className="font-mono text-[10px] font-black tracking-widest text-[#f5a623]/70 uppercase">
                            {order.orderNumber.split("-").pop()}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-bold text-white">{order.address.name}</p>
                          <p className="mt-0.5 text-[10px] tracking-wider text-[#8b92a5]/50 uppercase">
                            {order.address.city}
                          </p>
                        </td>
                        <td className="px-5 py-4 font-black text-[#f5a623]">
                          KES {order.total.toLocaleString()}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-5 py-4 text-xs text-[#8b92a5]/50">
                          {format(order._creationTime, "MMM d, HH:mm")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail flyout */}
        {selectedOrder && (
          <div className="sticky top-6 max-h-[calc(100vh-160px)] w-full shrink-0 overflow-y-auto rounded-2xl border border-[#f5a623]/10 bg-[#0d1117] p-6 lg:w-[40%]">
            {/* Flyout header */}
            <div className="mb-6 flex items-center justify-between border-b border-[#f5a623]/10 pb-5">
              <div>
                <p className="mb-1 text-[9px] font-black tracking-[0.3em] text-[#f5a623]/50 uppercase">
                  Order Detail
                </p>
                <p className="font-mono text-sm font-black tracking-widest text-white uppercase">
                  {selectedOrder.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="text-[#8b92a5] transition hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Status + date */}
              <div className="flex flex-wrap gap-3">
                <StatusBadge status={selectedOrder.status} />
                <span className="inline-flex items-center rounded-full border border-[#f5a623]/10 bg-[#f5a623]/5 px-3 py-1 text-[9px] font-bold tracking-widest text-[#8b92a5] uppercase">
                  {format(selectedOrder._creationTime, "MMM d, yyyy")}
                </span>
              </div>

              {/* Items */}
              <div>
                <p className="mb-3 text-[9px] font-black tracking-[0.3em] text-[#8b92a5]/50 uppercase">
                  Items
                </p>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-[#f5a623]/5 bg-[#080c16] p-3"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#1e2435]">
                        <Image
                          src={item.image || "/logo.png"}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                          sizes="48px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-white">{item.name}</p>
                        <p className="text-[10px] tracking-wider text-[#8b92a5]/50 uppercase">
                          {item.condition} · Qty {item.quantity}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-black text-[#f5a623]">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2 rounded-xl border border-[#f5a623]/10 bg-[#080c16] p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8b92a5]">Subtotal</span>
                  <span className="text-white">KES {selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8b92a5]">Delivery</span>
                  <span className="text-white">
                    KES {selectedOrder.deliveryFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#f5a623]/10 pt-2 font-black">
                  <span className="text-white">Total</span>
                  <span className="text-[#f5a623]">KES {selectedOrder.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-1 text-xs">
                  <span className="text-[#8b92a5]">Payment</span>
                  <span
                    className={cn(
                      "font-bold capitalize",
                      selectedOrder.paymentStatus === "paid"
                        ? "text-emerald-400"
                        : selectedOrder.paymentStatus === "failed"
                          ? "text-red-400"
                          : "text-amber-400"
                    )}
                  >
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Delivery address */}
              <div className="rounded-xl border border-[#f5a623]/20 bg-[#f5a623]/5 p-4">
                <p className="mb-3 text-[9px] font-black tracking-[0.3em] text-[#f5a623]/60 uppercase">
                  Shipping
                </p>
                <p className="font-bold text-white">{selectedOrder.address.name}</p>
                <p className="text-sm text-[#8b92a5]">{selectedOrder.address.phone}</p>
                <p className="text-sm text-[#8b92a5]">
                  {selectedOrder.address.street}, {selectedOrder.address.city}
                </p>
                {selectedOrder.address.notes && (
                  <p className="mt-1 text-xs text-[#8b92a5]/60 italic">
                    {selectedOrder.address.notes}
                  </p>
                )}
              </div>

              {/* Status actions */}
              <div>
                <p className="mb-3 text-[9px] font-black tracking-[0.3em] text-[#8b92a5]/50 uppercase">
                  Update Status
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(["processing", "shipped", "delivered"] as const).map((s) => (
                    <button
                      key={s}
                      disabled={
                        updatingId === selectedOrder._id ||
                        selectedOrder.status === s ||
                        selectedOrder.status === "cancelled" ||
                        selectedOrder.status === "delivered"
                      }
                      onClick={() => handleStatusChange(selectedOrder._id, s)}
                      className="rounded-xl border border-[#f5a623]/10 bg-[#080c16] py-2.5 text-[10px] font-black tracking-widest text-[#8b92a5] capitalize uppercase transition hover:border-[#f5a623]/30 hover:text-[#f5a623] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      {s}
                    </button>
                  ))}
                  <button
                    disabled={
                      updatingId === selectedOrder._id ||
                      selectedOrder.status === "cancelled" ||
                      selectedOrder.status === "delivered"
                    }
                    onClick={() => handleStatusChange(selectedOrder._id, "cancelled")}
                    className="rounded-xl border border-red-500/20 bg-red-500/5 py-2.5 text-[10px] font-black tracking-widest text-red-400 uppercase transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Cancel
                  </button>
                </div>
                {updatingId === selectedOrder._id && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-[#f5a623]/60">
                    <Loader2 className="h-3 w-3 animate-spin" /> Updating...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
