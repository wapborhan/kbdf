import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import BloodRequest from "@/models/BloodRequest";
import { requestSchema } from "@/lib/validators";

export async function GET() {
  try {
    await connectDB();
    const requests = await BloodRequest.find({ status: "approved" }).select("-contactPhone").sort({ neededBy: 1 }).limit(50).lean();
    return NextResponse.json({ requests });
  } catch { return NextResponse.json({ error: "সার্ভার ত্রুটি" }, { status: 500 }); }
}

export async function POST(req) {
  try {
    const parsed = requestSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    await connectDB();
    await BloodRequest.create({ ...parsed.data, status: "pending" });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch { return NextResponse.json({ error: "সার্ভার ত্রুটি" }, { status: 500 }); }
}
