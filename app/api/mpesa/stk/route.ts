import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const TOKEN_URL = "https://openapi.co-opbank.co.ke/token";
const STK_URL = "https://openapi.co-opbank.co.ke/FT/stk/1.0.0";

function getProxyConfig() {
  const fixieUrl = process.env.FIXIE_URL;
  if (!fixieUrl) return undefined;
  const parsed = new URL(fixieUrl);
  return {
    protocol: "http" as const,
    host: parsed.hostname,
    port: parseInt(parsed.port || "80"),
    auth: {
      username: parsed.username,
      password: parsed.password,
    },
  };
}

async function getToken(): Promise<string> {
  const key = process.env.COOPBANK_CONSUMER_KEY!;
  const secret = process.env.COOPBANK_CONSUMER_SECRET!;
  const credentials = Buffer.from(`${key}:${secret}`).toString("base64");

  const res = await axios.post(TOKEN_URL, "grant_type=client_credentials", {
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    proxy: getProxyConfig(),
  });

  return res.data.access_token as string;
}

export async function POST(request: NextRequest) {
  try {
    const { phone, amount, orderId, orderNumber } = (await request.json()) as {
      phone: string;
      amount: number;
      orderId: string;
      orderNumber: string;
    };

    if (!phone || !amount || !orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Normalize phone: strip spaces/+, ensure starts with 254
    const normalized = phone.replace(/\s+/g, "").replace(/^\+/, "").replace(/^0/, "254");
    if (!/^254\d{9}$/.test(normalized)) {
      return NextResponse.json(
        { error: "Invalid phone number. Use format 07XX XXX XXX or 254XXXXXXXXX." },
        { status: 400 }
      );
    }

    const token = await getToken();

    // Unique per-order reference (max 12 chars for Co-op)
    const messageReference = orderNumber.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12);

    const body = {
      MessageReference: messageReference,
      CallBackUrl: process.env.COOPBANK_CALLBACK_URL!,
      OperatorCode: process.env.COOPBANK_OPERATOR_CODE!,
      TransactionCurrency: "KES",
      MobileNumber: normalized,
      Narration: "ZENIX ELECTRONICS",
      Amount: amount,
      MessageDateTime: new Date().toISOString(),
      OtherDetails: [{ Name: "OrderId", Value: orderId }],
    };

    const stkRes = await axios.post(STK_URL, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      proxy: getProxyConfig(),
    });

    const stkData = stkRes.data as {
      ResponseCode?: string;
      ResponseMessage?: string;
      MessageReference?: string;
    };

    if (stkData.ResponseCode && stkData.ResponseCode !== "0") {
      return NextResponse.json(
        { error: stkData.ResponseMessage ?? "STK push failed" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      messageReference,
      message: "STK push sent. Check your phone and enter your M-Pesa PIN.",
    });
  } catch (err) {
    console.error("[mpesa/stk]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
