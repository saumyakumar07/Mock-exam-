import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const url = new URL("/admin", req.url);
  const res = NextResponse.redirect(url, { status: 303 });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
