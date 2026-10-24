import { Card, Badge, GroupPill, Avatar, th, td } from "@/components/dashboard/ui";
import FilterBar from "@/components/FilterBar";
import Pager from "@/components/Pager";
import { AddDonorButton, DonorStatus, DonorActions } from "@/components/dashboard/Tools";
import { getDashboardUser } from "@/lib/auth";
import { listDonors, readParams, withoutPage } from "@/lib/queries";
import { isStaff } from "@/lib/permissions";
import { BLOOD_GROUPS, UPAZILAS } from "@/lib/constants";
import { fmtDate } from "@/lib/utils";

export default async function DonorsPage({ searchParams }) {
  const user = await getDashboardUser();
  if (!user) return null;
  const staff = isStaff(user.role);
  const f = readParams(await searchParams);
  const { items, total, page, pages } = await listDonors({ ...f, per: 10 });
  return (
    <div className="space-y-4">
      <FilterBar placeholder="নাম বা ফোন দিয়ে খুঁজুন" fields={[
        { name: "bloodGroup", label: "সব গ্রুপ", options: BLOOD_GROUPS }, { name: "upazila", label: "সব উপজেলা", options: UPAZILAS },
        { name: "status", label: "সব অবস্থা", options: [["active", "সক্রিয়"], ["pending", "অপেক্ষমাণ"], ["inactive", "নিষ্ক্রিয়"]] },
      ]}>{staff && <AddDonorButton />}</FilterBar>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className={th}>দাতা</th><th className={th}>গ্রুপ</th><th className={th}>উপজেলা</th><th className={th}>সর্বশেষ রক্তদান</th><th className={th}>অবস্থা</th><th className={th + " text-right"}>অ্যাকশন</th></tr></thead>
            <tbody className="divide-y">
              {items.length === 0 ? <tr><td colSpan={6} className="py-12 text-center text-gray-400">কোনো দাতা পাওয়া যায়নি</td></tr> : items.map((d) => (
                <tr key={d._id} className="transition hover:bg-red-50/40">
                  <td className={td}><div className="flex items-center gap-3"><Avatar name={d.name} src={d.photoUrl} /><div><p className="font-medium">{d.name}</p><p className="text-xs text-gray-500">{d.phone}</p></div></div></td>
                  <td className={td}><GroupPill g={d.bloodGroup} /></td>
                  <td className={td}>{d.upazila}</td>
                  <td className={td + " text-gray-600"}>{d.lastDonationDate ? fmtDate(d.lastDonationDate) : "—"}</td>
                  <td className={td}>{staff ? <DonorStatus id={d._id} value={d.status} /> : <Badge v={d.status} />}</td>
                  <td className={td}><DonorActions d={d} staff={staff} /></td>
                </tr>))}
            </tbody>
          </table>
        </div>
        <Pager page={page} pages={pages} total={total} path="/dashboard/donors" params={withoutPage(f)} />
      </Card>
    </div>
  );
}
