import { connectDB } from "./db";
import User from "@/models/User";
import BloodRequest from "@/models/BloodRequest";

// Public list: approved volunteers who ticked the consent box. Only name, photo, join date and a count are exposed.
export async function getVolunteers(limit = 0) {
  await connectDB();
  const users = await User.find({ role: "volunteer", approved: true, "profile.publicConsent": true }).select("name photoUrl profile.fullName createdAt").lean();
  if (!users.length) return [];
  const rows = await BloodRequest.aggregate([
    { $match: { createdBy: { $in: users.map((u) => u._id) }, status: { $in: ["approved", "fulfilled"] } } },
    { $group: { _id: "$createdBy", n: { $sum: 1 } } },
  ]);
  const counts = Object.fromEntries(rows.map((r) => [String(r._id), r.n]));
  const list = users.map((u) => ({
    id: String(u._id), name: u.profile?.fullName || u.name || "স্বেচ্ছাসেবক", photoUrl: u.photoUrl || "",
    since: u.createdAt ? new Date(u.createdAt).toISOString() : "", helped: counts[String(u._id)] || 0,
  })).sort((a, b) => b.helped - a.helped || a.since.localeCompare(b.since));
  return limit ? list.slice(0, limit) : list;
}
