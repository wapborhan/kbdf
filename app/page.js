import Link from "next/link";
import { Search, UserPlus, HeartPulse, ShieldCheck, Zap, Users, Droplet, ArrowRight, MessageCircle, MapPin } from "lucide-react";
import { connectDB } from "@/lib/db";
import Donor from "@/models/Donor";
import BloodRequest from "@/models/BloodRequest";
import RequestCard from "@/components/RequestCard";
import VolunteerCard from "@/components/VolunteerCard";
import { getVolunteers } from "@/lib/volunteers";
import BloodBadge from "@/components/BloodBadge";
import { BLOOD_GROUPS } from "@/lib/constants";
export const dynamic = "force-dynamic";

async function getData() {
  try {
    await connectDB();
    const [donors, fulfilled, open, requests] = await Promise.all([
      Donor.countDocuments({ status: "active" }),
      BloodRequest.countDocuments({ status: "fulfilled" }),
      BloodRequest.countDocuments({ status: "approved" }),
      BloodRequest.find({ status: "approved" }).select("-contactPhone").sort({ neededBy: 1 }).limit(3).lean(),
    ]);
    const volunteers = await getVolunteers(3).catch(() => []);
    return { donors, fulfilled, open, volunteers, requests: JSON.parse(JSON.stringify(requests)) };
  } catch { return { donors: 0, fulfilled: 0, open: 0, volunteers: [], requests: [] }; }
}
const bn = (n) => n.toLocaleString("bn-BD");

const drops = [
  ["left-[6%] top-[14%]", "h-10 w-10", "0s"], ["left-[88%] top-[10%]", "h-16 w-16", "1.2s"],
  ["left-[78%] top-[62%]", "h-8 w-8", "2.1s"], ["left-[12%] top-[70%]", "h-14 w-14", ".6s"], ["left-[48%] top-[6%]", "h-6 w-6", "1.8s"],
];

const marqueePhrases = [
  "রক্ত দিন, জীবন বাঁচান",
  "SR ব্লাড ডোনেট ফাউন্ডেশন",
  "কুষ্টিয়ার পাশে আমরা",
  "সবার জন্য সম্পূর্ণ বিনামূল্যে",
  "যাচাইকৃত রক্তদাতা নেটওয়ার্ক",
  "জরুরিতে দ্রুত সাড়া",
  "একটি রক্তদান, একটি নতুন জীবন",
  "মানবতার সেবায় নিবেদিত",
];

