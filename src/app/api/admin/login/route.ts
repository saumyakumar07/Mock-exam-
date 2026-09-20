import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD;

  const url = new URL("/admin", req.url);
  if (!expected || password !== expected) {
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, { status: 303 });
  }

  const res = NextResponse.redirect(url, { status: 303 });
  res.cookies.set(ADMIN_COOKIE, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
