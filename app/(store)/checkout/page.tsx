"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/convex/_generated/api";
import { useCartStore } from "@/stores/cart.store";
import {
  CheckCircle,
  ChevronRight,
  MapPin,
  ShoppingBag,
  CreditCard,
  Loader2,
  Plus,
  Phone,
} from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

const DELIVERY_FEE = 300;

const addressSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(9, "Enter a valid phone number"),
  street: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  notes: z.string().optional(),
});
type AddressForm = z.infer<typeof addressSchema>;
type Step = 1 | 2 | 3;

const STEPS: { n: Step; label: string; Icon: React.ElementType }[] = [
  { n: 1, label: "Address", Icon: MapPin },
  { n: 2, label: "Review", Icon: ShoppingBag },
  { n: 3, label: "Payment", Icon: CreditCard },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const addresses = useQuery(api.addresses.getUserAddresses);
  const createOrder = useMutation(api.orders.createOrder);
  const addAddress = useMutation(api.addresses.addAddress);

  const [step, setStep] = useState<Step>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<Id<"addresses"> | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [stkSent, setStkSent] = useState(false);
  const [messageReference, setMessageReference] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);

  const total = subtotal() + DELIVERY_FEE;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: savingAddress },
  } = useForm<AddressForm>({ resolver: zodResolver(addressSchema) });

  if (items.length === 0 && !orderId) {
    return (
      <div className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-4 py-32 text-center">
        <ShoppingBag className="mb-4 h-12 w-12 text-[#8b92a5]" />
        <h1 className="mb-2 text-2xl font-bold text-white">Your cart is empty</h1>
        <button
          onClick={() => router.push("/shop")}
          className="mt-4 rounded-xl bg-[#f5a623] px-6 py-3 text-sm font-bold text-[#0a0e1a] hover:bg-[#ff9f1c]"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const selectedAddress = selectedAddressId
    ? addresses?.find((a) => a._id === selectedAddressId)
    : null;

  const handleSaveNewAddress = async (data: AddressForm) => {
    const { notes: _notes, ...addressData } = data;
    const id = await addAddress({ ...addressData, isDefault: !addresses?.length });
    setSelectedAddressId(id);
    setShowNewAddressForm(false);
    reset();
  };

  const handleProceedToReview = () => {
    if (!selectedAddressId) {
      setError("Please select or add a delivery address.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleCreateOrder = async () => {
    setError(null);
    if (!selectedAddress) {
      setError("No address selected.");
      return;
    }
    try {
      const result = await createOrder({
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
          condition: i.condition,
        })),
        subtotal: subtotal(),
        deliveryFee: DELIVERY_FEE,
        total,
        address: {
          name: selectedAddress.name,
          phone: selectedAddress.phone,
          street: selectedAddress.street,
          city: selectedAddress.city,
        },
        paymentMethod: "mpesa" as const,
      });
      setOrderId(result.orderId);
      setOrderNumber(result.orderNumber);
      setStep(3);
    } catch {
      setError("Could not create order. Please try again.");
    }
  };

  const handlePay = async () => {
    if (!orderId || !orderNumber) return;
    setError(null);

    if (!mpesaPhone.trim()) {
      setError("Enter your M-Pesa phone number.");
      return;
    }
    setPaying(true);
    try {
      const res = await fetch("/api/mpesa/stk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mpesaPhone, amount: total, orderId, orderNumber }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        messageReference?: string;
        error?: string;
      };
      if (!res.ok || !data.success) throw new Error(data.error ?? "STK push failed");
      setMessageReference(data.messageReference ?? null);
      setStkSent(true);
      setPaying(false);
      pollPaymentStatus(data.messageReference!);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setPaying(false);
    }
  };

  const pollPaymentStatus = (ref: string) => {
    setPolling(true);
    let attempts = 0;
    const MAX_ATTEMPTS = 24; // 2 min at 5s intervals

    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch("/api/mpesa/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messageReference: ref }),
        });
        const data = (await res.json()) as { status: "pending" | "paid" | "failed" };

        if (data.status === "paid") {
          clearInterval(interval);
          setPolling(false);
          clearCart();
          router.push(`/order/${orderId}`);
        } else if (data.status === "failed") {
          clearInterval(interval);
          setPolling(false);
          setStkSent(false);
          setError("Payment failed or was cancelled. Please try again.");
        } else if (attempts >= MAX_ATTEMPTS) {
          clearInterval(interval);
          setPolling(false);
          setError("Payment confirmation is taking too long. If you completed the payment, please contact us.");
        }
      } catch {
        // silent — keep polling
      }
    }, 5000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      {/* Progress */}
      <div className="mb-10 flex items-center justify-center">
        {STEPS.map((s, i) => {
          const done = step > s.n;
          const active = step === s.n;
          return (
            <div key={s.n} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${done ? "border-[#f5a623] bg-[#f5a623] text-[#0a0e1a]" : active ? "border-[#f5a623] bg-transparent text-[#f5a623]" : "border-[#1e2435] bg-transparent text-[#8b92a5]"}`}
                >
                  {done ? <CheckCircle className="h-4 w-4" /> : <s.Icon className="h-4 w-4" />}
                </div>
                <span
                  className={`text-xs font-medium ${active ? "text-[#f5a623]" : done ? "text-white" : "text-[#8b92a5]"}`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`mb-5 h-px w-16 sm:w-24 ${step > s.n ? "bg-[#f5a623]" : "bg-[#1e2435]"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <h2
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Delivery address
          </h2>

          {addresses && addresses.length > 0 && (
            <div className="flex flex-col gap-3">
              {addresses.map((addr) => (
                <button
                  key={addr._id}
                  onClick={() => {
                    setSelectedAddressId(addr._id);
                    setShowNewAddressForm(false);
                  }}
                  className={`rounded-xl border p-4 text-left transition ${selectedAddressId === addr._id ? "border-[#f5a623] bg-[#f5a623]/5" : "border-[#1e2435] bg-[#0d1117] hover:border-[#f5a623]/40"}`}
                >
                  <p className="font-semibold text-white">{addr.name}</p>
                  <p className="mt-0.5 text-sm text-[#8b92a5]">
                    {addr.street}, {addr.city}
                  </p>
                  <p className="text-sm text-[#8b92a5]">{addr.phone}</p>
                  {addr.isDefault && (
                    <span className="mt-1 inline-block text-xs text-[#f5a623]">Default</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {!showNewAddressForm ? (
            <button
              onClick={() => {
                setShowNewAddressForm(true);
                setSelectedAddressId(null);
              }}
              className="flex items-center gap-2 rounded-xl border border-dashed border-[#1e2435] p-4 text-sm text-[#8b92a5] transition hover:border-[#f5a623]/40 hover:text-white"
            >
              <Plus className="h-4 w-4" /> Add new address
            </button>
          ) : (
            <form
              onSubmit={handleSubmit(handleSaveNewAddress)}
              className="flex flex-col gap-4 rounded-xl border border-[#1e2435] bg-[#0d1117] p-5"
            >
              <h3 className="font-semibold text-white">New address</h3>
              {(
                [
                  { field: "name", label: "Full name", placeholder: "Jane Doe" },
                  { field: "phone", label: "Phone number", placeholder: "0712 345 678" },
                  { field: "street", label: "Street address", placeholder: "123 Accra Road" },
                  { field: "city", label: "City", placeholder: "Nairobi" },
                  {
                    field: "notes",
                    label: "Delivery notes (optional)",
                    placeholder: "e.g. near the blue gate",
                  },
                ] as { field: keyof AddressForm; label: string; placeholder: string }[]
              ).map(({ field, label, placeholder }) => (
                <div key={field}>
                  <label className="mb-1.5 block text-xs font-medium text-[#8b92a5]">{label}</label>
                  <input
                    {...register(field)}
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-[#1e2435] bg-[#0a0e1a] px-4 py-2.5 text-sm text-white placeholder-[#8b92a5] transition outline-none focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]"
                  />
                  {errors[field] && (
                    <p className="mt-1 text-xs text-red-400">{errors[field]?.message}</p>
                  )}
                </div>
              ))}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewAddressForm(false);
                    reset();
                  }}
                  className="flex-1 rounded-xl border border-[#1e2435] py-2.5 text-sm text-[#8b92a5] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAddress}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#f5a623] py-2.5 text-sm font-bold text-[#0a0e1a] hover:bg-[#ff9f1c] disabled:opacity-60"
                >
                  {savingAddress && <Loader2 className="h-4 w-4 animate-spin" />} Save address
                </button>
              </div>
            </form>
          )}

          {error && (
            <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-xs text-red-400">{error}</p>
          )}

          <button
            onClick={handleProceedToReview}
            disabled={!selectedAddressId}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#f5a623] py-3 text-sm font-bold text-[#0a0e1a] hover:bg-[#ff9f1c] hover:shadow-[0_0_20px_rgba(245,166,35,0.35)] disabled:opacity-50"
          >
            Continue to review <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="flex flex-col gap-5">
          <h2
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Order review
          </h2>

          <div className="overflow-hidden rounded-2xl border border-[#1e2435] bg-[#0d1117]">
            <div className="border-b border-[#1e2435] px-5 py-3">
              <span className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
                Items
              </span>
            </div>
            <div className="divide-y divide-[#1e2435] px-5">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 py-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs text-[#8b92a5]">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {selectedAddress && (
            <div className="rounded-2xl border border-[#1e2435] bg-[#0d1117] p-5">
              <p className="mb-2 text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
                Delivery to
              </p>
              <p className="font-semibold text-white">{selectedAddress.name}</p>
              <p className="text-sm text-[#8b92a5]">
                {selectedAddress.street}, {selectedAddress.city}
              </p>
              <p className="text-sm text-[#8b92a5]">{selectedAddress.phone}</p>
            </div>
          )}

          <div className="rounded-2xl border border-[#1e2435] bg-[#0d1117] p-5">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-[#8b92a5]">Subtotal</span>
              <span className="text-white">KES {subtotal().toLocaleString()}</span>
            </div>
            <div className="mb-3 flex justify-between text-sm">
              <span className="text-[#8b92a5]">Delivery</span>
              <span className="text-white">KES {DELIVERY_FEE.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-[#1e2435] pt-3">
              <span className="font-bold text-white">Total</span>
              <span className="text-xl font-bold text-[#f5a623]">KES {total.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#1e2435] bg-[#0d1117] px-4 py-3">
            <span className="text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">Payment</span>
            <span className="ml-auto text-sm font-medium text-white">M-Pesa</span>
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-xs text-red-400">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 rounded-xl border border-[#1e2435] py-3 text-sm text-[#8b92a5] hover:text-white"
            >
              Back
            </button>
            <button
              onClick={handleCreateOrder}
              className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-[#f5a623] py-3 text-sm font-bold text-[#0a0e1a] hover:bg-[#ff9f1c] hover:shadow-[0_0_20px_rgba(245,166,35,0.35)]"
            >
              Proceed to payment <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f5a623]/10">
            <CreditCard className="h-8 w-8 text-[#f5a623]" />
          </div>
          <div>
            <h2
              className="text-xl font-bold text-white"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Complete payment
            </h2>
            <p className="mt-1 text-sm text-[#8b92a5]">
              Order <span className="font-medium text-white">{orderNumber}</span> · KES{" "}
              {total.toLocaleString()}
            </p>
          </div>

          <div className="w-full rounded-2xl border border-[#1e2435] bg-[#0d1117] p-5 text-left">
            <p className="mb-3 text-xs font-semibold tracking-widest text-[#8b92a5] uppercase">
              Summary
            </p>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-[#8b92a5]">Payment via</span>
              <span className="font-medium text-white">M-Pesa</span>
            </div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-[#8b92a5]">Items</span>
              <span className="text-white">{items.reduce((s, i) => s + i.quantity, 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8b92a5]">Total</span>
              <span className="font-bold text-[#f5a623]">KES {total.toLocaleString()}</span>
            </div>
          </div>

          {/* M-Pesa phone input */}
          {!stkSent && (
            <div className="w-full">
              <label className="mb-1.5 block text-left text-xs font-medium text-[#8b92a5]">
                M-Pesa phone number
              </label>
              <div className="relative">
                <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#8b92a5]" />
                <input
                  type="tel"
                  value={mpesaPhone}
                  onChange={(e) => setMpesaPhone(e.target.value)}
                  placeholder="07XX XXX XXX"
                  className="w-full rounded-xl border border-[#1e2435] bg-[#0a0e1a] py-3 pr-4 pl-9 text-sm text-white placeholder-[#8b92a5] outline-none transition focus:border-[#f5a623] focus:ring-1 focus:ring-[#f5a623]"
                />
              </div>
            </div>
          )}

          {/* STK Push sent — waiting for PIN */}
          {stkSent && (
            <div className="w-full rounded-2xl border border-[#f5a623]/20 bg-[#f5a623]/5 p-5 text-center">
              <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-[#f5a623]" />
              <p className="font-semibold text-white">Check your phone</p>
              <p className="mt-1 text-sm text-[#8b92a5]">
                An M-Pesa prompt has been sent to <span className="text-white">{mpesaPhone}</span>.
                Enter your PIN to complete the payment.
              </p>
              {polling && (
                <p className="mt-3 text-xs text-[#8b92a5]">Waiting for confirmation…</p>
              )}
            </div>
          )}

          {error && (
            <p className="w-full rounded-lg bg-red-500/10 px-4 py-2.5 text-xs text-red-400">
              {error}
            </p>
          )}

          {!stkSent && (
            <button
              onClick={handlePay}
              disabled={paying}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f5a623] py-3 text-sm font-bold text-[#0a0e1a] hover:bg-[#ff9f1c] hover:shadow-[0_0_20px_rgba(245,166,35,0.35)] disabled:opacity-60"
            >
              {paying && <Loader2 className="h-4 w-4 animate-spin" />}
              Send M-Pesa Prompt
            </button>
          )}
          <p className="text-xs text-[#8b92a5]">Secured by Co-op Bank · M-Pesa STK Push</p>
        </div>
      )}
    </div>
  );
}
