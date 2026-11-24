"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
export default function Footer() {
  if (usePathname().startsWith("/dashboard")) return null;
  const l = [
    ["/about", "আমাদের সম্পর্কে"],
    ["/guidelines", "রক্তদান নির্দেশিকা"],
    ["/volunteers", "স্বেচ্ছাসেবক"],
    ["/faq", "সাধারণ প্রশ্ন"],
    ["/contact", "যোগাযোগ"],
    ["/privacy", "গোপনীয়তা নীতি"],
    ["/terms", "শর্তাবলী"],
  ];
  return (
    <footer className="mt-16 bg-brand-900 text-red-100 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-2">
        <div>
          <p className="text-lg font-bold text-white">
            SR ব্লাড ডোনেট ফাউন্ডেশন
          </p>
          <p className="mt-2 text-sm text-red-200 dark:text-slate-400">
            রক্ত দিন, জীবন বাঁচান — কুষ্টিয়ার স্বেচ্ছাসেবী রক্তদাতাদের
            নেটওয়ার্ক।
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-2 text-sm">
          {l.map(([h, t]) => (
            <li key={h}>
              <Link
                href={h}
                className="transition hover:text-white dark:hover:text-white"
              >
                {t}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-red-800/80 px-4 py-4 text-xs text-red-200 dark:border-slate-800 dark:text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-center sm:flex-row">
          <p>© {new Date().getFullYear()} SR ব্লাড ডোনেট ফাউন্ডেশন</p>
          <p>
            Developed by{" "}
            <a
              href="https://www.wapborhan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white underline decoration-red-400 hover:text-red-200 dark:decoration-slate-500 dark:hover:text-white"
            >
              Borhan Uddin
            </a>{" "}
          </p>
        </div>
      </div>
    </footer>
  );
}
