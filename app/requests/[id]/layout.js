import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import BloodRequest from "@/models/BloodRequest";
import { pageMeta } from "@/lib/seo";
// Patient name is deliberately left out of the page title/description.
export async function generateMetadata({ params }) {
  try {
    if (mongoose.isValidObjectId(params.id)) {
      await connectDB();
      const r = await BloodRequest.findOne({ _id: params.id, status: { $in: ["approved", "fulfilled"] } }).select("bloodGroup hospital upazila units").lean();
      if (r) return pageMeta(`${r.bloodGroup} রক্ত প্রয়োজন — ${r.hospital}, ${r.upazila}`, `${r.upazila}-এর ${r.hospital}-এ ${r.units} ব্যাগ ${r.bloodGroup} রক্তের প্রয়োজন।`, `/requests/${params.id}`);
    }
  } catch {}
  return { title: "রক্তের আবেদন", robots: { index: false } };
}
export default function Layout({ children }) { return children; }
