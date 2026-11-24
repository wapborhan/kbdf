"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Droplets, UserCog, Menu, LogOut, Home, Droplet, Loader2, Clock, User } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { isStaff } from "@/lib/permissions";
import { Avatar, Badge } from "@/components/dashboard/ui";
import ProfileForm from "@/components/forms/ProfileForm";
import ThemeToggle from "@/components/ThemeToggle";
import toast from "react-hot-toast";

const nav = [["/dashboard", "ওভারভিউ", LayoutDashboard], ["/dashboard/donors", "রক্তদাতা", Users], ["/dashboard/requests", "রক্তের আবেদন", Droplets], ["/dashboard/users", "ব্যবহারকারী", UserCog, true], ["/dashboard/profile", "আমার প্রোফাইল", User]];

export default function Shell({ user: profile, children }) {
  const { logout, saveProfile } = useAuth();
  const path = usePathname(), router = useRouter();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  if (!isStaff(profile.role) && !profile.profileComplete) return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-xl ring-1 ring-gray-200 transition-colors duration-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-8">
        <h1 className="text-xl font-bold">আপনার তথ্য দিয়ে নিবন্ধন সম্পূর্ণ করুন</h1>
        <p className="mb-6 mt-1 text-sm text-gray-600 dark:text-slate-400">{profile.email} — অনুমোদনের জন্য নিচের তথ্যগুলো প্রয়োজন।</p>
        <ProfileForm defaultValues={{ fullName: profile.name }} submitLabel="নিবন্ধন সম্পূর্ণ করুন" onSubmit={async (d) => { const r = await saveProfile(d); if (r.ok) { toast.success("তথ্য সংরক্ষিত হয়েছে"); router.refresh(); } else toast.error(r.error || "সংরক্ষণ ব্যর্থ"); }} />
        <button onClick={logout} className="mt-4 text-sm text-gray-500 hover:underline dark:text-slate-400">লগআউট</button>
      </div>
    </div>
  );
  if (!profile.approved) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-gray-200 transition-colors duration-200 dark:bg-slate-900 dark:ring-slate-800">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"><Clock className="h-8 w-8" /></span>
        <h1 className="mt-5 text-xl font-bold">অনুমোদনের অপেক্ষায়</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">আপনার নিবন্ধন সম্পন্ন হয়েছে ({profile.email})। ড্যাশবোর্ড ব্যবহারের জন্য একজন অ্যাডমিন বা মডারেটরের অনুমোদন প্রয়োজন। অনুমোদন হলে এখানে প্রবেশ করতে পারবেন।</p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => router.refresh()} className="rounded-xl bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700">আবার পরীক্ষা করুন</button>
          <button onClick={logout} className="rounded-xl border px-5 py-2 text-sm hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800">লগআউট</button>
        </div>
        <Link href="/" className="mt-4 inline-block text-xs text-gray-500 hover:underline dark:text-slate-400">ওয়েবসাইটে ফিরুন</Link>
      </div>
    </div>
  );
  const items = nav.filter((n) => !n[3] || isStaff(profile.role));
  const title = (items.find((n) => (n[0] === "/dashboard" ? path === n[0] : path.startsWith(n[0]))) || nav[0])[1];
  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 text-slate-300 transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <Link href="/dashboard" className="flex items-center gap-3 px-5 py-5 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-700 shadow-lg"><Droplet className="h-5 w-5 fill-white" /></span>
          <span className="text-sm font-bold leading-tight">SR ব্লাড ডোনেট<br />ফাউন্ডেশন</span>
        </Link>
        <nav className="flex-1 space-y-1 px-3 py-2">
          {items.map(([href, label, I]) => {
            const on = href === "/dashboard" ? path === href : path.startsWith(href);
            return <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${on ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/30" : "hover:bg-white/10 hover:text-white"}`}><I className="h-5 w-5" />{label}</Link>;
          })}
          <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-white/10 hover:text-white"><Home className="h-5 w-5" />ওয়েবসাইট</Link>
        </nav>
        <div className="m-3 rounded-2xl bg-white/5 p-3">
          <div className="flex items-center gap-3"><Avatar name={profile.name} src={profile.photoUrl} /><div className="min-w-0"><p className="truncate text-sm font-medium text-white">{profile.name}</p><p className="truncate text-xs text-slate-400">{profile.email}</p></div></div>
          <button onClick={logout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-2 text-sm hover:bg-white/20"><LogOut className="h-4 w-4" />লগআউট</button>
        </div>
      </aside>
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-black/50 lg:hidden" />}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-gray-200/80 bg-white/80 px-4 py-3 backdrop-blur transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
          <button aria-label="মেনু" onClick={() => setOpen(true)} className="rounded-lg p-1.5 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"><Menu className="h-6 w-6" /></button>
          <h1 className="flex-1 text-lg font-bold">{title}</h1>
          <ThemeToggle />
          <Badge v={profile.role} />
        </header>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
