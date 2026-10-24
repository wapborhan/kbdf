"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Droplets, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "./AuthProvider";
const links = [["/donors", "রক্তদাতা খুঁজুন"], ["/requests", "রক্তের আবেদন"], ["/volunteers", "স্বেচ্ছাসেবক"], ["/about", "আমাদের সম্পর্কে"], ["/contact", "যোগাযোগ"]];
export default function Header() {
  const [open, setOpen] = useState(false);
  const { profile, loading, logout } = useAuth();
  const path = usePathname();
  if (path.startsWith("/dashboard")) return null;
  const authLinks = loading ? null : profile ? (
    <>
      <Link href="/dashboard" className="rounded-full bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700">ড্যাশবোর্ড</Link>
      <button onClick={logout} aria-label="লগআউট" className="text-gray-500 hover:text-brand-600"><LogOut className="h-5 w-5" /></button>
    </>
  ) : <Link href="/login" className="rounded-full bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700">লগইন / নিবন্ধন</Link>;
  return (
    <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-700"><Droplets className="h-6 w-6" /><span className="text-sm sm:text-base">কুষ্টিয়া ব্লাড ডোনেট ফাউন্ডেশন</span></Link>
        <nav className="hidden items-center gap-6 text-sm lg:flex">
          {links.map(([h, t]) => <Link key={h} href={h} className="hover:text-brand-600">{t}</Link>)}
          {authLinks}
        </nav>
        <button aria-label="মেনু" className="lg:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <nav className="grid gap-1 border-t px-4 pb-4 lg:hidden" onClick={() => setOpen(false)}>
          {links.map(([h, t]) => <Link key={h} href={h} className="rounded-lg px-3 py-2 hover:bg-brand-50">{t}</Link>)}
          {!loading && (profile ? <><Link href="/dashboard" className="rounded-lg px-3 py-2 font-medium text-brand-700">ড্যাশবোর্ড</Link><button onClick={logout} className="rounded-lg px-3 py-2 text-left">লগআউট</button></> : <Link href="/login" className="rounded-lg px-3 py-2 font-medium text-brand-700">লগইন / নিবন্ধন</Link>)}
        </nav>
      )}
    </header>
  );
}
