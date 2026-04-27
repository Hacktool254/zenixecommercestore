import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface PaystackEvent {
  event: string;
  data: {
    reference: string;
    status: string;
    metadata?: {
      orderId?: string;
    };
  };
}

export async function POST(request: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY ?? "";
  const signature = request.headers.get("x-paystack-signature") ?? "";

  const body = await request.text();

  // Verify HMAC signature
  const hash = createHmac("sha512", secret).update(body).digest("hex");
  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: PaystackEvent;
  try {
    event = JSON.parse(body) as PaystackEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const orderId = event.data.metadata?.orderId;
  if (!orderId) {
    return NextResponse.json({ received: true });
  }

  if (event.event === "charge.success") {
    await convex.mutation(api.orders.updatePaymentStatus, {
      id: orderId as Id<"orders">,
      paymentStatus: "paid",
      paystackReference: event.data.reference,
    });
  } else if (event.event === "charge.failed") {
    await convex.mutation(api.orders.updatePaymentStatus, {
      id: orderId as Id<"orders">,
      paymentStatus: "failed",
      paystackReference: event.data.reference,
    });
  }

  return NextResponse.json({ received: true });
}
