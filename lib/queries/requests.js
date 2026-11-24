import mongoose from "mongoose";
import { connectDB } from "../db";
import { BLOOD_GROUPS, UPAZILAS, REQUEST_STATUSES } from "../constants";
import BloodRequest from "@/models/BloodRequest";
import { buildSearchQuery, validateInList, runQuery, plain } from "./utils";

/**
 * List blood requests with search, group, upazila, and status filters
 */
export async function listRequests({
  q,
  bloodGroup,
  upazila,
  status,
  page,
  per = 10,
  publicOnly = false,
}) {
  await connectDB();

  const searchFields = publicOnly
    ? ["patientName", "hospital"]
    : ["patientName", "hospital", "contactPhone"];

  const filter = { ...buildSearchQuery(q, searchFields) };

  if (publicOnly) {
    filter.status = "approved";
  } else if (validateInList(status, REQUEST_STATUSES)) {
    filter.status = status;
  }

  if (validateInList(bloodGroup, BLOOD_GROUPS)) {
    filter.bloodGroup = bloodGroup;
  }

  if (validateInList(upazila, UPAZILAS)) {
    filter.upazila = upazila;
  }

  return runQuery(BloodRequest, filter, {
    page,
    per,
    sort: publicOnly ? { neededBy: 1 } : { createdAt: -1 },
    select: publicOnly ? "-contactPhone -createdBy -createdByName" : "",
  });
}

/**
 * Get a single public blood request safely by ID
 */
export async function getRequestPublic(id) {
  if (!id || !mongoose.isValidObjectId(id)) {
    return null;
  }

  await connectDB();

  const request = await BloodRequest.findOne({
    _id: id,
    status: { $in: ["approved", "fulfilled"] },
  })
    .select("-createdBy -createdByName")
    .lean();

  if (!request) return null;

  // Mask contact phone number if already fulfilled
  if (request.status === "fulfilled") {
    delete request.contactPhone;
  }

  return plain(request);
}
