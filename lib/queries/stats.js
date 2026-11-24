import { connectDB } from "../db";
import { isStaff } from "../permissions";
import Donor from "@/models/Donor";
import BloodRequest from "@/models/BloodRequest";
import User from "@/models/User";
import { plain } from "./utils";

/**
 * Aggregate counts helper
 */
const buildCountAggregate = (field, matchCriteria = {}) => [
  { $match: matchCriteria },
  { $group: { _id: field, n: { $sum: 1 } } },
];

/**
 * Convert aggregate array results to map object { [key]: count }
 */
const toCountMap = (rows = []) =>
  Object.fromEntries(rows.map((row) => [row._id, row.n]));

/**
 * Dashboard stats: donors, requests, blood groups, upazilas, monthly trends
 */
export async function getStats(role) {
  await connectDB();
  const staff = isStaff(role);

  // Range for monthly trends (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const [
    donorStatuses,
    requestStatuses,
    groupCounts,
    upazilaCounts,
    monthlyRequests,
    recentRequests,
    recentDonors,
    totalUsers,
    pendingUsers,
  ] = await Promise.all([
    Donor.aggregate(buildCountAggregate("$status")),
    BloodRequest.aggregate(buildCountAggregate("$status")),
    Donor.aggregate(buildCountAggregate("$bloodGroup", { status: "active" })),
    Donor.aggregate([
      ...buildCountAggregate("$upazila", { status: "active" }),
      { $sort: { n: -1 } },
      { $limit: 6 },
    ]),
    BloodRequest.aggregate([
      ...buildCountAggregate(
        { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        { createdAt: { $gte: sixMonthsAgo } }
      ),
      { $sort: { _id: 1 } },
    ]),
    BloodRequest.find().sort({ createdAt: -1 }).limit(5).lean(),
    Donor.find().sort({ createdAt: -1 }).limit(5).lean(),
    staff ? User.countDocuments() : null,
    staff
      ? User.countDocuments({
          approved: { $ne: true },
          role: { $nin: ["admin", "moderator"] },
        })
      : null,
  ]);

  return {
    donors: toCountMap(donorStatuses),
    requests: toCountMap(requestStatuses),
    byGroup: toCountMap(groupCounts),
    byUpazila: upazilaCounts.map((row) => [row._id, row.n]),
    monthly: monthlyRequests.map((row) => [row._id, row.n]),
    recentRequests: plain(recentRequests),
    recentDonors: plain(recentDonors),
    users: totalUsers,
    pendingUsers,
  };
}
