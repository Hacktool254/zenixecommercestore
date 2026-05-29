import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface CoopCallbackBody {
  ResponseCode?: string;
  ResponseMessage?: string;
  MessageReference?: string;
  TransactionStatus?: string;
  OtherDetails?: { Name: string; Value: string }[];
}

export async function POST(request: NextRequest) {
  let body: CoopCallbackBody;
  try {
    body = (await request.json()) as CoopCallbackBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  console.log("[mpesa/callback]", JSON.stringify(body));

  // Extract orderId from OtherDetails
  const orderId = body.OtherDetails?.find((d) => d.Name === "OrderId")?.Value;
  if (!orderId) {
    return NextResponse.json({ received: true });
  }

  const status = (body.TransactionStatus ?? "").toLowerCase();
  const isSuccess = status === "success" || status === "completed" || body.ResponseCode === "0";
  const isFailed = status === "failed" || status === "cancelled" || status === "expired";

  if (isSuccess) {
    await convex.mutation(api.orders.updatePaymentStatus, {
      id: orderId as Id<"orders">,
      paymentStatus: "paid",
      paystackReference: body.MessageReference ?? "mpesa",
    });
  } else if (isFailed) {
    await convex.mutation(api.orders.updatePaymentStatus, {
      id: orderId as Id<"orders">,
      paymentStatus: "failed",
      paystackReference: body.MessageReference ?? "mpesa",
    });
  }

  return NextResponse.json({ received: true });
}
