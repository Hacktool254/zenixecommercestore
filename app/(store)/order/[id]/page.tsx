"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  CheckCircle,
  Clock,
  XCircle,
  Package,
  MapPin,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const MERCHANT_ID = "5804859197";

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
};

const PAYMENT_CONFIG = {
  pending: { label: "Awaiting payment", color: "text-amber-400" },
  paid: { label: "Paid", color: "text-green-400" },
  failed: { label: "Payment failed", color: "text-red-400" },
};

export default function OrderPage() {
  const params = useParams();
  const router = useRouter();
  const id = params["id"] as string;

  const order = useQuery(api.orders.getOrderById, { id: id as Id<"orders"> });

  // Google Customer Reviews opt-in — must be before any conditional returns (rules of hooks)
  useEffect(() => {
    if (!order || order.paymentStatus !== "paid") return;

    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js?onload=renderOptIn";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 2);
    const estimatedDelivery = deliveryDate.toISOString().split("T")[0];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)["renderOptIn"] = function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gapi = (window as any)["gapi"] as {
        load: (name: string, cb: () => void) => void;
        surveyoptin: { render: (opts: Record<string, unknown>) => void };
      };
      gapi.load("surveyoptin", function () {
        gapi.surveyoptin.render({
          merchant_id: MERCHANT_ID,
          order_id: order.orderNumber,
          email: "",
          delivery_country: "KE",
          estimated_delivery_date: estimatedDelivery,
        });
      });
    };

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, [order?.paymentStatus, order?.orderNumber]);

  if (order === undefined) {
    return (
      <div className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-4 py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#f5a623] border-t-transparent" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-4 py-32 text-center">
        <p className="text-[#8b92a5]">Order not found.</p>
        <Link href="/shop" className="mt-4 text-sm font-medium text-[#f5a623] hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
  const paymentCfg = PAYMENT_CONFIG[order.paymentStatus] ?? PAYMENT_CONFIG.pending;
  const StatusIcon = statusCfg.Icon;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div
          className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${statusCfg.bg}`}
        >
          <StatusIcon className={`h-8 w-8 ${statusCfg.color}`} />
        </div>
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          {order.paymentStatus === "paid" ? "Order confirmed!" : "Order placed"}
        </h1>
        <p className="mt-1 text-sm text-[#8b92a5]">
          Order number: <span className="font-medium text-white">{order.orderNumber}</span>
        </p>
        <div className="mt-3 flex gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusCfg.bg} ${statusCfg.color}`}
          >
            {statusCfg.label}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${order.paymentStatus === "paid" ? "bg-green-400/10" : order.paymentStatus === "failed" ? "bg-red-400/10" : "bg-amber-400/10"} ${paymentCfg.color}`}
          >
            {paymentCfg.label}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="mb-5 overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
        <div className="flex items-center gap-2 border-b border-[#1e2435] px-5 py-3">
          <ShoppingBag className="h-4 w-4 text-[#8b92a5]" />
          <span className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
            Items ordered
          </span>
        </div>
        <div className="divide-y divide-[#1e2435] px-5">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-4">
              <img src={item.image} alt={item.name} className="h-14 w-14 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{item.name}</p>
                <p className="text-xs text-[#8b92a5]">
                  {item.condition} · Qty: {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold text-white">
                KES {(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Totals + Address + Payment in two-col on desktop */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Delivery address */}
        <div className="rounded-2xl border border-[#1e2435] bg-[#0d1117] p-5">
          <div className="mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#8b92a5]" />
            <span className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
              Delivery address
            </span>
          </div>
          <p className="font-semibold text-white">{order.address.name}</p>
          <p className="text-sm text-[#8b92a5]">
            {order.address.street}, {order.address.city}
          </p>
          <p className="text-sm text-[#8b92a5]">{order.address.phone}</p>
          {order.address.notes && (
            <p className="mt-1 text-xs text-[#8b92a5]">Note: {order.address.notes}</p>
          )}
        </div>

        {/* Order summary */}
        <div className="rounded-2xl border border-[#1e2435] bg-[#0d1117] p-5">
          <div className="mb-3 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-[#8b92a5]" />
            <span className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
              Payment summary
            </span>
          </div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-[#8b92a5]">Subtotal</span>
            <span className="text-white">KES {order.subtotal.toLocaleString()}</span>
          </div>
          <div className="mb-3 flex justify-between text-sm">
            <span className="text-[#8b92a5]">Delivery</span>
            <span className="text-white">KES {order.deliveryFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-[#1e2435] pt-3">
            <span className="font-bold text-white">Total</span>
            <span className="font-bold text-[#f5a623]">KES {order.total.toLocaleString()}</span>
          </div>
          <div className="mt-3 flex justify-between text-sm">
            <span className="text-[#8b92a5]">Method</span>
            <span className="font-medium text-white capitalize">
              {order.paymentMethod === "mpesa" ? "M-Pesa" : "Card"}
            </span>
          </div>
          {order.paystackReference && (
            <div className="mt-1 flex justify-between text-xs">
              <span className="text-[#8b92a5]">Reference</span>
              <span className="font-mono text-[#8b92a5]">{order.paystackReference}</span>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/shop"
          className="flex items-center gap-2 rounded-xl bg-[#f5a623] px-6 py-3 text-sm font-bold text-[#0a0e1a] transition hover:bg-[#ff9f1c] hover:shadow-[0_0_20px_rgba(245,166,35,0.35)]"
        >
          Continue Shopping
        </Link>
        <Link
          href="/account/orders"
          className="rounded-xl border border-[#1e2435] px-6 py-3 text-sm text-[#8b92a5] transition hover:text-white"
        >
          View all orders
        </Link>
      </div>
    </div>
  );
}
