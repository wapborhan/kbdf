import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import BloodRequest from "@/models/BloodRequest";
import { requestSchema } from "@/lib/validators";

// Public: approved requests (contact hidden). ?mine=1 + login: the signed-in user's own requests, any status.
export async function GET(req) {
  try {
    await connectDB();
    if (new URL(req.url).searchParams.get("mine")) {
      const u = await getSessionUser(req);
      if (!u) return NextResponse.json({ error: "লগইন করুন" }, { status: 401 });
      return NextResponse.json({ requests: await BloodRequest.find({ createdBy: u._id }).sort({ createdAt: -1 }).limit(50).lean() });
    }
    const requests = await BloodRequest.find({ status: "approved" }).select("-contactPhone -createdBy -createdByName").sort({ neededBy: 1 }).limit(50).lean();
    return NextResponse.json({ requests });
  } catch { return NextResponse.json({ error: "সার্ভার ত্রুটি" }, { status: 500 }); }
}

// Anyone can apply (saved as "pending" until an admin/moderator approves). If signed in, the request is linked to the account.
export async function POST(req) {
  try {
    const parsed = requestSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "তথ্য সঠিক নয়" }, { status: 400 });
    await connectDB();
    const u = await getSessionUser(req);
    await BloodRequest.create({ ...parsed.data, status: "pending", ...(u && { createdBy: u._id, createdByName: u.name }) });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch { return NextResponse.json({ error: "সার্ভার ত্রুটি" }, { status: 500 }); }
}
