import { NextRequest, NextResponse } from "next/server";
import { verifyTransaction } from "@/lib/paystack";
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

    const body = (await request.json()) as { reference: string; orderId: string };
    const { reference, orderId } = body;

    if (!reference || !orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await verifyTransaction(reference);

    if (!result.status) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    const paymentStatus = result.data.status === "success" ? "paid" : "failed";

    await convex.mutation(api.orders.updatePaymentStatus, {
      id: orderId as Id<"orders">,
      paymentStatus,
      paystackReference: reference,
    });

    return NextResponse.json({ status: result.data.status, paymentStatus });
  } catch (err) {
    console.error("[paystack/verify]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
