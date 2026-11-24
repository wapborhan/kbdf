// Plain presentational components: usable from server AND client components (no hooks / handlers here).
const style = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-1 dark:ring-amber-800/40",
  active: "bg-green-100 text-green-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-1 dark:ring-emerald-800/40",
  inactive: "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400 dark:ring-1 dark:ring-slate-700",
  approved: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-1 dark:ring-blue-800/40",
  fulfilled: "bg-green-100 text-green-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-1 dark:ring-emerald-800/40",
  cancelled: "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400 dark:ring-1 dark:ring-slate-700",
  admin: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 dark:ring-1 dark:ring-red-800/40",
  moderator: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-1 dark:ring-violet-800/40",
  volunteer: "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 dark:ring-1 dark:ring-teal-800/40",
  user: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:ring-1 dark:ring-slate-700"
};
export const LABEL = { pending: "অপেক্ষমাণ", active: "সক্রিয়", inactive: "নিষ্ক্রিয়", approved: "চলমান", fulfilled: "পূরণ হয়েছে", cancelled: "বাতিল", admin: "অ্যাডমিন", moderator: "মডারেটর", volunteer: "স্বেচ্ছাসেবক", user: "ব্যবহারকারী" };

export const Badge = ({ v }) => <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${style[v] || ""}`}>{LABEL[v] || v}</span>;
export const GroupPill = ({ g }) => <span className="inline-flex h-7 min-w-[2.25rem] items-center justify-center rounded-lg bg-brand-50 px-2 text-sm font-bold text-brand-700 ring-1 ring-red-100 dark:bg-slate-700/80 dark:text-brand-400 dark:ring-slate-600">{g}</span>;
export const Card = ({ className = "", children }) => <div className={`rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-colors duration-200 dark:bg-slate-800/90 dark:ring-slate-700/80 dark:text-slate-100 ${className}`}>{children}</div>;
export const Avatar = ({ name = "?", src }) => src
  ? <img src={src} alt="" referrerPolicy="no-referrer" className="h-9 w-9 shrink-0 rounded-full object-cover" />
  : <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-900 text-sm font-bold text-white">{(name.trim()[0] || "?").toUpperCase()}</span>;

export function StatCard({ icon: I, label, value, sub, tone = "from-red-500 to-red-700" }) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${tone}`}><I className="h-6 w-6" /></span>
      <div className="min-w-0"><p className="text-2xl font-extrabold text-gray-900 dark:text-slate-100">{Number(value).toLocaleString("bn-BD")}</p><p className="truncate text-sm text-gray-500 dark:text-slate-400">{label}</p>{sub && <p className="truncate text-xs text-gray-400 dark:text-slate-500">{sub}</p>}</div>
    </Card>
  );
}
export const th = "whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400";
export const td = "px-4 py-3 align-middle text-gray-900 dark:text-slate-200";
