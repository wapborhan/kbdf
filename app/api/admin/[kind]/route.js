import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireStaff, requireWriter } from "@/lib/auth";
import { donorSchema, requestSchema } from "@/lib/validators";
import { clean } from "@/lib/utils";
import Donor from "@/models/Donor";
import BloodRequest from "@/models/BloodRequest";

const err = (m, s) => NextResponse.json({ error: m }, { status: s });

// Create: donors = staff. requests = staff (live immediately) or volunteer (saved as pending until approved).
export async function POST(req, { params }) {
  const kind = params.kind;
  if (kind !== "donors" && kind !== "requests") return err("পাওয়া যায়নি", 404);
  const a = kind === "donors" ? await requireStaff(req) : await requireWriter(req);
  if (a.error) return err(a.error.message, a.error.status);
  try {
    const p = (kind === "donors" ? donorSchema : requestSchema).safeParse(clean(await req.json()));
    if (!p.success) return err("তথ্য সঠিক নয়", 400);
    await connectDB();
    const d = p.data;
    let pending = false;
    if (kind === "donors") {
      const or = [{ phone: d.phone }]; if (d.email) or.push({ email: d.email });
      if (await Donor.exists({ $or: or })) return err("এই ফোন/ইমেইল আগে থেকেই আছে", 409);
      await Donor.create({ ...d, status: "active" });
    } else {
      pending = a.user.role === "volunteer";
      await BloodRequest.create({ ...d, status: pending ? "pending" : "approved", createdBy: a.user._id, createdByName: a.user.name });
    }
    return NextResponse.json({ ok: true, pending }, { status: 201 });
  } catch { return err("সার্ভার ত্রুটি", 500); }
}
