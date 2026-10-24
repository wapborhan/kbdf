"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
// Shown when the server has no session cookie: sends guests to /login, or re-syncs a signed-in browser.
export default function SessionGate() {
  const { loading, profile, logout } = useAuth();
  const router = useRouter();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (loading) return;
    if (!profile) { router.replace("/login"); return; }
    router.refresh();
    const t = setTimeout(() => setFailed(true), 6000);
    return () => clearTimeout(t);
  }, [loading, profile, router]);
  if (failed) return <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-4 text-center"><p>সেশন তৈরি করা যায়নি। আবার লগইন করুন।</p><button onClick={logout} className="rounded-xl bg-brand-600 px-5 py-2 text-white">লগআউট</button></div>;
  return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand-600" /></div>;
}
