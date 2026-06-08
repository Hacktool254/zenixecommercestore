"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ShoppingCart, Phone, Mail, MessageCircle, Clock, Package } from "lucide-react";

export default function AbandonedCartsPage() {
  const orders = useQuery(api.orders.getAbandonedOrders);

  const totalValue = orders?.reduce((sum, o) => sum + o.total, 0) ?? 0;

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Abandoned Carts</h1>
          <p className="mt-1 text-sm text-[#8b92a5]">
            Orders created but payment not completed — reach out to recover these sales.
          </p>
        </div>
        <div className="rounded-2xl border border-[#1e2435] bg-[#0d1117] px-5 py-3 text-right">
          <p className="text-xs text-[#8b92a5]">Potential revenue</p>
          <p className="text-xl font-bold text-[#f5a623]">KES {totalValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#1e2435] bg-[#0d1117] p-4">
          <p className="text-xs text-[#8b92a5]">Total abandoned</p>
          <p className="mt-1 text-2xl font-bold text-white">{orders?.length ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-[#1e2435] bg-[#0d1117] p-4">
          <p className="text-xs text-[#8b92a5]">Avg order value</p>
          <p className="mt-1 text-2xl font-bold text-white">
            KES {orders?.length ? Math.round(totalValue / orders.length).toLocaleString() : 0}
          </p>
        </div>
        <div className="rounded-2xl border border-[#1e2435] bg-[#0d1117] p-4">
          <p className="text-xs text-[#8b92a5]">Items abandoned</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {orders?.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0) ?? 0}
          </p>
        </div>
      </div>

      {/* List */}
      {orders === undefined ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#f5a623] border-t-transparent" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#1e2435] bg-[#0d1117] py-20 text-center">
          <ShoppingCart className="mb-3 h-10 w-10 text-[#8b92a5]" />
          <p className="font-semibold text-white">No abandoned carts</p>
          <p className="mt-1 text-sm text-[#8b92a5]">All orders have been paid — great work!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]"
            >
              {/* Order header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1e2435] px-5 py-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <div>
                    <p className="font-semibold text-white">{order.orderNumber}</p>
                    <p className="text-xs text-[#8b92a5]">
                      {new Date(order._creationTime).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#8b92a5]">Order value</p>
                  <p className="font-bold text-[#f5a623]">KES {order.total.toLocaleString()}</p>
                </div>
              </div>

              {/* Customer info */}
              <div className="border-b border-[#1e2435] px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#8b92a5]">Customer</p>
                    <p className="font-medium text-white">{order.customerName}</p>
                    {order.customerEmail && (
                      <p className="text-sm text-[#8b92a5]">{order.customerEmail}</p>
                    )}
                    <p className="text-sm text-[#8b92a5]">{order.address.phone}</p>
                  </div>
                  {/* Recovery actions */}
                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/${order.address.phone.replace(/\D/g, "").replace(/^0/, "254")}?text=Hi ${encodeURIComponent(order.customerName)}, we noticed you started an order for ${encodeURIComponent(order.items[0]?.name ?? "a product")} (KES ${order.total.toLocaleString()}) but didn't complete payment. We'd love to help — are you still interested?`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#1ebe5d]"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      WhatsApp
                    </a>
                    {order.customerEmail && (
                      <a
                        href={`mailto:${order.customerEmail}?subject=Your Zenix Electronics order ${order.orderNumber}&body=Hi ${order.customerName},%0A%0AWe noticed you started an order for ${order.items[0]?.name ?? "a product"} (KES ${order.total.toLocaleString()}) but didn't complete payment.%0A%0AWe'd love to help you complete your purchase. Click here to visit our store: https://zenixelectronics.co.ke%0A%0AYour order number was: ${order.orderNumber}%0A%0AKind regards,%0AZenix Electronics`}
                        className="flex items-center gap-1.5 rounded-xl border border-[#1e2435] px-3 py-2 text-xs font-semibold text-[#8b92a5] transition hover:border-[#f5a623]/40 hover:text-white"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        Email
                      </a>
                    )}
                    <a
                      href={`tel:${order.address.phone}`}
                      className="flex items-center gap-1.5 rounded-xl border border-[#1e2435] px-3 py-2 text-xs font-semibold text-[#8b92a5] transition hover:border-[#f5a623]/40 hover:text-white"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      Call
                    </a>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-[#1e2435] px-5">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 py-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{item.name}</p>
                      <p className="text-xs text-[#8b92a5]">
                        {item.condition} · Qty {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Delivery address */}
              <div className="border-t border-[#1e2435] px-5 py-3">
                <p className="text-xs text-[#8b92a5]">
                  <Package className="mr-1 inline h-3 w-3" />
                  Delivery: {order.address.street}, {order.address.city} ·{" "}
                  {order.paymentMethod === "mpesa" ? "M-Pesa" : "Card"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
