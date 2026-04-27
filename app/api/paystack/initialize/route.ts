import { NextRequest, NextResponse } from "next/server";
import { initializeTransaction, generateReference } from "@/lib/paystack";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const token = await convexAuthNextjsToken();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      orderId: string;
      orderNumber: string;
      email: string;
      amount: number;
    };

    const { orderId, orderNumber, email, amount } = body;

    if (!orderId || !orderNumber || !email || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const reference = generateReference(orderNumber);

    const result = await initializeTransaction({
      email,
      amount: amount * 100, // KES to kobo
      currency: "KES",
      reference,
      metadata: { orderId, orderNumber },
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order/${orderId}?reference=${reference}`,
    });

    if (!result.status) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    // Store reference on the order
    await convex.mutation(api.orders.updatePaymentStatus, {
      id: orderId as Id<"orders">,
      paymentStatus: "pending",
      paystackReference: reference,
    });

    return NextResponse.json({
      accessCode: result.data.access_code,
      reference: result.data.reference,
      authorizationUrl: result.data.authorization_url,
    });
  } catch (err) {
    console.error("[paystack/initialize]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
