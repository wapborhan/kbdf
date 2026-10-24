import Link from "next/link";
import { Pencil } from "lucide-react";
import { getServerUser } from "@/lib/auth";
import { serializeUser } from "@/lib/serialize";
import { Card, Badge } from "@/components/dashboard/ui";
import ProfileInfo from "@/components/dashboard/ProfileInfo";
import { fmtDate } from "@/lib/utils";

export default async function ProfilePage() {
  const u = await getServerUser();
  if (!u) return null;
  const profile = serializeUser(u);
  const d = profile.details;
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card className="overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-brand-900 via-brand-700 to-red-500" />
        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-wrap items-end gap-4">
            <div className="h-24 w-24 overflow-hidden rounded-full bg-white ring-4 ring-white">
              {profile.photoUrl ? <img src={profile.photoUrl} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-600 to-brand-900 text-3xl font-bold text-white">{(profile.name || "?").trim()[0]}</span>}
            </div>
            <div className="min-w-0 flex-1 pb-1"><h2 className="truncate text-xl font-bold">{profile.name}</h2><p className="truncate text-sm text-gray-500">{profile.email}</p></div>
            <Link href="/dashboard/profile/edit" className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-brand-700"><Pencil className="h-4 w-4" />প্রোফাইল সম্পাদনা</Link>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <Badge v={profile.role} />
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${profile.approved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{profile.approved ? "অনুমোদিত" : "অনুমোদনের অপেক্ষায়"}</span>
            <span>যোগদান: {fmtDate(profile.createdAt)}</span>
          </div>
        </div>
      </Card>
      {profile.profileComplete ? <ProfileInfo d={d} /> : <Card className="p-8 text-center"><p className="text-gray-600">আপনার ব্যক্তিগত তথ্য এখনো দেওয়া হয়নি।</p><Link href="/dashboard/profile/edit" className="mt-4 inline-block rounded-xl bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700">তথ্য যোগ করুন</Link></Card>}
    </div>
  );
}
