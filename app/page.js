import Link from "next/link";
import { Search, UserPlus, HeartPulse, ShieldCheck, Clock, Users, Droplets, ArrowRight } from "lucide-react";
import { connectDB } from "@/lib/db";
import Donor from "@/models/Donor";
import BloodRequest from "@/models/BloodRequest";
import RequestCard from "@/components/RequestCard";
import BloodBadge from "@/components/BloodBadge";
import { BLOOD_GROUPS } from "@/lib/constants";
export const dynamic = "force-dynamic";

async function getData() {
  try {
    await connectDB();
    const [donors, fulfilled, requests] = await Promise.all([
      Donor.countDocuments({ status: "active" }),
      BloodRequest.countDocuments({ status: "fulfilled" }),
      BloodRequest.find({ status: "approved" }).select("-contactPhone").sort({ neededBy: 1 }).limit(3).lean(),
    ]);
    return { donors, fulfilled, requests: JSON.parse(JSON.stringify(requests)) };
  } catch { return { donors: 0, fulfilled: 0, requests: [] }; }
}
const bn = (n) => n.toLocaleString("bn-BD");

export default async function Home() {
  const { donors, fulfilled, requests } = await getData();
  const actions = [
    { href: "/donors", t: "রক্তদাতা খুঁজুন", d: "গ্রুপ ও এলাকা অনুযায়ী দাতা খুঁজুন", I: Search, c: "bg-white text-brand-700" },
    { href: "/donors/register", t: "রক্তদাতা হিসেবে নিবন্ধন করুন", d: "আপনিও কারো জীবন বাঁচাতে পারেন", I: UserPlus, c: "bg-brand-600 text-white ring-2 ring-white/40" },
    { href: "/requests/new", t: "রক্তের জন্য আবেদন করুন", d: "জরুরি প্রয়োজনে অনুরোধ জানান", I: HeartPulse, c: "bg-white text-brand-700" },
  ];
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-700 to-brand-600 text-white">
        <Droplets className="absolute -right-10 -top-10 h-72 w-72 rotate-12 text-white/5" />
        <Droplets className="absolute -bottom-16 left-10 h-56 w-56 -rotate-12 text-white/5" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur"><Droplets className="h-4 w-4" /> কুষ্টিয়ার স্বেচ্ছাসেবী রক্তদাতা নেটওয়ার্ক</span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-6xl">রক্ত দিন, <span className="text-red-200">জীবন বাঁচান</span></h1>
          <p className="mx-auto mt-5 max-w-2xl text-red-100 sm:text-lg">জরুরি মুহূর্তে সঠিক রক্তদাতা খুঁজে পেতে ও রক্তের আবেদন জানাতে কুষ্টিয়া ব্লাড ডোনেট ফাউন্ডেশন আপনার পাশে।</p>
          <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
            {actions.map(({ href, t, d, I, c }) => (
              <Link key={href} href={href} className={`group rounded-2xl p-5 shadow-lg transition hover:-translate-y-1 ${c}`}>
                <I className="h-8 w-8" /><p className="mt-3 text-lg font-bold">{t}</p><p className="mt-1 text-sm opacity-80">{d}</p>
                <ArrowRight className="mt-3 h-5 w-5 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
          <div className="mx-auto mt-12 grid max-w-xl grid-cols-2 gap-4">
            {[[donors, "সক্রিয় রক্তদাতা"], [fulfilled, "পূরণকৃত আবেদন"]].map(([n, l]) => (
              <div key={l} className="rounded-2xl bg-white/10 p-4 backdrop-blur"><p className="text-3xl font-extrabold">{bn(n)}</p><p className="text-sm text-red-100">{l}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-2xl font-bold">রক্তের গ্রুপ অনুযায়ী খুঁজুন</h2>
        <div className="mt-8 grid grid-cols-4 gap-3 sm:grid-cols-8">
          {BLOOD_GROUPS.map((g) => (
            <Link key={g} href={`/donors?bloodGroup=${encodeURIComponent(g)}`} className="flex flex-col items-center gap-2 rounded-2xl bg-white p-3 ring-1 ring-gray-200 transition hover:ring-brand-600"><BloodBadge group={g} /></Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-bold">কীভাবে কাজ করে</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[[Users, "১. দাতা খুঁজুন", "গ্রুপ ও উপজেলা ফিল্টার করে প্রস্তুত দাতা দেখুন।"], [Clock, "২. সরাসরি যোগাযোগ", "WhatsApp বা Facebook-এ দ্রুত কথা বলুন।"], [ShieldCheck, "৩. যাচাইকৃত তথ্য", "অ্যাডমিন অনুমোদনের পরেই দাতা তালিকায় আসেন।"]].map(([I, t, d]) => (
              <div key={t} className="rounded-2xl bg-brand-50 p-6 text-center"><I className="mx-auto h-9 w-9 text-brand-600" /><p className="mt-3 font-bold">{t}</p><p className="mt-1 text-sm text-gray-600">{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between"><h2 className="text-2xl font-bold">জরুরি রক্তের আবেদন</h2><Link href="/requests" className="text-sm font-medium text-brand-600">সব দেখুন →</Link></div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {requests.length ? requests.map((r) => <RequestCard key={r._id} r={r} />) : <p className="col-span-full rounded-2xl bg-white p-8 text-center text-gray-500 ring-1 ring-gray-200">এখন কোনো সক্রিয় আবেদন নেই।</p>}
        </div>
      </section>
    </>
  );
}
