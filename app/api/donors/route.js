import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Donor from "@/models/Donor";
import { donorSchema } from "@/lib/validators";

// Public listing: only active donors, contact fields limited to what the directory needs.
export async function GET(req) {
  try {
    await connectDB();
    const sp = new URL(req.url).searchParams;
    const q = { status: "active" };
    if (sp.get("bloodGroup")) q.bloodGroup = sp.get("bloodGroup");
    if (sp.get("upazila")) q.upazila = sp.get("upazila");
    const donors = await Donor.find(q).select("name bloodGroup upazila phone facebookUrl photoUrl lastDonationDate").sort({ updatedAt: -1 }).limit(50).lean();
    return NextResponse.json({ donors });
  } catch (e) {
    return NextResponse.json({ error: "সার্ভার ত্রুটি" }, { status: 500 });
  }
}

// Public registration -> saved as "pending" until an admin approves.
export async function POST(req) {
  try {
    const parsed = donorSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    await connectDB();
    const d = parsed.data;
    const or = [{ phone: d.phone }];
    if (d.email) or.push({ email: d.email });
    if (await Donor.exists({ $or: or })) return NextResponse.json({ error: "এই ফোন/ইমেইল আগে থেকেই নিবন্ধিত" }, { status: 409 });
    if (!d.email) delete d.email;
    await Donor.create({ ...d, status: "pending" });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "সার্ভার ত্রুটি" }, { status: 500 });
  }
}
