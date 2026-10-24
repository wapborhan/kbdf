import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { Phone, Hospital, CalendarClock } from "lucide-react";
import BloodBadge from "@/components/BloodBadge";
import { getRequestPublic } from "@/lib/queries";
import { fmtDate, toWa } from "@/lib/utils";

export default async function RequestDetails({ params }) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) notFound();
  const r = await getRequestPublic(id).catch(() => null);
  if (!r) notFound();
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="flex items-center gap-4"><BloodBadge group={r.bloodGroup} size="lg" /><div><h1 className="text-xl font-bold">{r.patientName}</h1><p className="text-sm text-gray-500">{r.units.toLocaleString("bn-BD")} ব্যাগ রক্ত প্রয়োজন</p></div></div>
        {r.status === "fulfilled" && <p className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">এই আবেদনটি পূরণ হয়েছে।</p>}
        <ul className="mt-5 space-y-3 text-sm">
          <li className="flex gap-2"><Hospital className="h-5 w-5 text-brand-600" />{r.hospital}, {r.upazila}</li>
          <li className="flex gap-2"><CalendarClock className="h-5 w-5 text-brand-600" />প্রয়োজন: {fmtDate(r.neededBy)}</li>
          {r.note && <li className="whitespace-pre-line rounded-xl bg-gray-50 p-3 text-gray-700">{r.note}</li>}
        </ul>
        {r.contactPhone && <div className="mt-6 grid grid-cols-2 gap-2"><a href={`tel:${r.contactPhone}`} className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 font-medium text-white"><Phone className="h-4 w-4" />কল করুন</a><a href={`https://wa.me/${toWa(r.contactPhone)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center rounded-xl bg-green-600 py-2.5 font-medium text-white">WhatsApp</a></div>}
      </div>
    </div>
  );
}
