"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { X, MapPin, CreditCard, ShoppingBag } from "lucide-react";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

const STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "text-amber-400 bg-amber-400/10",
  processing: "text-blue-400 bg-blue-400/10",
  shipped: "text-purple-400 bg-purple-400/10",
  delivered: "text-green-400 bg-green-400/10",
  cancelled: "text-red-400 bg-red-400/10",
};

const PAYMENT_COLORS: Record<string, string> = {
  pending: "text-amber-400",
  paid: "text-green-400",
  failed: "text-red-400",
};

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [selectedId, setSelectedId] = useState<Id<"orders"> | null>(null);
  const [updatingId, setUpdatingId] = useState<Id<"orders"> | null>(null);

  const orders = useQuery(api.orders.getAllOrders, filter === "all" ? {} : { status: filter });
  const updateStatus = useMutation(api.orders.updateOrderStatus);

  const selectedOrder = orders?.find((o) => o._id === selectedId) ?? null;

  const handleStatusChange = async (id: Id<"orders">, status: OrderStatus) => {
    setUpdatingId(id);
    try {
      await updateStatus({ id, status });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div>
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Orders
        </h1>
        <p className="mt-0.5 text-sm text-[#8b92a5]">{orders?.length ?? "—"} orders</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
              filter === s
                ? "bg-[#f5a623] text-[#0a0e1a]"
                : "border border-[#1e2435] text-[#8b92a5] hover:text-white"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
        {orders === undefined ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#f5a623] border-t-transparent" />
          </div>
        ) : orders.length === 0 ? (
          <p className="py-16 text-center text-sm text-[#8b92a5]">No orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e2435] text-left">
                  {["Order", "Date", "Total", "Payment", "Status", "Update Status"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-xs font-semibold tracking-widest text-[#8b92a5] uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2435]">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="cursor-pointer transition hover:bg-[#111827]"
                    onClick={() => setSelectedId(order._id)}
                  >
                    <td className="px-5 py-3 font-medium text-white">{order.orderNumber}</td>
                    <td className="px-5 py-3 text-[#8b92a5]">
                      {new Date(order._creationTime).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3 font-semibold text-[#f5a623]">
                      KES {order.total.toLocaleString()}
                    </td>
                    <td
                      className={`px-5 py-3 text-xs font-semibold capitalize ${PAYMENT_COLORS[order.paymentStatus] ?? "text-[#8b92a5]"}`}
                    >
                      {order.paymentStatus}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${STATUS_COLORS[order.status as OrderStatus] ?? "bg-[#1e2435] text-[#8b92a5]"}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value as OrderStatus)
                        }
                        className="rounded-lg border border-[#1e2435] bg-[#111827] px-2 py-1.5 text-xs text-white transition outline-none focus:border-[#f5a623]/50 disabled:opacity-50"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s} className="bg-[#111827] capitalize">
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-[#1e2435] px-5 py-4">
              <div>
                <p className="font-semibold text-white">{selectedOrder.orderNumber}</p>
                <p className="text-xs text-[#8b92a5]">
                  {new Date(selectedOrder._creationTime).toLocaleDateString("en-KE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="text-[#8b92a5] transition hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {/* Items */}
              <div className="mb-4">
                <div className="mb-2 flex items-center gap-2">
                  <ShoppingBag className="h-3.5 w-3.5 text-[#8b92a5]" />
                  <span className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
                    Items
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[#111827]">
                        <Image
                          src={item.image || "/logo.png"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{item.name}</p>
                        <p className="text-xs text-[#8b92a5]">
                          {item.condition} · Qty {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-[#f5a623]">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div className="mb-4 rounded-xl border border-[#1e2435] bg-[#111827] p-4">
                <div className="mb-2 flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[#8b92a5]" />
                  <span className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
                    Delivery
                  </span>
                </div>
                <p className="font-semibold text-white">{selectedOrder.address.name}</p>
                <p className="text-sm text-[#8b92a5]">
                  {selectedOrder.address.street}, {selectedOrder.address.city}
                </p>
                <p className="text-sm text-[#8b92a5]">{selectedOrder.address.phone}</p>
              </div>

              {/* Totals */}
              <div className="rounded-xl border border-[#1e2435] bg-[#111827] p-4">
                <div className="mb-2 flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5 text-[#8b92a5]" />
                  <span className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
                    Payment
                  </span>
                </div>
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
                <div className="mt-2 flex justify-between border-t border-[#1e2435] pt-2">
                  <span className="font-bold text-white">Total</span>
                  <span className="font-bold text-[#f5a623]">
                    KES {selectedOrder.total.toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 flex justify-between text-xs">
                  <span className="text-[#8b92a5]">Method</span>
                  <span className="font-medium text-white capitalize">
                    {selectedOrder.paymentMethod === "mpesa" ? "M-Pesa" : "Card"}
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-xs">
                  <span className="text-[#8b92a5]">Status</span>
                  <span
                    className={`font-semibold capitalize ${PAYMENT_COLORS[selectedOrder.paymentStatus] ?? "text-[#8b92a5]"}`}
                  >
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
