"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/components/AuthProvider";
import RequestForm from "@/components/forms/RequestForm";
export default function NewRequest() {
  const { profile, authFetch } = useAuth();
  const [done, setDone] = useState(false);
  async function onSubmit(data) {
    const body = JSON.stringify(data);
    const res = profile ? await authFetch("/api/requests", { method: "POST", body }) : await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body });
    if (res.ok) { setDone(true); toast.success("আবেদন জমা হয়েছে"); return true; }
    toast.error("তথ্য যাচাই করে আবার চেষ্টা করুন"); return false;
  }
  if (done) return <div className="mx-auto max-w-lg px-4 py-20 text-center"><h1 className="text-2xl font-bold text-brand-700">আবেদন জমা হয়েছে</h1><p className="mt-3 text-gray-600">অ্যাডমিন যাচাই করে প্রকাশ করবেন। জরুরি হলে সরাসরি <a className="text-brand-600 underline" href="/donors">রক্তদাতা তালিকা</a> থেকে যোগাযোগ করুন।</p></div>;
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">রক্তের জন্য আবেদন করুন</h1>
      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 transition dark:bg-slate-800 dark:ring-slate-700"><RequestForm onSubmit={onSubmit} submitLabel="আবেদন জমা দিন" /></div>
    </div>
  );
}
