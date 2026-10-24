import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import VolunteerCard from "@/components/VolunteerCard";
import { getVolunteers } from "@/lib/volunteers";
import { pageMeta } from "@/lib/seo";
export const dynamic = "force-dynamic";
export const metadata = pageMeta("স্বেচ্ছাসেবক", "কুষ্টিয়া ব্লাড ডোনেট ফাউন্ডেশনের স্বেচ্ছাসেবকদের সাথে পরিচিত হোন, যারা জরুরি রক্তের আবেদন যোগ ও সমন্বয়ে সহায়তা করেন।", "/volunteers");

export default async function VolunteersPage() {
  let list = [];
  try { list = await getVolunteers(); } catch {}
  return (
    <>
      <section className="bg-gradient-to-br from-brand-900 via-brand-700 to-brand-600 py-14 text-center text-white">
        <HeartHandshake className="mx-auto h-10 w-10" />
        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">আমাদের স্বেচ্ছাসেবক</h1>
        <p className="mx-auto mt-2 max-w-xl px-4 text-red-100">যাদের সময় ও শ্রমে কুষ্টিয়ার মানুষ জরুরি মুহূর্তে রক্ত পায়।</p>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-12">
        {list.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{list.map((v) => <VolunteerCard key={v.id} v={v} />)}</div>
        ) : <p className="rounded-2xl bg-white p-10 text-center text-gray-500 ring-1 ring-gray-200">এখনো কোনো স্বেচ্ছাসেবক তালিকাভুক্ত হননি।</p>}
        <div className="mt-12 rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
          <p className="text-lg font-bold">আপনিও স্বেচ্ছাসেবক হতে চান?</p>
          <p className="mt-1 text-sm text-gray-600">Google দিয়ে নিবন্ধন করুন, তারপর যোগাযোগ করে জানান — অ্যাডমিন আপনাকে স্বেচ্ছাসেবক রোল দেবেন।</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3"><Link href="/login" className="rounded-full bg-brand-600 px-6 py-2.5 font-medium text-white hover:bg-brand-700">নিবন্ধন করুন</Link><Link href="/contact" className="rounded-full border px-6 py-2.5 font-medium hover:bg-gray-50">যোগাযোগ</Link></div>
        </div>
      </div>
    </>
  );
}
