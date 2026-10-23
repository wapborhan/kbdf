import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import BloodRequest from "@/models/BloodRequest";
export async function GET(_req, { params }) {
  try {
    if (!mongoose.isValidObjectId(params.id)) return NextResponse.json({ error: "পাওয়া যায়নি" }, { status: 404 });
    await connectDB();
    const r = await BloodRequest.findOne({ _id: params.id, status: { $in: ["approved", "fulfilled"] } }).lean();
    if (!r) return NextResponse.json({ error: "পাওয়া যায়নি" }, { status: 404 });
    if (r.status === "fulfilled") delete r.contactPhone;
    return NextResponse.json({ request: r });
  } catch { return NextResponse.json({ error: "সার্ভার ত্রুটি" }, { status: 500 }); }
}
