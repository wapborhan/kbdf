"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Phone, Hospital, CalendarClock, Loader2 } from "lucide-react";
import BloodBadge from "@/components/BloodBadge";
import { fmtDate, toWa } from "@/lib/utils";
export default function RequestDetails() {
  const { id } = useParams();
  const [r, setR] = useState(null);
  const [state, setState] = useState("loading");
  useEffect(() => { fetch(`/api/requests/${id}`).then(async (res) => { const j = await res.json(); if (res.ok) { setR(j.request); setState("ok"); } else setState("missing"); }).catch(() => setState("missing")); }, [id]);
  if (state === "loading") return <Loader2 className="mx-auto mt-20 h-8 w-8 animate-spin text-brand-600" />;
  if (state === "missing") return <p className="py-20 text-center text-gray-500">আবেদনটি পাওয়া যায়নি।</p>;
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="flex items-center gap-4"><BloodBadge group={r.bloodGroup} size="lg" /><div><h1 className="text-xl font-bold">{r.patientName}</h1><p className="text-sm text-gray-500">{r.units} ব্যাগ রক্ত প্রয়োজন</p></div></div>
        {r.status === "fulfilled" && <p className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">এই আবেদনটি পূরণ হয়েছে।</p>}
        <ul className="mt-5 space-y-3 text-sm">
          <li className="flex gap-2"><Hospital className="h-5 w-5 text-brand-600" />{r.hospital}, {r.upazila}</li>
          <li className="flex gap-2"><CalendarClock className="h-5 w-5 text-brand-600" />প্রয়োজন: {fmtDate(r.neededBy)}</li>
          {r.note && <li className="rounded-xl bg-gray-50 p-3 text-gray-700">{r.note}</li>}
        </ul>
        {r.contactPhone && <div className="mt-6 grid grid-cols-2 gap-2"><a href={`tel:${r.contactPhone}`} className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 font-medium text-white"><Phone className="h-4 w-4" />কল করুন</a><a href={`https://wa.me/${toWa(r.contactPhone)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center rounded-xl bg-green-600 py-2.5 font-medium text-white">WhatsApp</a></div>}
      </div>
    </div>
  );
}
