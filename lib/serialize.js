import { isApproved } from "./permissions";
export function serializeUser(u) {
  const pr = u.toObject().profile || {};
  return {
    id: String(u._id), name: u.name, email: u.email, photoUrl: u.photoUrl || "", role: u.role,
    approved: isApproved(u), profileComplete: !!u.profileComplete, createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : "",
    details: { ...pr, birthDate: pr.birthDate ? new Date(pr.birthDate).toISOString().slice(0, 10) : "" },
  };
}
