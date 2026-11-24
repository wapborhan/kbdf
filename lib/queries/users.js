import { connectDB } from "../db";
import User from "@/models/User";
import { buildSearchQuery, runQuery } from "./utils";

/**
 * List registered users for admin/moderator dashboard
 */
export async function listUsers({ q, filter: userFilter, page, per = 10 }) {
  await connectDB();

  const filter = { ...buildSearchQuery(q, ["name", "email"]) };

  if (userFilter === "pending") {
    Object.assign(filter, {
      approved: { $ne: true },
      role: { $nin: ["admin", "moderator"] },
    });
  } else if (userFilter === "approved") {
    filter.$and = [
      { $or: [{ approved: true }, { role: { $in: ["admin", "moderator"] } }] },
    ];
  }

  return runQuery(User, filter, {
    page,
    per,
    sort: { createdAt: -1 },
  });
}
