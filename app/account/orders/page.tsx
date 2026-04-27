"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Clock,
  Package,
  CheckCircle,
  XCircle,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    Icon: Clock,
  },
  processing: {
    label: "Processing",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    Icon: Package,
  },
  shipped: {
    label: "Shipped",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    Icon: Package,
  },
  delivered: {
    label: "Delivered",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
    Icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    Icon: XCircle,
  },
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
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            My Orders
          </h1>
          <p className="mt-0.5 text-sm text-[#8b92a5]">
            {orders.length} order{orders.length !== 1 ? "s" : ""} placed
          </p>
        </div>
        {orders.length > 0 && (
          <Link
            href="/shop"
            className="flex items-center gap-1.5 rounded-xl border border-[#1e2435] px-4 py-2 text-sm font-medium text-[#8b92a5] transition hover:border-[#f5a623]/30 hover:text-white"
          >
            Shop more <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-[#1e2435] bg-[#0d1117] px-6 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#111827]">
            <ShoppingBag className="h-8 w-8 text-[#4b5563]" />
          </div>
          <div>
            <p className="font-semibold text-white">No orders yet</p>
            <p className="mt-1 text-sm text-[#8b92a5]">
              When you place an order, it will appear here.
            </p>
          </div>
          <Link
            href="/shop"
            className="rounded-xl bg-[#f5a623] px-6 py-2.5 text-sm font-bold text-[#0a0e1a] transition hover:bg-[#ff9f1c]"
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
                className="group overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117] transition hover:border-[#f5a623]/25 hover:bg-[#0f1420]"
              >
                {/* Top strip */}
                <div className="flex items-center justify-between gap-3 border-b border-[#1e2435] px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold text-white">
                      {order.orderNumber}
                    </span>
                    <span className="text-[#4b5563]">·</span>
                    <span className="text-xs text-[#8b92a5]">{date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusCfg.label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#4b5563] transition group-hover:text-[#f5a623]" />
                  </div>
                </div>

                {/* Items + total */}
                <div className="flex items-center gap-4 px-5 py-4">
                  {/* Thumbnails */}
                  <div className="flex items-center -space-x-2">
                    {order.items.slice(0, 3).map((item, i) => (
                      <div
                        key={i}
                        className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border-2 border-[#0d1117] bg-[#111827]"
                      >
                        <Image
                          src={item.image || "/logo.png"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#0d1117] bg-[#1a2035] text-xs font-bold text-[#8b92a5]">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-[#8b92a5]">
                      {order.items.map((i) => i.name).join(", ")}
                    </p>
                    <p className={`mt-0.5 text-xs font-medium ${paymentCfg.color}`}>
                      {paymentCfg.label}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-xs text-[#8b92a5]">Total</p>
                    <p className="text-base font-bold text-[#f5a623]">
                      KES {order.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
