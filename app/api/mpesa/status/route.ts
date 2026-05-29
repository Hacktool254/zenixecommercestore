import { NextRequest, NextResponse } from "next/server";

const TOKEN_URL = "https://openapi.co-opbank.co.ke/token";
const STATUS_URL = "https://openapi.co-opbank.co.ke/Enquiry/STK/1.0.0/";

async function getToken(): Promise<string> {
  const key = process.env.COOPBANK_CONSUMER_KEY!;
  const secret = process.env.COOPBANK_CONSUMER_SECRET!;
  const credentials = Buffer.from(`${key}:${secret}`).toString("base64");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error(`Token fetch failed: ${res.status}`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const { messageReference } = (await request.json()) as { messageReference: string };

    if (!messageReference) {
      return NextResponse.json({ error: "Missing messageReference" }, { status: 400 });
    }

    const token = await getToken();

    const res = await fetch(STATUS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ MessageReference: messageReference }),
    });

    const data = (await res.json()) as {
      ResponseCode?: string;
      ResponseMessage?: string;
      // Co-op Bank status values
      TransactionStatus?: string;
    };

    // Map Co-op Bank status to our simplified status
    const raw = (data.TransactionStatus ?? "").toLowerCase();
    let status: "pending" | "paid" | "failed" = "pending";
    if (raw === "success" || raw === "completed" || data.ResponseCode === "0") {
      status = "paid";
    } else if (raw === "failed" || raw === "cancelled" || raw === "expired") {
      status = "failed";
    }

    return NextResponse.json({ status, raw: data });
  } catch (err) {
    console.error("[mpesa/status]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