export default async function Home() {
  const { donors, fulfilled, open, volunteers, requests } = await getData();
  const actions = [
    { href: "/donors", t: "রক্তদাতা খুঁজুন", d: "গ্রুপ ও উপজেলা অনুযায়ী দাতা খুঁজুন", I: Search },
    { href: "/donors/register", t: "রক্তদাতা হিসেবে নিবন্ধন করুন", d: "Google দিয়ে সহজে যুক্ত হোন", I: UserPlus, hot: true },
    { href: "/requests/new", t: "রক্তের জন্য আবেদন করুন", d: "জরুরি প্রয়োজনে অনুরোধ জানান", I: HeartPulse },
  ];
  const steps = [
    [Search, "দাতা খুঁজুন", "রক্তের গ্রুপ ও এলাকা বেছে প্রস্তুত দাতা দেখুন।"],
    [MessageCircle, "সরাসরি কথা বলুন", "WhatsApp বা Facebook-এ দ্রুত যোগাযোগ করুন।"],
    [ShieldCheck, "যাচাইকৃত তালিকা", "অ্যাডমিন অনুমোদনের পরেই দাতা তালিকায় আসেন।"],
  ];
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#2a0606] text-white">
        <div className="pointer-events-none absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-red-600/40 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 right-0 h-[30rem] w-[30rem] rounded-full bg-rose-500/30 blur-[140px]" />
        {drops.map(([pos, size, delay], i) => (
          <Droplet key={i} style={{ animationDelay: delay, "--r": `${i * 15 - 20}deg` }} className={`float pointer-events-none absolute ${pos} ${size} fill-red-500/25 text-red-400/30`} />
        ))}
        <div className="relative mx-auto max-w-6xl px-4 pb-32 pt-16 text-center sm:pb-40 sm:pt-24">
          <span className="fade-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm backdrop-blur">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" /></span>
            কুষ্টিয়ার স্বেচ্ছাসেবী রক্তদাতা নেটওয়ার্ক
          </span>
          <div className="beat mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-[0_0_60px_rgba(239,68,68,.6)]"><Droplet className="h-10 w-10 fill-white text-white" /></div>
          <h1 className="fade-up mt-6 text-4xl font-extrabold leading-tight sm:text-6xl lg:text-7xl" style={{ animationDelay: ".1s" }}>
            রক্ত দিন,<br /><span className="bg-gradient-to-r from-red-300 via-rose-200 to-orange-200 bg-clip-text text-transparent">জীবন বাঁচান</span>
          </h1>
          <p className="fade-up mx-auto mt-5 max-w-2xl text-base text-red-100/90 sm:text-lg" style={{ animationDelay: ".2s" }}>জরুরি মুহূর্তে সঠিক রক্তদাতা খুঁজে পেতে ও রক্তের আবেদন জানাতে SR ব্লাড ডোনেট ফাউন্ডেশন আপনার পাশে।</p>
          <svg viewBox="0 0 400 40" className="mx-auto mt-8 h-8 w-64 sm:w-96" fill="none"><path className="draw" d="M0 20h120l15-18 20 36 18-26 12 8h215" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
            {actions.map(({ href, t, d, I, hot }, i) => (
              <Link key={href} href={href} style={{ animationDelay: `${0.3 + i * 0.1}s` }} className={`fade-up group relative overflow-hidden rounded-2xl p-5 backdrop-blur transition duration-300 hover:-translate-y-1.5 ${hot ? "bg-gradient-to-br from-red-500 to-red-700 shadow-[0_10px_40px_rgba(220,38,38,.5)]" : "border border-white/15 bg-white/10 hover:bg-white/15"}`}>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20"><I className="h-6 w-6" /></span>
                <p className="mt-4 text-lg font-bold leading-snug">{t}</p>
                <p className="mt-1 text-sm text-white/75">{d}</p>
                <ArrowRight className="absolute bottom-5 right-5 h-5 w-5 opacity-60 transition group-hover:translate-x-1 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
        <svg className="absolute bottom-0 left-0 w-full text-slate-50 transition-colors duration-200 dark:text-slate-900" viewBox="0 0 1440 80" preserveAspectRatio="none"><path fill="currentColor" d="M0 40C240 80 480 0 720 30s480 50 720 0V80H0z" /></svg>
      </section>

      {/* STATS */}
      <section className="relative z-10 mx-auto -mt-16 max-w-5xl px-4 sm:-mt-20">
        <div className="grid grid-cols-3 divide-x divide-gray-100 rounded-3xl bg-white p-4 shadow-xl ring-1 ring-gray-100 transition-colors duration-200 dark:divide-slate-700 dark:bg-slate-800 dark:ring-slate-700 sm:p-8">
          {[[Users, donors, "সক্রিয় রক্তদাতা"], [HeartPulse, fulfilled, "পূরণকৃত আবেদন"], [Zap, open, "চলমান আবেদন"]].map(([I, n, l]) => (
            <div key={l} className="px-2 text-center"><I className="mx-auto h-6 w-6 text-brand-600 sm:h-8 sm:w-8" /><p className="mt-2 bg-gradient-to-b from-brand-600 to-brand-900 bg-clip-text text-2xl font-extrabold text-transparent sm:text-5xl">{bn(n)}</p><p className="mt-1 text-xs text-gray-500 dark:text-slate-400 sm:text-sm">{l}</p></div>
          ))}
        </div>
      </section>

      {/* BLOOD GROUPS */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">দ্রুত খুঁজুন</p>
        <h2 className="mt-2 text-center text-2xl font-bold sm:text-4xl">রক্তের গ্রুপ বেছে নিন</h2>
        <div className="mt-10 grid grid-cols-4 gap-3 sm:gap-5 lg:grid-cols-8">
          {BLOOD_GROUPS.map((g) => (
            <Link key={g} href={`/donors?bloodGroup=${encodeURIComponent(g)}`} className="group flex aspect-square items-center justify-center rounded-3xl bg-white shadow-sm ring-1 ring-gray-200 transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:ring-brand-600 dark:bg-slate-800 dark:ring-slate-700 dark:hover:ring-brand-500">
              <span className="transition group-hover:scale-110"><BloodBadge group={g} /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden bg-brand-600 py-3 text-white select-none" aria-hidden="true">
        <div className="marquee flex w-max whitespace-nowrap text-sm font-medium hover:[animation-play-state:paused]">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {marqueePhrases.map((t, i) => (
                <span key={`${k}-${i}`} className="flex items-center gap-4 px-6">
                  <span>{t}</span>
                  <Droplet className="h-3.5 w-3.5 fill-white text-white/80" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">সহজ ৩ ধাপ</p>
        <h2 className="mt-2 text-center text-2xl font-bold sm:text-4xl">কীভাবে কাজ করে</h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map(([I, t, d], i) => (
            <div key={t} className="relative rounded-3xl bg-white p-7 pt-10 text-center shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-800 dark:ring-slate-700">
              <span className="absolute -top-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-900 font-bold text-white shadow-lg">{bn(i + 1)}</span>
              <I className="mx-auto h-10 w-10 text-brand-600 dark:text-brand-500" /><p className="mt-4 text-lg font-bold">{t}</p><p className="mt-2 text-sm text-gray-600 dark:text-slate-400">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* URGENT REQUESTS */}
      <section className="bg-gradient-to-b from-brand-50 to-slate-50 py-16 dark:from-slate-900/60 dark:to-slate-900">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between gap-3">
            <div><p className="text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">এখনই প্রয়োজন</p><h2 className="mt-1 text-2xl font-bold sm:text-3xl">জরুরি রক্তের আবেদন</h2></div>
            <Link href="/requests" className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">সব দেখুন <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {requests.length ? requests.map((r) => <RequestCard key={r._id} r={r} />) : <p className="col-span-full rounded-2xl bg-white p-10 text-center text-gray-500 ring-1 ring-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700">এখন কোনো সক্রিয় আবেদন নেই।</p>}
          </div>
        </div>
      </section>

      {/* VOLUNTEERS */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex items-end justify-between gap-3">
          <div><p className="text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">আমাদের মানুষ</p><h2 className="mt-1 text-2xl font-bold sm:text-3xl">স্বেচ্ছাসেবক</h2></div>
          <Link href="/volunteers" className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">সবাইকে দেখুন <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {volunteers.length ? volunteers.map((v) => <VolunteerCard key={v.id} v={v} />) : <p className="col-span-full rounded-2xl bg-white p-10 text-center text-gray-500 ring-1 ring-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700">স্বেচ্ছাসেবকরা শীঘ্রই যুক্ত হবেন। <Link href="/volunteers" className="font-medium text-brand-600 hover:underline dark:text-brand-400">জানুন কীভাবে যুক্ত হবেন</Link></p>}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-700 to-brand-600 p-8 text-center text-white shadow-2xl sm:p-14">
          <Droplet className="float absolute -right-6 -top-6 h-40 w-40 fill-white/10 text-white/10" />
          <Droplet className="float absolute -bottom-8 left-6 h-28 w-28 fill-white/10 text-white/10" style={{ animationDelay: "1.5s" }} />
          <h2 className="relative text-2xl font-extrabold sm:text-4xl">আপনার এক ব্যাগ রক্ত কারো নতুন জীবন</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-red-100">আজই রক্তদাতা হিসেবে যুক্ত হোন এবং কুষ্টিয়ার মানুষের পাশে দাঁড়ান।</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/donors/register" className="rounded-full bg-white px-7 py-3 font-bold text-brand-700 shadow-lg transition hover:scale-105">রক্তদাতা হোন</Link>
            <Link href="/guidelines" className="flex items-center gap-2 rounded-full border border-white/40 px-7 py-3 font-medium transition hover:bg-white/10"><MapPin className="h-4 w-4" />রক্তদান নির্দেশিকা</Link>
          </div>
        </div>
      </section>
    </>
  );
}
