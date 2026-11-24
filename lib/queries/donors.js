import { connectDB } from "../db";
import { BLOOD_GROUPS, UPAZILAS } from "../constants";
import Donor from "@/models/Donor";
import { buildSearchQuery, validateInList, runQuery } from "./utils";

/**
 * List blood donors with optional search, group, upazila, and status filters
 */
export async function listDonors({
  q,
  bloodGroup,
  upazila,
  status,
  page,
  per = 12,
  publicOnly = false,
}) {
  await connectDB();

  const filter = { ...buildSearchQuery(q, ["name", "phone"]) };

  if (publicOnly) {
    filter.status = "active";
  } else if (validateInList(status, ["pending", "active", "inactive"])) {
    filter.status = status;
  }

  if (validateInList(bloodGroup, BLOOD_GROUPS)) {
    filter.bloodGroup = bloodGroup;
  }

  if (validateInList(upazila, UPAZILAS)) {
    filter.upazila = upazila;
  }

  return runQuery(Donor, filter, {
    page,
    per,
    sort: { createdAt: -1 },
    select: publicOnly
      ? "name bloodGroup upazila phone facebookUrl photoUrl lastDonationDate"
      : "",
  });
}
