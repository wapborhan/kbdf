import { Card, Badge, GroupPill, th, td, LABEL } from "@/components/dashboard/ui";
import FilterBar from "@/components/FilterBar";
import Pager from "@/components/Pager";
import { AddRequestButton, RequestStatus, RequestActions } from "@/components/dashboard/Tools";
import { getDashboardUser } from "@/lib/auth";
import { listRequests, readParams, withoutPage } from "@/lib/queries";
import { isStaff, canWriteRequests } from "@/lib/permissions";
import { BLOOD_GROUPS, UPAZILAS, REQUEST_STATUSES } from "@/lib/constants";
import { fmtDate } from "@/lib/utils";

export default async function RequestsPage({ searchParams }) {
  const user = await getDashboardUser();
  if (!user) return null;
  const staff = isStaff(user.role), volunteer = user.role === "volunteer", uid = String(user._id);
  const f = readParams(await searchParams);
  const { items, total, page, pages } = await listRequests({ ...f, per: 10 });
  return (
    <div className="space-y-4">
      {volunteer && <p className="rounded-2xl bg-teal-50 px-4 py-3 text-sm text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 dark:ring-1 dark:ring-teal-800">আপনার যোগ/সম্পাদনা করা আবেদন "অপেক্ষমাণ" থাকবে এবং অ্যাডমিন বা মডারেটর অনুমোদন করলে প্রকাশিত হবে।</p>}
      <FilterBar placeholder="রোগী, হাসপাতাল বা ফোন" fields={[
        { name: "bloodGroup", label: "সব গ্রুপ", options: BLOOD_GROUPS }, { name: "upazila", label: "সব উপজেলা", options: UPAZILAS },
        { name: "status", label: "সব অবস্থা", options: REQUEST_STATUSES.map((s) => [s, LABEL[s]]) },
      ]}>{canWriteRequests(user.role) && <AddRequestButton />}</FilterBar>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-slate-900/60"><tr><th className={th}>রোগী</th><th className={th}>গ্রুপ</th><th className={th}>হাসপাতাল</th><th className={th}>প্রয়োজন</th><th className={th}>অবস্থা</th><th className={th + " text-right"}>অ্যাকশন</th></tr></thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60">
              {items.length === 0 ? <tr><td colSpan={6} className="py-12 text-center text-gray-400 dark:text-slate-500">কোনো আবেদন পাওয়া যায়নি</td></tr> : items.map((r) => (
                <tr key={r._id} className={`transition hover:bg-red-50/40 dark:hover:bg-slate-700/30 ${r.status === "pending" ? "bg-amber-50/40 dark:bg-amber-950/20" : ""}`}>
                  <td className={td}><p className="font-medium">{r.patientName}</p><p className="text-xs text-gray-500 dark:text-slate-400">{r.contactPhone}{r.createdByName && staff ? ` · যোগ করেছেন: ${r.createdByName}` : ""}</p></td>
                  <td className={td}><div className="flex items-center gap-2"><GroupPill g={r.bloodGroup} /><span className="text-xs text-gray-500 dark:text-slate-400">{r.units.toLocaleString("bn-BD")} ব্যাগ</span></div></td>
                  <td className={td}>{r.hospital}<p className="text-xs text-gray-500 dark:text-slate-400">{r.upazila}</p></td>
                  <td className={td + " whitespace-nowrap text-gray-600 dark:text-slate-400"}>{fmtDate(r.neededBy)}</td>
                  <td className={td}>{staff ? <RequestStatus id={r._id} value={r.status} /> : <Badge v={r.status} />}</td>
                  <td className={td}><RequestActions r={r} staff={staff} canEdit={staff || (volunteer && r.createdBy === uid)} /></td>
                </tr>))}
            </tbody>
          </table>
        </div>
        <Pager page={page} pages={pages} total={total} path="/dashboard/requests" params={withoutPage(f)} />
      </Card>
    </div>
  );
}
