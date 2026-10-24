"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
export default function Footer() {
  if (usePathname().startsWith("/dashboard")) return null;
  const l = [["/about", "আমাদের সম্পর্কে"], ["/guidelines", "রক্তদান নির্দেশিকা"], ["/volunteers", "স্বেচ্ছাসেবক"], ["/faq", "সাধারণ প্রশ্ন"], ["/contact", "যোগাযোগ"], ["/privacy", "গোপনীয়তা নীতি"], ["/terms", "শর্তাবলী"]];
  return (
    <footer className="mt-16 bg-brand-900 text-red-100">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-2">
        <div><p className="text-lg font-bold text-white">কুষ্টিয়া ব্লাড ডোনেট ফাউন্ডেশন</p><p className="mt-2 text-sm">রক্ত দিন, জীবন বাঁচান — কুষ্টিয়ার স্বেচ্ছাসেবী রক্তদাতাদের নেটওয়ার্ক।</p></div>
        <ul className="grid grid-cols-2 gap-2 text-sm">{l.map(([h, t]) => <li key={h}><Link href={h} className="hover:text-white">{t}</Link></li>)}</ul>
      </div>
      <p className="border-t border-red-800 py-4 text-center text-xs">© {new Date().getFullYear()} কুষ্টিয়া ব্লাড ডোনেট ফাউন্ডেশন</p>
    </footer>
  );
}
