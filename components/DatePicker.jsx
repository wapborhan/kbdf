"use client";
import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { MONTHS, isoDate, todayISO, fmtDate } from "@/lib/utils";

const DAYS = ["র", "সো", "ম", "বু", "বৃ", "শু", "শ"];
const bn = (n) => n.toLocaleString("bn-BD", { useGrouping: false });

// Modern popover calendar. value/min/max are "YYYY-MM-DD" strings.
export default function DatePicker({ value, onChange, min, max, placeholder = "তারিখ নির্বাচন করুন" }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({});
  const sel = value ? new Date(value + "T00:00:00") : null;
  const [view, setView] = useState(() => sel || new Date());
  const btn = useRef(null), box = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (!box.current?.contains(e.target) && !btn.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, [open]);

  function toggle() {
    if (!open) {
      const r = btn.current.getBoundingClientRect();
      const up = r.bottom + 360 > window.innerHeight && r.top > 360;
      setPos({ left: Math.max(8, Math.min(r.left, window.innerWidth - 296)), ...(up ? { bottom: window.innerHeight - r.top + 8 } : { top: r.bottom + 8 }) });
      setView(sel || new Date());
    }
    setOpen(!open);
  }
  const y = view.getFullYear(), m = view.getMonth();
  const cells = [...Array(new Date(y, m, 1).getDay()).fill(null), ...Array.from({ length: new Date(y, m + 1, 0).getDate() }, (_, i) => i + 1)];
  const off = (d) => { const s = isoDate(new Date(y, m, d)); return (min && s < min) || (max && s > max); };
  const pick = (v) => { onChange(v); setOpen(false); };
  const cy = new Date().getFullYear();

  return (
    <>
      <button type="button" ref={btn} onClick={toggle} className="flex w-full items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-left text-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-brand-500 dark:focus:ring-brand-900/30">
        <Calendar className="h-4 w-4 text-brand-600 dark:text-brand-400" />
        <span className={`flex-1 ${value ? "" : "text-gray-400 dark:text-slate-500"}`}>{value ? fmtDate(value) : placeholder}</span>
        {value && <span role="button" aria-label="মুছুন" onClick={(e) => { e.stopPropagation(); onChange(""); }} className="rounded-full p-0.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-slate-400"><X className="h-4 w-4" /></span>}
      </button>
      {open && (
        <div ref={box} style={pos} onClick={(e) => e.preventDefault()} className="fixed z-[60] w-72 rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-gray-200 transition dark:bg-slate-800 dark:ring-slate-700 dark:text-slate-100">
          <div className="mb-2 flex items-center justify-between gap-1">
            <button type="button" onClick={() => setView(new Date(y, m - 1, 1))} className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700"><ChevronLeft className="h-4 w-4" /></button>
            <div className="flex items-center gap-1 text-sm font-semibold">
              <select value={m} onChange={(e) => setView(new Date(y, +e.target.value, 1))} className="rounded-lg bg-transparent px-1 py-1 hover:bg-gray-100 dark:hover:bg-slate-700 dark:bg-slate-800">{MONTHS.map((n, i) => <option key={n} value={i} className="dark:bg-slate-800">{n}</option>)}</select>
              <select value={y} onChange={(e) => setView(new Date(+e.target.value, m, 1))} className="rounded-lg bg-transparent px-1 py-1 hover:bg-gray-100 dark:hover:bg-slate-700 dark:bg-slate-800">{Array.from({ length: 80 }, (_, i) => cy + 5 - i).map((yr) => <option key={yr} value={yr} className="dark:bg-slate-800">{bn(yr)}</option>)}</select>
            </div>
            <button type="button" onClick={() => setView(new Date(y, m + 1, 1))} className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700"><ChevronRight className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-7 text-center text-xs text-gray-400 dark:text-slate-400">{DAYS.map((d) => <span key={d} className="py-1">{d}</span>)}</div>
          <div className="grid grid-cols-7 gap-0.5 text-center text-sm">
            {cells.map((d, i) => d === null ? <span key={i} /> : (() => {
              const s = isoDate(new Date(y, m, d));
              return <button key={i} type="button" disabled={off(d)} onClick={() => pick(s)} className={`aspect-square rounded-lg transition ${s === value ? "bg-brand-600 font-bold text-white" : s === todayISO() ? "font-bold text-brand-600 ring-1 ring-brand-600 dark:text-brand-400 dark:ring-brand-400" : "hover:bg-brand-50 dark:hover:bg-slate-700"} disabled:cursor-not-allowed disabled:text-gray-300 dark:disabled:text-slate-600 disabled:hover:bg-transparent`}>{bn(d)}</button>;
            })())}
          </div>
          <div className="mt-2 flex justify-between border-t border-gray-100 dark:border-slate-700 pt-2 text-xs">
            <button type="button" onClick={() => pick("")} className="text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-200">মুছুন</button>
            <button type="button" disabled={(min && todayISO() < min) || (max && todayISO() > max)} onClick={() => pick(todayISO())} className="font-medium text-brand-600 disabled:text-gray-300 dark:text-brand-400 dark:disabled:text-slate-600">আজ</button>
          </div>
        </div>
      )}
    </>
  );
}
