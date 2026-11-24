import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
// Server component: plain links that keep the current filters.
export default function Pager({ page, pages, total, path, params = {}, bare = false }) {
  const href = (p) => { const sp = new URLSearchParams(params); sp.set("page", p); return `${path}?${sp}`; };
  const btn = "rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-slate-300";
  return (
    <div className={`flex items-center justify-between px-4 py-3 text-sm text-gray-500 dark:text-slate-400 ${bare ? "" : "border-t border-gray-200 dark:border-slate-800"}`}>
      <span>মোট {total.toLocaleString("bn-BD")} টি</span>
      <div className="flex items-center gap-2">
        {page > 1 ? <Link href={href(page - 1)} scroll={false} className={btn}><ChevronLeft className="h-4 w-4" /></Link> : <span className={`${btn} opacity-30`}><ChevronLeft className="h-4 w-4" /></span>}
        <span>{page.toLocaleString("bn-BD")} / {pages.toLocaleString("bn-BD")}</span>
        {page < pages ? <Link href={href(page + 1)} scroll={false} className={btn}><ChevronRight className="h-4 w-4" /></Link> : <span className={`${btn} opacity-30`}><ChevronRight className="h-4 w-4" /></span>}
      </div>
    </div>
  );
}
