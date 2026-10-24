import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { serializeUser as serialize } from "@/lib/serialize";
import { profileSchema, PROFESSION_FIELDS } from "@/lib/validators";
import { clean } from "@/lib/utils";

// Works for unapproved users too (they must be able to complete their profile and see the waiting screen).
export async function GET(req) {
  const u = await getSessionUser(req);
  return u ? NextResponse.json({ user: serialize(u) }) : NextResponse.json({ error: "লগইন করুন" }, { status: 401 });
}
export async function PUT(req) {
  const u = await getSessionUser(req);
  if (!u) return NextResponse.json({ error: "লগইন করুন" }, { status: 401 });
  const p = profileSchema.safeParse(clean(await req.json().catch(() => ({}))));
  if (!p.success) return NextResponse.json({ error: p.error.issues[0]?.message || "তথ্য সঠিক নয়" }, { status: 400 });
  await connectDB();
  const d = p.data, keep = PROFESSION_FIELDS[d.profession];
  for (const f of Object.values(PROFESSION_FIELDS).flat()) if (!keep.includes(f)) delete d[f];
  u.profile = d; u.profileComplete = true; u.name = d.fullName;
  await u.save();
  return NextResponse.json({ user: serialize(u) });
}
