import Link from "next/link";
import { Users, Droplets, HeartPulse, Clock, UserCog, Eye } from "lucide-react";
import { Card, StatCard, Badge, GroupPill, Avatar } from "@/components/dashboard/ui";
import { getDashboardUser } from "@/lib/auth";
import { getStats, plain } from "@/lib/queries";
import { BLOOD_GROUPS } from "@/lib/constants";
import { MONTHS, fmtDate } from "@/lib/utils";

export default async function Overview() {
  const profile = await getDashboardUser();
  if (!profile) return null;
  const s = plain(await getStats(profile.role));

  const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);
  const maxG = Math.max(1, ...BLOOD_GROUPS.map((g) => s.byGroup[g] || 0));
  const maxM = Math.max(1, ...s.monthly.map((m) => m[1]));
  const rs = [["approved", "#2563eb"], ["pending", "#f59e0b"], ["fulfilled", "#16a34a"], ["cancelled", "#9ca3af"]];
  const rTotal = sum(s.requests) || 1;
  let acc = 0;
  const donut = rs.map(([k, c]) => { const a = acc, b = acc + ((s.requests[k] || 0) / rTotal) * 100; acc = b; return `${c} ${a}% ${b}%`; }).join(", ");

  return (
    <div className="space-y-6">
      {profile.role === "user" && <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300"><Eye className="h-4 w-4" />আপনার অ্যাকাউন্ট শুধু দেখার অনুমতি (Read Only) সহ।</div>}
      {profile.role === "volunteer" && <div className="flex items-center gap-2 rounded-2xl bg-teal-50 px-4 py-3 text-sm text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 dark:ring-1 dark:ring-teal-800"><Eye className="h-4 w-4" />আপনি রক্তের আবেদন যোগ ও নিজের আবেদন সম্পাদনা করতে পারবেন; প্রতিবার অ্যাডমিন/মডারেটরের অনুমোদন লাগবে।</div>}
      {s.pendingUsers > 0 && <Link href="/dashboard/users" className="flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800/60 dark:hover:bg-amber-950/60"><Clock className="h-4 w-4" />{s.pendingUsers.toLocaleString("bn-BD")} জন ব্যবহারকারী অনুমোদনের অপেক্ষায় — দেখুন →</Link>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="সক্রিয় রক্তদাতা" value={s.donors.active || 0} sub={`মোট ${sum(s.donors).toLocaleString("bn-BD")} · অপেক্ষমাণ ${(s.donors.pending || 0).toLocaleString("bn-BD")}`} />
        <StatCard icon={Droplets} label="চলমান আবেদন" value={s.requests.approved || 0} sub={`অপেক্ষমাণ ${(s.requests.pending || 0).toLocaleString("bn-BD")}`} tone="from-blue-500 to-blue-700" />
        <StatCard icon={HeartPulse} label="পূরণ হয়েছে" value={s.requests.fulfilled || 0} sub={`মোট আবেদন ${sum(s.requests).toLocaleString("bn-BD")}`} tone="from-green-500 to-green-700" />
        {s.users !== null ? <StatCard icon={UserCog} label="নিবন্ধিত ব্যবহারকারী" value={s.users} tone="from-violet-500 to-violet-700" /> : <StatCard icon={Clock} label="অপেক্ষমাণ আবেদন" value={s.requests.pending || 0} tone="from-amber-500 to-amber-600" />}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="font-bold">রক্তের গ্রুপ অনুযায়ী সক্রিয় দাতা</h2>
          <div className="mt-5 grid h-48 grid-cols-8 items-end gap-2 sm:gap-4">
            {BLOOD_GROUPS.map((g) => { const n = s.byGroup[g] || 0; return (
              <div key={g} className="flex h-full flex-col items-center justify-end gap-1">
                <span className="text-xs text-gray-500">{n.toLocaleString("bn-BD")}</span>
                <div className="w-full rounded-t-lg bg-gradient-to-t from-brand-900 to-red-400 transition-all" style={{ height: `${Math.max(4, (n / maxG) * 100)}%` }} />
                <span className="text-xs font-bold text-brand-700">{g}</span>
              </div>); })}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-bold">আবেদনের অবস্থা</h2>
          <div className="mt-5 flex items-center gap-5">
            <div className="relative h-32 w-32 shrink-0 rounded-full" style={{ background: sum(s.requests) ? `conic-gradient(${donut})` : "#334155" }}><div className="absolute inset-4 flex items-center justify-center rounded-full bg-white text-lg font-extrabold text-gray-900 shadow-sm dark:bg-slate-800 dark:text-slate-100">{sum(s.requests).toLocaleString("bn-BD")}</div></div>
            <ul className="space-y-1.5 text-sm">{rs.map(([k, c]) => <li key={k} className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: c }} /><Badge v={k} /><span className="text-gray-500 dark:text-slate-400">{(s.requests[k] || 0).toLocaleString("bn-BD")}</span></li>)}</ul>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5">
          <h2 className="font-bold">গত ৬ মাসের আবেদন</h2>
          <div className="mt-5 flex h-40 items-end gap-3">
            {s.monthly.length ? s.monthly.map(([k, n]) => <div key={k} className="flex h-full flex-1 flex-col items-center justify-end gap-1"><span className="text-xs text-gray-500">{n.toLocaleString("bn-BD")}</span><div className="w-full rounded-t-lg bg-gradient-to-t from-blue-700 to-blue-400" style={{ height: `${Math.max(6, (n / maxM) * 100)}%` }} /><span className="text-[10px] text-gray-500">{MONTHS[+k.slice(5) - 1].slice(0, 3)}</span></div>) : <p className="m-auto text-sm text-gray-400">তথ্য নেই</p>}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-bold">উপজেলাভিত্তিক দাতা</h2>
          <ul className="mt-4 space-y-3">{s.byUpazila.length ? s.byUpazila.map(([u, n]) => <li key={u}><div className="flex justify-between text-sm"><span>{u}</span><span className="text-gray-500 dark:text-slate-400">{n.toLocaleString("bn-BD")}</span></div><div className="mt-1 h-2 rounded-full bg-gray-100 dark:bg-slate-700"><div className="h-2 rounded-full bg-brand-600" style={{ width: `${(n / s.byUpazila[0][1]) * 100}%` }} /></div></li>) : <li className="text-sm text-gray-400 dark:text-slate-500">তথ্য নেই</li>}</ul>
        </Card>
        <Card className="p-5">
          <h2 className="font-bold">সাম্প্রতিক দাতা</h2>
          <ul className="mt-4 space-y-3">{s.recentDonors.length ? s.recentDonors.map((d) => <li key={d._id} className="flex items-center gap-3"><Avatar name={d.name} src={d.photoUrl} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{d.name}</p><p className="text-xs text-gray-500 dark:text-slate-400">{d.upazila}</p></div><GroupPill g={d.bloodGroup} /></li>) : <li className="text-sm text-gray-400 dark:text-slate-500">তথ্য নেই</li>}</ul>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="font-bold">সাম্প্রতিক আবেদন</h2>
        <ul className="mt-4 divide-y divide-gray-100 dark:divide-slate-700/60">{s.recentRequests.length ? s.recentRequests.map((r) => <li key={r._id} className="flex flex-wrap items-center gap-3 py-3 text-sm"><GroupPill g={r.bloodGroup} /><span className="font-medium">{r.patientName}</span><span className="flex-1 text-gray-500 dark:text-slate-400">{r.hospital}, {r.upazila} · {fmtDate(r.neededBy)}</span><Badge v={r.status} /></li>) : <li className="py-3 text-sm text-gray-400 dark:text-slate-500">কোনো আবেদন নেই</li>}</ul>
      </Card>
    </div>
  );
}
