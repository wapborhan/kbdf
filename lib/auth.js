import { adminAuth } from "./firebaseAdmin";
import { connectDB } from "./db";
import { cookies } from "next/headers";
import User from "@/models/User";
import { isStaff, canWriteRequests, isApproved } from "./permissions";

const adminEmails = () => (process.env.ADMIN_EMAILS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

// Finds/creates the DB user for a verified Google token. New accounts: role "user", NOT approved.
async function userFromDecoded(dec) {
  if (dec.firebase?.sign_in_provider !== "google.com") return null;
  await connectDB();
  const email = (dec.email || "").toLowerCase();
  const envAdmin = !!dec.email_verified && adminEmails().includes(email);
  let u = await User.findOne({ uid: dec.uid });
  if (!u) u = await User.create({ uid: dec.uid, email, name: dec.name || email, photoUrl: dec.picture, role: envAdmin ? "admin" : "user", approved: envAdmin });
  else if (envAdmin && (u.role !== "admin" || !u.approved)) { u.role = "admin"; u.approved = true; await u.save(); }
  return u;
}
// API routes: "Authorization: Bearer <Firebase ID token>" (header only, so no CSRF surface).
export async function getSessionUser(req) {
  const h = req.headers.get("authorization") || "";
  if (!h.startsWith("Bearer ")) return null;
  try { return await userFromDecoded(await adminAuth().verifyIdToken(h.slice(7))); } catch { return null; }
}
// Server components: httpOnly session cookie created by /api/session.
export async function getServerUser() {
  try {
    const c = (await cookies()).get("__session")?.value;
    return c ? await userFromDecoded(await adminAuth().verifySessionCookie(c)) : null;
  } catch { return null; }
}
// The user, only if they may see dashboard data (approved + profile done unless staff). Every dashboard page re-checks this.
export async function getDashboardUser() {
  const u = await getServerUser();
  return u && isApproved(u) && (isStaff(u.role) || u.profileComplete) ? u : null;
}
async function guard(req, ok) {
  const u = await getSessionUser(req);
  if (!u) return { error: { status: 401, message: "লগইন করুন" } };
  if (!isApproved(u)) return { error: { status: 403, message: "আপনার অ্যাকাউন্ট অনুমোদনের অপেক্ষায় আছে" } };
  if (!ok(u.role)) return { error: { status: 403, message: "অনুমতি নেই" } };
  return { user: u };
}
export const requireUser = (req) => guard(req, () => true);
export const requireWriter = (req) => guard(req, canWriteRequests);
export const requireStaff = (req) => guard(req, isStaff);
export const requireAdmin = (req) => guard(req, (r) => r === "admin");
