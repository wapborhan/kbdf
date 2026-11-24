import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-extrabold text-brand-600">৪০৪</h1>
      <h2 className="mt-4 text-2xl font-bold text-slate-800 dark:text-slate-100">
        পৃষ্ঠাটি পাওয়া যায়নি
      </h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        আপনি যে লিংকটি খুঁজছেন তা মুছে ফেলা হয়েছে অথবা ভুল ইউআরএল প্রদান করেছেন।
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
      >
        হোমপেজে ফিরে যান
      </Link>
    </div>
  );
}
