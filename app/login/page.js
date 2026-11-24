"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/components/AuthProvider";
export default function Login() {
  const { profile, loading, login } = useAuth();
  const router = useRouter();
  useEffect(() => { if (profile) router.replace("/dashboard"); }, [profile, router]);
  async function go() {
    try { await login(); } catch (e) { if (e.code !== "auth/popup-closed-by-user") toast.error("Google লগইন ব্যর্থ হয়েছে"); }
  }
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 transition dark:bg-slate-800 dark:ring-slate-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">লগইন / নিবন্ধন</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">নিবন্ধন ও লগইন শুধুমাত্র Google অ্যাকাউন্টের মাধ্যমে। প্রথমবার লগইন করলেই আপনার অ্যাকাউন্ট তৈরি হবে।</p>
        <button onClick={go} disabled={loading} className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-700/60 dark:text-slate-100 dark:hover:bg-slate-700">
          <svg viewBox="0 0 48 48" className="h-5 w-5"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"/><path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.600 2.600 10.800l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.500 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.300 0-11.600-4.100-13.500-9.800l-7.9 6.1C6.5 42.6 14.600 48 24 48z"/></svg>
          Google দিয়ে চালিয়ে যান
        </button>
      </div>
    </div>
  );
}
