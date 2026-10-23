import { MessageCircle, Facebook, MapPin, CalendarClock } from "lucide-react";
import BloodBadge from "./BloodBadge";
import { toWa, fmtDate, canDonate } from "@/lib/utils";
export default function DonorCard({ d }) {
  const ok = canDonate(d.lastDonationDate);
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
      <div className="flex items-center gap-3">
        {d.photoUrl ? <img src={d.photoUrl} alt={d.name} className="h-14 w-14 rounded-full object-cover" /> : <BloodBadge group={d.bloodGroup} />}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{d.name}</p>
          <p className="flex items-center gap-1 text-sm text-gray-500"><MapPin className="h-3.5 w-3.5" />{d.upazila}</p>
        </div>
        {d.photoUrl && <span className="rounded-full bg-brand-50 px-2.5 py-1 text-sm font-bold text-brand-700">{d.bloodGroup}</span>}
      </div>
      <p className={`mt-3 flex items-center gap-1 text-xs ${ok ? "text-green-700" : "text-amber-700"}`}><CalendarClock className="h-3.5 w-3.5" />{ok ? "রক্তদানে প্রস্তুত" : `সর্বশেষ রক্তদান: ${fmtDate(d.lastDonationDate)}`}</p>
      <div className="mt-3 flex gap-2">
        <a href={`https://wa.me/${toWa(d.phone)}`} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700"><MessageCircle className="h-4 w-4" />WhatsApp</a>
        {d.facebookUrl && <a href={d.facebookUrl} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"><Facebook className="h-4 w-4" />Facebook</a>}
      </div>
    </div>
  );
}
