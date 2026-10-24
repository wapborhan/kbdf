import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { requireStaff, requireAdmin, requireWriter } from "@/lib/auth";
import { REQUEST_STATUSES } from "@/lib/constants";
import { ROLES, isStaff } from "@/lib/permissions";
import { donorSchema, requestSchema } from "@/lib/validators";
import { clean } from "@/lib/utils";
import Donor from "@/models/Donor";
import BloodRequest from "@/models/BloodRequest";
import User from "@/models/User";

const cfg = {
  donors: { M: Donor, schema: donorSchema, statuses: ["pending", "active", "inactive"], optional: ["email", "address", "note", "facebookUrl", "photoUrl", "lastDonationDate"] },
  requests: { M: BloodRequest, schema: requestSchema, statuses: REQUEST_STATUSES, optional: ["note"] },
};
const err = (m, s) => NextResponse.json({ error: m }, { status: s });
const ok = (x = {}) => NextResponse.json({ ok: true, ...x });

export async function PATCH(req, { params }) {
  const { kind, id } = params;
  if (!mongoose.isValidObjectId(id)) return err("পাওয়া যায়নি", 404);
  const body = await req.json().catch(() => ({}));

  if (kind === "users") {
    const approval = body.field === "approved"; // approve/revoke: staff | change role: admin ONLY
    const a = approval ? await requireStaff(req) : await requireAdmin(req);
    if (a.error) return err(a.error.message, a.error.status);
    if (String(a.user._id) === id) return err("নিজের অ্যাকাউন্ট পরিবর্তন করা যাবে না", 400);
    await connectDB();
    const t = await User.findById(id);
    if (!t) return err("পাওয়া যায়নি", 404);
    if (approval) {
      if (typeof body.value !== "boolean") return err("অবৈধ মান", 400);
      if (t.role === "admin" && a.user.role !== "admin") return err("অনুমতি নেই", 403);
      t.approved = body.value;
    } else {
      if (!ROLES.includes(body.value)) return err("অবৈধ মান", 400);
      t.role = body.value;
      if (isStaff(body.value)) t.approved = true;
    }
    await t.save();
    return ok();
  }

  const c = cfg[kind];
  if (!c || !c.statuses.includes(body.value)) return err("অবৈধ মান", 400);
  const a = await requireStaff(req);
  if (a.error) return err(a.error.message, a.error.status);
  await connectDB();
  return (await c.M.findByIdAndUpdate(id, { status: body.value })) ? ok() : err("পাওয়া যায়নি", 404);
}

// Edit: donors = staff. requests = staff, or a volunteer on their OWN request (which then goes back to "pending").
export async function PUT(req, { params }) {
  const { kind, id } = params;
  const c = cfg[kind];
  if (!c || !mongoose.isValidObjectId(id)) return err("পাওয়া যায়নি", 404);
  const a = kind === "donors" ? await requireStaff(req) : await requireWriter(req);
  if (a.error) return err(a.error.message, a.error.status);
  const p = c.schema.safeParse(clean(await req.json().catch(() => ({}))));
  if (!p.success) return err("তথ্য সঠিক নয়", 400);
  await connectDB();
  const d = p.data;
  let extra = {};
  if (kind === "requests" && a.user.role === "volunteer") {
    const cur = await BloodRequest.findById(id).select("createdBy");
    if (!cur) return err("পাওয়া যায়নি", 404);
    if (String(cur.createdBy) !== String(a.user._id)) return err("শুধু নিজের যোগ করা আবেদন সম্পাদনা করতে পারবেন", 403);
    extra = { status: "pending" };
  }
  if (kind === "donors") {
    const or = [{ phone: d.phone }]; if (d.email) or.push({ email: d.email });
    if (await Donor.exists({ _id: { $ne: id }, $or: or })) return err("এই ফোন/ইমেইল আগে থেকেই আছে", 409);
  }
  const $unset = Object.fromEntries(c.optional.filter((k) => !(k in d)).map((k) => [k, 1]));
  const doc = await c.M.findByIdAndUpdate(id, { $set: { ...d, ...extra }, ...(Object.keys($unset).length && { $unset }) });
  return doc ? ok({ pending: !!extra.status }) : err("পাওয়া যায়নি", 404);
}

export async function DELETE(req, { params }) {
  const c = cfg[params.kind];
  if (!c || !mongoose.isValidObjectId(params.id)) return err("পাওয়া যায়নি", 404);
  const a = await requireStaff(req);
  if (a.error) return err(a.error.message, a.error.status);
  await connectDB();
  await c.M.findByIdAndDelete(params.id);
  return ok();
}
