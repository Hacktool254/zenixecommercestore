"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Clock, Package, CheckCircle, XCircle, ChevronRight } from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "text-amber-400", bg: "bg-amber-400/10", Icon: Clock },
  processing: { label: "Processing", color: "text-blue-400", bg: "bg-blue-400/10", Icon: Package },
  shipped: { label: "Shipped", color: "text-purple-400", bg: "bg-purple-400/10", Icon: Package },
  delivered: {
    label: "Delivered",
    color: "text-green-400",
    bg: "bg-green-400/10",
    Icon: CheckCircle,
  },
  cancelled: { label: "Cancelled", color: "text-red-400", bg: "bg-red-400/10", Icon: XCircle },
} as const;

const PAYMENT_CONFIG = {
  pending: { label: "Awaiting payment", color: "text-amber-400" },
  paid: { label: "Paid", color: "text-green-400" },
  failed: { label: "Failed", color: "text-red-400" },
} as const;

export default function OrdersPage() {
  const orders = useQuery(api.orders.getUserOrders);

  if (orders === undefined) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#f5a623] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1
          className="text-xl font-bold text-white"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Orders
        </h1>
        <p className="mt-0.5 text-sm text-[#8b92a5]">
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[#1e2435] bg-[#0d1117] px-6 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1e2435]">
            <ShoppingBag className="h-7 w-7 text-[#8b92a5]" />
          </div>
          <p className="font-semibold text-white">No orders yet</p>
          <p className="text-sm text-[#8b92a5]">When you place an order, it will appear here.</p>
          <Link
            href="/shop"
            className="mt-1 rounded-xl bg-[#f5a623] px-5 py-2.5 text-sm font-bold text-[#0a0e1a] transition hover:bg-[#ff9f1c]"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => {
            const statusCfg =
              STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
            const paymentCfg =
              PAYMENT_CONFIG[order.paymentStatus as keyof typeof PAYMENT_CONFIG] ??
              PAYMENT_CONFIG.pending;
            const StatusIcon = statusCfg.Icon;
            const date = new Date(order._creationTime).toLocaleDateString("en-KE", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <Link
                key={order._id}
                href={`/order/${order._id}`}
                className="group flex flex-col gap-4 overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117] p-5 transition hover:border-[#f5a623]/30"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-white">{order.orderNumber}</p>
                    <p className="text-xs text-[#8b92a5]">{date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusCfg.bg} ${statusCfg.color}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusCfg.label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#8b92a5] transition group-hover:text-[#f5a623]" />
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="flex items-center gap-2">
                  {order.items.slice(0, 4).map((item, i) => (
                    <div
                      key={i}
                      className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#1e2435] bg-[#111827]"
                    >
                      <Image
                        src={item.image || "/logo.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1e2435] bg-[#111827] text-xs font-semibold text-[#8b92a5]">
                      +{order.items.length - 4}
                    </span>
                  )}
                  <div className="ml-auto text-right">
                    <p className="text-xs text-[#8b92a5]">Total</p>
                    <p className="font-bold text-[#f5a623]">KES {order.total.toLocaleString()}</p>
                  </div>
                </div>

                {/* Payment status */}
                <p className={`text-xs font-medium ${paymentCfg.color}`}>{paymentCfg.label}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
