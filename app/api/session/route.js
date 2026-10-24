import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
const MAX = 5 * 24 * 60 * 60; // seconds
// Exchanges a Google-signed Firebase ID token for an httpOnly session cookie, so server components know the user.
export async function POST(req) {
  try {
    const { idToken } = await req.json();
    const a = adminAuth();
    const dec = await a.verifyIdToken(idToken);
    if (dec.firebase?.sign_in_provider !== "google.com") return NextResponse.json({ error: "অনুমতি নেই" }, { status: 401 });
    const cookie = await a.createSessionCookie(idToken, { expiresIn: MAX * 1000 });
    const res = NextResponse.json({ ok: true });
    res.cookies.set("__session", cookie, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: MAX });
    return res;
  } catch { return NextResponse.json({ error: "সেশন তৈরি ব্যর্থ" }, { status: 401 }); }
}
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("__session", "", { path: "/", maxAge: 0 });
  return res;
}
