"use client";
import Link from "next/link";
import { useState } from "react";
import { Droplets, Menu, X } from "lucide-react";
const links = [["/donors", "রক্তদাতা খুঁজুন"], ["/requests", "রক্তের আবেদন"], ["/guidelines", "নির্দেশিকা"], ["/about", "আমাদের সম্পর্কে"], ["/contact", "যোগাযোগ"]];
export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-700"><Droplets className="h-6 w-6" /><span className="text-sm sm:text-base">কুষ্টিয়া ব্লাড ডোনেট ফাউন্ডেশন</span></Link>
        <nav className="hidden items-center gap-6 text-sm lg:flex">
          {links.map(([h, t]) => <Link key={h} href={h} className="hover:text-brand-600">{t}</Link>)}
          <Link href="/donors/register" className="rounded-full bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700">নিবন্ধন</Link>
        </nav>
        <button aria-label="মেনু" className="lg:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <nav className="grid gap-1 border-t px-4 pb-4 lg:hidden">
          {[...links, ["/donors/register", "রক্তদাতা নিবন্ধন"]].map(([h, t]) => <Link key={h} href={h} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-brand-50">{t}</Link>)}
        </nav>
      )}
    </header>
  );
}
