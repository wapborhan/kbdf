"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2, X } from "lucide-react";

// Writes filters into the URL (?q=&bloodGroup=...). The SERVER page re-renders and runs the query; nothing is filtered here.
export default function FilterBar({ placeholder = "খুঁজুন", fields = [], children }) {
  const router = useRouter(), path = usePathname(), sp = useSearchParams();
  const [pending, start] = useTransition();
  const [q, setQ] = useState(sp.get("q") || "");
  const timer = useRef();
  const push = (patch) => {
    const n = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(patch)) v ? n.set(k, v) : n.delete(k);
    n.delete("page");
    start(() => router.replace(n.toString() ? `${path}?${n}` : path, { scroll: false }));
  };
  useEffect(() => {
    if (q.trim() === (sp.get("q") || "")) return;
    timer.current = setTimeout(() => push({ q: q.trim() }), 350); // live search, debounced
    return () => clearTimeout(timer.current);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps
  const active = [...sp.keys()].some((k) => k !== "page");
  const cls = "rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-600";
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} className={`${cls} w-full pl-9 pr-9`} />
        {pending && <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-brand-600" />}
      </div>
      {fields.map((f) => (
        <select key={f.name} value={sp.get(f.name) || ""} onChange={(e) => push({ [f.name]: e.target.value })} className={cls}>
          <option value="">{f.label}</option>
          {f.options.map((o) => { const [v, l] = Array.isArray(o) ? o : [o, o]; return <option key={v} value={v}>{l}</option>; })}
        </select>
      ))}
      {active && <button onClick={() => { setQ(""); start(() => router.replace(path, { scroll: false })); }} className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"><X className="h-4 w-4" />মুছুন</button>}
      {children}
    </div>
  );
}
