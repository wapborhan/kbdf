"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, LogIn } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import RequestForm from "@/components/forms/RequestForm";
import Modal from "@/components/Modal";
import { Badge, GroupPill } from "@/components/dashboard/ui";
import { fmtDate } from "@/lib/utils";

// Small client islands: they only need the browser's login (everything else on /requests is server-rendered).
export function AddRequestButton() {
  const { profile, authFetch } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  async function submit(data) {
    const body = JSON.stringify(data);
    const res = profile ? await authFetch("/api/requests", { method: "POST", body }) : await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body });
    if (res.ok) { toast.success("আবেদন জমা হয়েছে — যাচাইয়ের পর প্রকাশিত হবে"); setOpen(false); router.refresh(); return true; }
    toast.error("তথ্য যাচাই করে আবার চেষ্টা করুন"); return false;
  }
  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-brand-700"><Plus className="h-4 w-4" />রক্তের জন্য আবেদন করুন</button>
      {open && <Modal title="রক্তের জন্য আবেদন করুন" onClose={() => setOpen(false)}><RequestForm onSubmit={submit} submitLabel="আবেদন জমা দিন" /></Modal>}
    </>
  );
}
export function MyRequests() {
  const { profile, loading, authFetch } = useAuth();
  const [mine, setMine] = useState([]);
  useEffect(() => {
    if (!profile) { setMine([]); return; }
    authFetch("/api/requests?mine=1").then((r) => r.ok ? r.json() : { requests: [] }).then((j) => setMine(j.requests)).catch(() => {});
  }, [profile, authFetch]);
  if (loading) return null;
  if (!profile) return <p className="mt-3 flex flex-wrap items-center gap-1 text-sm text-gray-500"><LogIn className="h-4 w-4" />লগইন করে আবেদন করলে আপনার আবেদনের অবস্থা এখানে দেখতে পাবেন। <Link href="/login" className="font-medium text-brand-600 hover:underline">লগইন করুন</Link></p>;
  if (!mine.length) return null;
  return (
    <section className="mt-8">
      <h2 className="font-bold">আমার আবেদন</h2>
      <div className="mt-3 grid gap-3">{mine.map((r) => (
        <div key={r._id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 text-sm shadow-sm ring-1 ring-gray-200">
          <GroupPill g={r.bloodGroup} /><span className="font-medium">{r.patientName}</span>
          <span className="flex-1 text-gray-500">{r.hospital}, {r.upazila} · {fmtDate(r.neededBy)}</span><Badge v={r.status} />
        </div>))}</div>
    </section>
  );
}
