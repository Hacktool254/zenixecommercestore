import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const TOKEN_URL = "https://openapi.co-opbank.co.ke/token";
const STATUS_URL = "https://openapi.co-opbank.co.ke/Enquiry/STK/1.0.0/";

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
    const { messageReference } = (await request.json()) as { messageReference: string };

    if (!messageReference) {
      return NextResponse.json({ error: "Missing messageReference" }, { status: 400 });
    }

    const token = await getToken();

    const res = await axios.post(
      STATUS_URL,
      { MessageReference: messageReference },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        proxy: getProxyConfig(),
      }
    );

    const data = res.data as {
      ResponseCode?: string;
      ResponseMessage?: string;
      TransactionStatus?: string;
    };

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
