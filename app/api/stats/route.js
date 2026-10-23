import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Donor from "@/models/Donor";
import BloodRequest from "@/models/BloodRequest";
export async function GET() {
  try {
    await connectDB();
    const [donors, fulfilled, open] = await Promise.all([
      Donor.countDocuments({ status: "active" }),
      BloodRequest.countDocuments({ status: "fulfilled" }),
      BloodRequest.countDocuments({ status: "approved" }),
    ]);
    return NextResponse.json({ donors, fulfilled, open });
  } catch { return NextResponse.json({ donors: 0, fulfilled: 0, open: 0 }); }
}
