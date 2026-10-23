import Link from "next/link";
import { Hospital, Clock } from "lucide-react";
import BloodBadge from "./BloodBadge";
import { fmtDate } from "@/lib/utils";
export default function RequestCard({ r }) {
  return (
    <Link href={`/requests/${r._id}`} className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 transition hover:ring-brand-600">
      <BloodBadge group={r.bloodGroup} />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{r.patientName} <span className="text-sm font-normal text-gray-500">· {r.units} ব্যাগ</span></p>
        <p className="mt-1 flex items-center gap-1 text-sm text-gray-600"><Hospital className="h-4 w-4" />{r.hospital}, {r.upazila}</p>
        <p className="mt-1 flex items-center gap-1 text-sm text-brand-700"><Clock className="h-4 w-4" />প্রয়োজন: {fmtDate(r.neededBy)}</p>
      </div>
    </Link>
  );
}
