import Shell from "@/components/dashboard/Shell";
import SessionGate from "@/components/dashboard/SessionGate";
import { getServerUser } from "@/lib/auth";
import { serializeUser } from "@/lib/serialize";
import { isApproved, isStaff } from "@/lib/permissions";
import { noIndex } from "@/lib/seo";
export const metadata = noIndex("ড্যাশবোর্ড");
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }) {
  const u = await getServerUser();
  if (!u) return <SessionGate />;
  const allowed = isApproved(u) && (isStaff(u.role) || u.profileComplete);
  // children are NOT passed when access is not allowed, so page content never reaches an unapproved browser
  return <Shell user={serializeUser(u)}>{allowed ? children : null}</Shell>;
}
