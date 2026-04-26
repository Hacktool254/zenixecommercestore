import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  const token = await convexAuthNextjsToken();
  return NextResponse.json({ token });
}
