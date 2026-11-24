"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import DonorForm from "@/components/forms/DonorForm";
export default function Register() {
  const [done, setDone] = useState(false);
  async function onSubmit(data) {
    const res = await fetch("/api/donors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const j = await res.json().catch(() => ({}));
    if (res.ok) { setDone(true); toast.success("নিবন্ধন জমা হয়েছে"); return true; }
    toast.error(typeof j.error === "string" ? j.error : "তথ্য যাচাই করে আবার চেষ্টা করুন");
    return false;
  }
  if (done) return <div className="mx-auto max-w-lg px-4 py-20 text-center"><h1 className="text-2xl font-bold text-brand-700">ধন্যবাদ!</h1><p className="mt-3 text-gray-600">আপনার তথ্য অ্যাডমিনের অনুমোদনের অপেক্ষায় আছে। অনুমোদনের পর আপনি রক্তদাতা তালিকায় আসবেন।</p></div>;
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">রক্তদাতা হিসেবে নিবন্ধন করুন</h1>
      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 transition dark:bg-slate-800 dark:ring-slate-700"><DonorForm onSubmit={onSubmit} submitLabel="নিবন্ধন জমা দিন" consent /></div>
    </div>
  );
}
