"use client";

export default function CheckoutPage() {
  return (
    <>
      <div className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-4 py-32 text-center md:px-6">
        <p className="mb-2 text-xs font-semibold tracking-widest text-[#f5a623] uppercase">
          Coming Soon
        </p>
        <h1
          className="mb-3 text-3xl font-bold text-white"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Checkout
        </h1>
        <p className="text-sm text-[#8b92a5]">
          Secure M-Pesa & card checkout is being set up. Check back soon.
        </p>
      </div>
    </>
  );
}
