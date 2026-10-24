import { HeartHandshake } from "lucide-react";
export default function VolunteerCard({ v }) {
  const since = v.since ? new Date(v.since).toLocaleDateString("bn-BD", { month: "long", year: "numeric" }) : "";
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-brand-600">
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-brand-900 via-brand-700 to-red-500 opacity-90" />
      <div className="relative mx-auto mt-6 h-24 w-24 overflow-hidden rounded-full bg-white ring-4 ring-white">
        {v.photoUrl
          ? <img src={v.photoUrl} alt={v.name} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
          : <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-600 to-brand-900 text-3xl font-bold text-white">{v.name.trim()[0]}</span>}
      </div>
      <p className="mt-4 text-lg font-bold">{v.name}</p>
      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-teal-100 px-3 py-0.5 text-xs font-medium text-teal-700"><HeartHandshake className="h-3.5 w-3.5" />স্বেচ্ছাসেবক</span>
      <p className="mt-3 text-sm text-gray-500">{v.helped > 0 ? `${v.helped.toLocaleString("bn-BD")} টি আবেদনে সহায়তা` : "নতুন সদস্য"}{since && ` · ${since} থেকে`}</p>
    </div>
  );
}
