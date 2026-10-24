import { connectDB } from "./db";
import { BLOOD_GROUPS, UPAZILAS, REQUEST_STATUSES } from "./constants";
import { isStaff } from "./permissions";
import Donor from "@/models/Donor";
import BloodRequest from "@/models/BloodRequest";
import User from "@/models/User";

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const plain = (x) => JSON.parse(JSON.stringify(x));
const first = (v) => (Array.isArray(v) ? v[0] : v) || "";
// URL search params -> clean filter object (values are validated again in each query)
export function readParams(sp = {}) {
  return Object.fromEntries(["q", "bloodGroup", "upazila", "status", "filter", "page"].map((k) => [k, String(first(sp[k])).slice(0, 60)]));
}
export const withoutPage = (f) => Object.fromEntries(Object.entries(f).filter(([k, v]) => v && k !== "page"));

async function run(M, filter, { page, per, sort, select }) {
  const total = await M.countDocuments(filter);
  const pages = Math.max(1, Math.ceil(total / per));
  const p = Math.min(Math.max(1, parseInt(page) || 1), pages);
  const items = await M.find(filter).select(select || "").sort(sort).skip((p - 1) * per).limit(per).lean();
  return { items: plain(items), total, page: p, pages };
}
const search = (q, fields) => q?.trim() ? { $or: fields.map((f) => ({ [f]: new RegExp(esc(q.trim()), "i") })) } : {};
const ok = (v, list) => (list.includes(v) ? v : undefined);

export async function listDonors({ q, bloodGroup, upazila, status, page, per = 12, publicOnly = false }) {
  await connectDB();
  const filter = { ...search(q, ["name", "phone"]) };
  if (publicOnly) filter.status = "active"; else if (ok(status, ["pending", "active", "inactive"])) filter.status = status;
  if (ok(bloodGroup, BLOOD_GROUPS)) filter.bloodGroup = bloodGroup;
  if (ok(upazila, UPAZILAS)) filter.upazila = upazila;
  return run(Donor, filter, { page, per, sort: { createdAt: -1 }, select: publicOnly ? "name bloodGroup upazila phone facebookUrl photoUrl lastDonationDate" : "" });
}
export async function listRequests({ q, bloodGroup, upazila, status, page, per = 10, publicOnly = false }) {
  await connectDB();
  const filter = { ...search(q, publicOnly ? ["patientName", "hospital"] : ["patientName", "hospital", "contactPhone"]) };
  if (publicOnly) filter.status = "approved"; else if (ok(status, REQUEST_STATUSES)) filter.status = status;
  if (ok(bloodGroup, BLOOD_GROUPS)) filter.bloodGroup = bloodGroup;
  if (ok(upazila, UPAZILAS)) filter.upazila = upazila;
  return run(BloodRequest, filter, { page, per, sort: publicOnly ? { neededBy: 1 } : { createdAt: -1 }, select: publicOnly ? "-contactPhone -createdBy -createdByName" : "" });
}
export async function listUsers({ q, filter: f, page, per = 10 }) {
  await connectDB();
  const filter = { ...search(q, ["name", "email"]) };
  if (f === "pending") Object.assign(filter, { approved: { $ne: true }, role: { $nin: ["admin", "moderator"] } });
  if (f === "approved") filter.$and = [{ $or: [{ approved: true }, { role: { $in: ["admin", "moderator"] } }] }];
  return run(User, filter, { page, per, sort: { createdAt: -1 } });
}
export async function getRequestPublic(id) {
  await connectDB();
  const r = await BloodRequest.findOne({ _id: id, status: { $in: ["approved", "fulfilled"] } }).select("-createdBy -createdByName").lean();
  if (!r) return null;
  if (r.status === "fulfilled") delete r.contactPhone;
  return plain(r);
}

const counts = (field, match = {}) => [{ $match: match }, { $group: { _id: field, n: { $sum: 1 } } }];
const toMap = (rows) => Object.fromEntries(rows.map((r) => [r._id, r.n]));
export async function getStats(role) {
  await connectDB();
  const staff = isStaff(role);
  const from = new Date(); from.setMonth(from.getMonth() - 5); from.setDate(1); from.setHours(0, 0, 0, 0);
  const [dStatus, rStatus, byGroup, byUpazila, monthly, recentRequests, recentDonors, users, pendingUsers] = await Promise.all([
    Donor.aggregate(counts("$status")), BloodRequest.aggregate(counts("$status")),
    Donor.aggregate(counts("$bloodGroup", { status: "active" })),
    Donor.aggregate([...counts("$upazila", { status: "active" }), { $sort: { n: -1 } }, { $limit: 6 }]),
    BloodRequest.aggregate([...counts({ $dateToString: { format: "%Y-%m", date: "$createdAt" } }, { createdAt: { $gte: from } }), { $sort: { _id: 1 } }]),
    BloodRequest.find().sort({ createdAt: -1 }).limit(5).lean(),
    Donor.find().sort({ createdAt: -1 }).limit(5).lean(),
    staff ? User.countDocuments() : null,
    staff ? User.countDocuments({ approved: { $ne: true }, role: { $nin: ["admin", "moderator"] } }) : null,
  ]);
  return { donors: toMap(dStatus), requests: toMap(rStatus), byGroup: toMap(byGroup), byUpazila: byUpazila.map((r) => [r._id, r.n]), monthly: monthly.map((r) => [r._id, r.n]), recentRequests, recentDonors, users, pendingUsers };
}
