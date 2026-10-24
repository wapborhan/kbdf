import { Lock } from "lucide-react";
import { Card, Badge, Avatar, th, td } from "@/components/dashboard/ui";
import FilterBar from "@/components/FilterBar";
import Pager from "@/components/Pager";
import { RoleSelect, UserActions } from "@/components/dashboard/Tools";
import { getDashboardUser } from "@/lib/auth";
import { listUsers, readParams, withoutPage } from "@/lib/queries";
import { isStaff, canChangeRole, isApproved } from "@/lib/permissions";
import { fmtDate } from "@/lib/utils";

export default async function UsersPage({ searchParams }) {
  const me = await getDashboardUser();
  if (!me) return null;
  if (!isStaff(me.role)) return <Card className="p-10 text-center text-gray-500">এই পাতা দেখার অনুমতি আপনার নেই।</Card>;
  const canRole = canChangeRole(me.role), myId = String(me._id);
  const f = readParams(await searchParams);
  const { items, total, page, pages } = await listUsers({ ...f, per: 10 });
  return (
    <div className="space-y-4">
      <FilterBar placeholder="নাম বা ইমেইল দিয়ে খুঁজুন" fields={[{ name: "filter", label: "সব ব্যবহারকারী", options: [["pending", "অনুমোদনের অপেক্ষায়"], ["approved", "অনুমোদিত"]] }]}>
        {!canRole && <span className="flex items-center gap-2 rounded-xl bg-violet-50 px-3 py-2 text-sm text-violet-700"><Lock className="h-4 w-4" />রোল পরিবর্তন শুধু অ্যাডমিন করতে পারেন।</span>}
      </FilterBar>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className={th}>ব্যবহারকারী</th><th className={th}>রোল</th><th className={th}>প্রবেশাধিকার</th><th className={th}>যোগদান</th><th className={th + " text-right"}>অ্যাকশন</th></tr></thead>
            <tbody className="divide-y">
              {items.length === 0 ? <tr><td colSpan={5} className="py-12 text-center text-gray-400">কেউ নেই</td></tr> : items.map((u) => {
                const self = u._id === myId, ok = isApproved(u), canToggle = !self && !(u.role === "admin" && me.role !== "admin") && !(ok && isStaff(u.role));
                return (
                  <tr key={u._id} className={`hover:bg-red-50/40 ${ok ? "" : "bg-amber-50/40"}`}>
                    <td className={td}><div className="flex items-center gap-3"><Avatar name={u.name} src={u.photoUrl} /><div><p className="font-medium">{u.name}</p><p className="text-xs text-gray-500">{u.email}</p></div></div></td>
                    <td className={td}>{canRole && !self ? <RoleSelect id={u._id} value={u.role} /> : <Badge v={u.role} />}</td>
                    <td className={td}><span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${ok ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{ok ? "অনুমোদিত" : "অপেক্ষমাণ"}</span></td>
                    <td className={td + " text-gray-600"}>{fmtDate(u.createdAt)}</td>
                    <td className={td}><UserActions id={u._id} name={u.name} approved={ok} profile={u.profile || null} canToggle={canToggle} /></td>
                  </tr>);
              })}
            </tbody>
          </table>
        </div>
        <Pager page={page} pages={pages} total={total} path="/dashboard/users" params={withoutPage(f)} />
      </Card>
    </div>
  );
}
