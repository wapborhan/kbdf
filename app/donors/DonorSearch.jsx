"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import DonorCard from "@/components/DonorCard";
import { inputCls } from "@/components/Field";
import { BLOOD_GROUPS, UPAZILAS } from "@/lib/constants";
export default function DonorSearch() {
  const sp = useSearchParams();
  const [bloodGroup, setBG] = useState(sp.get("bloodGroup") || "");
  const [upazila, setUp] = useState("");
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  useEffect(() => {
    const ctl = new AbortController();
    setLoading(true); setErr("");
    const q = new URLSearchParams({ ...(bloodGroup && { bloodGroup }), ...(upazila && { upazila }) });
    fetch(`/api/donors?${q}`, { signal: ctl.signal }).then((r) => r.json()).then((j) => { if (j.error) throw new Error(j.error); setDonors(j.donors); setLoading(false); }).catch((e) => { if (e.name !== "AbortError") { setErr("তথ্য লোড করা যায়নি"); setLoading(false); } });
    return () => ctl.abort();
  }, [bloodGroup, upazila]);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">রক্তদাতা খুঁজুন</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <select className={inputCls} value={bloodGroup} onChange={(e) => setBG(e.target.value)}><option value="">সব রক্তের গ্রুপ</option>{BLOOD_GROUPS.map((g) => <option key={g}>{g}</option>)}</select>
        <select className={inputCls} value={upazila} onChange={(e) => setUp(e.target.value)}><option value="">সব উপজেলা</option>{UPAZILAS.map((u) => <option key={u}>{u}</option>)}</select>
      </div>
      <div className="mt-6">
        {loading ? <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-600" /> : err ? <p className="text-center text-red-600">{err}</p> : donors.length === 0 ? <p className="rounded-2xl bg-white p-8 text-center text-gray-500 ring-1 ring-gray-200">কোনো রক্তদাতা পাওয়া যায়নি।</p> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{donors.map((d) => <DonorCard key={d._id} d={d} />)}</div>}
      </div>
    </div>
  );
}
