"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Droplets, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "./AuthProvider";
import ThemeToggle from "./ThemeToggle";

const links = [["/donors", "রক্তদাতা খুঁজুন"], ["/requests", "রক্তের আবেদন"], ["/volunteers", "স্বেচ্ছাসেবক"], ["/about", "আমাদের সম্পর্কে"], ["/contact", "যোগাযোগ"]];
export default function Header() {
  const [open, setOpen] = useState(false);
  const { profile, loading, logout } = useAuth();
  const path = usePathname();
  if (path.startsWith("/dashboard")) return null;
  const authLinks = loading ? null : profile ? (
    <>
      <Link href="/dashboard" className="rounded-full bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700">ড্যাশবোর্ড</Link>
      <button onClick={logout} aria-label="লগআউট" className="text-gray-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"><LogOut className="h-5 w-5" /></button>
    </>
  ) : <Link href="/login" className="rounded-full bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700">লগইন / নিবন্ধন</Link>;
  return (
    <header className="sticky top-0 z-20 border-b border-gray-200/80 bg-white/90 backdrop-blur transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-700 dark:text-brand-500">
          <Droplets className="h-6 w-6" />
          <span className="text-sm sm:text-base text-gray-900 dark:text-slate-100">SR ব্লাড ডোনেট ফাউন্ডেশন</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm lg:flex">
          {links.map(([h, t]) => (
            <Link key={h} href={h} className="text-gray-700 transition hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400">
              {t}
            </Link>
          ))}
          <ThemeToggle />
          {authLinks}
        </nav>
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button aria-label="মেনু" className="p-1.5 text-gray-700 dark:text-slate-200" onClick={() => setOpen(!open)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="grid gap-1 border-t border-gray-200 px-4 pb-4 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 lg:hidden" onClick={() => setOpen(false)}>
          {links.map(([h, t]) => (
            <Link key={h} href={h} className="rounded-lg px-3 py-2 text-gray-800 hover:bg-brand-50 dark:text-slate-200 dark:hover:bg-slate-800">
              {t}
            </Link>
          ))}
          {!loading && (
            profile ? (
              <>
                <Link href="/dashboard" className="rounded-lg px-3 py-2 font-medium text-brand-700 dark:text-brand-400">
                  ড্যাশবোর্ড
                </Link>
                <button onClick={logout} className="rounded-lg px-3 py-2 text-left text-gray-700 dark:text-slate-300">
                  লগআউট
                </button>
              </>
            ) : (
              <Link href="/login" className="rounded-lg px-3 py-2 font-medium text-brand-700 dark:text-brand-400">
                লগইন / নিবন্ধন
              </Link>
            )
          )}
        </nav>
      )}
    </header>
  );
}
