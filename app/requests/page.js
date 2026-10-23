"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import RequestCard from "@/components/RequestCard";
export default function Requests() {
  const [list, setList] = useState(null);
  useEffect(() => { fetch("/api/requests").then((r) => r.json()).then((j) => setList(j.requests || [])).catch(() => setList([])); }, []);
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold sm:text-3xl">রক্তের আবেদন</h1><Link href="/requests/new" className="rounded-full bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700">নতুন আবেদন</Link></div>
      <div className="mt-6 grid gap-4">
        {list === null ? <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-600" /> : list.length === 0 ? <p className="rounded-2xl bg-white p-8 text-center text-gray-500 ring-1 ring-gray-200">এখন কোনো সক্রিয় আবেদন নেই।</p> : list.map((r) => <RequestCard key={r._id} r={r} />)}
      </div>
    </div>
  );
}
